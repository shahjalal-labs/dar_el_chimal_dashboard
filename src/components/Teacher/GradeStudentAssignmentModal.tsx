/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
    useGetStudentAssignmentDetailsByTeacherQuery,
    useGradeAssignmentMutation,
} from "@/redux/api/teacher/overviewApi";
import { DialogContent } from "../ui/dialog";
import { toast } from "sonner";
import { PiSpinner } from "react-icons/pi";

interface GradeStudentAssignmentModalProps {
    assignmentProgressId: string;
    onClose: () => void;
}

const GradeStudentAssignmentModal = ({ assignmentProgressId, onClose, }: GradeStudentAssignmentModalProps) => {
    const [grade, setGrade] = useState("");
    const [feedback, setFeedback] = useState("");

    const { data, isLoading } = useGetStudentAssignmentDetailsByTeacherQuery(assignmentProgressId);

    const [GradeAssignment, { isLoading: isGrading }] = useGradeAssignmentMutation();

    useEffect(() => {
        if (data?.result) {
            setFeedback(data?.result?.FeedBack || "");
            setGrade(data?.result?.assignmentGrade || "");
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const body = {
            grade,
            feedback,
        };

        try {
            const response = await GradeAssignment({ assignmentProgressId, body }).unwrap();
            if (response.success) {
                toast.success(response.message || "Assignment graded successfully.");
                onClose();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong while grading assignment.");
        }
    };

    if (isLoading) {
        return (
            <DialogContent className="min-w-[50%] h-[70%] flex justify-center items-center">
                <p className="text-gray-600 text-sm">Loading assignment details...</p>
            </DialogContent>
        );
    }

    return (
        <DialogContent className="min-w-[50%] h-[70%] overflow-y-auto">
            <h1 className="text-2xl font-bold px-6 mt-6">Edit Grade</h1>
            {/* Assignment Header */}
            <div className="bg-white p-6 mb-6">
                <h2 className="text-2xl font-bold mb-3">{data?.result?.assignment?.title}</h2>
                <p className="text-[#4C4C4C] mb-6">{data?.result?.assignment?.instruction}</p>

                <div className="flex items-center gap-6">
                    <div className="">
                        <span className="font-medium">Name:</span><br />
                        <span className="font-medium">Status:</span><br />
                        <span className="font-medium">Submitted On:</span>
                    </div>
                    <div className="">
                        <span className="text-[#4C4C4C]">{data?.result?.user?.fullName ? data?.result?.user?.fullName : 'N/A'}</span><br />
                        {data?.result?.assignmentGrade ? (
                            <><span className="text-[#4C4C4C]">
                                {
                                    data?.result?.assignmentGrade === "A_plus" ? 'A+' :
                                        data?.result?.assignmentGrade === "A" ? 'A' :
                                            data?.result?.assignmentGrade === "A_minus" ? 'A-' :
                                                data?.result?.assignmentGrade === "B_plus" ? 'B+' :
                                                    data?.result?.assignmentGrade === "B" ? 'B' :
                                                        data?.result?.assignmentGrade === "B_minus" ? 'B-' :
                                                            data?.result?.assignmentGrade === "C_plus" ? 'C+' :
                                                                data?.result?.assignmentGrade === "C" ? 'C' :
                                                                    data?.result?.assignmentGrade === "C_minus" ? 'C-' :
                                                                        data?.result?.assignmentGrade === "D" ? 'D' : 'F'
                                }
                            </span><br /></>
                        ) : (
                            <><span className="text-[#4C4C4C]">Not Graded</span><br /></>
                        )}
                        <span className="text-[#4C4C4C]">{new Date(data?.result?.submittedAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                        })}</span>
                    </div>
                </div>
            </div>

            {/* Answer Section */}
            <div className="px-6">
                <h3 className="font-semibold mb-4">Answer</h3>
                <p className="text-[#4C4C4C] leading-relaxed mb-4">{data?.result?.studentAnswer ?? "No answer provided by the student."}</p>

                {data?.result?.studentAttachement && (
                    <>
                        <p className="font-semibold mb-2">Attachment: <span className="ml-1">{data?.result?.studentAttachement.split("/").pop()}</span></p>
                        <div className="rounded-lg overflow-hidden border w-full md:w-[60%] mx-auto my-6">
                            <iframe
                                src={data?.result?.studentAttachement}
                                className="w-full h-[400px]"
                                title="Student Attachment"
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Grading Form */}
            <form onSubmit={handleSubmit} className="px-6 pb-6">
                <div className="space-y-4">
                    {/* Grade Select */}
                    <div>
                        <label className="font-semibold mb-1.5 block">Grade</label>
                        <select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none bg-white"
                            required
                        >
                            <option value="">Select Grade</option>
                            <option value="A_plus">A+</option>
                            <option value="A">A</option>
                            <option value="A_minus">A-</option>
                            <option value="B_plus">B+</option>
                            <option value="B">B</option>
                            <option value="B_minus">B-</option>
                            <option value="C_plus">C+</option>
                            <option value="C">C</option>
                            <option value="C_minus">C</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                        </select>
                    </div>

                    {/* Feedback Input */}
                    <div>
                        <label className="font-semibold mb-1.5 block">Feedback</label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter your feedback..."
                            className="w-full border rounded-md px-3 py-2 text-sm resize-none h-24 focus:outline-none bg-white mt-2"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center items-center gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isGrading}
                        className="px-6 py-2 bg-[#1E3A8A] hover:bg-blue-800 text-white rounded-md text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isGrading ? (
                            <>
                                <PiSpinner className="animate-spin h-4 w-4" />
                                Saving...
                            </>
                        ) : (
                            "Save Grade"
                        )}
                    </button>
                </div>
            </form>
        </DialogContent>
    );
};

export default GradeStudentAssignmentModal;