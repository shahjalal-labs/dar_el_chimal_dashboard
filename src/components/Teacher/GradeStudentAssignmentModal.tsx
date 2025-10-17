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
    id: string;
    onClose: () => void;
}

const GradeStudentAssignmentModal = ({ id, onClose, }: GradeStudentAssignmentModalProps) => {
    const assignmentProgressId = id;

    const { data, isLoading } = useGetStudentAssignmentDetailsByTeacherQuery(assignmentProgressId);

    const [GradeAssignment, { isLoading: isGrading }] = useGradeAssignmentMutation();

    const [feedback, setFeedback] = useState("");
    const [grade, setGrade] = useState("");

    useEffect(() => {
        if (data?.result) {
            setFeedback(data.result.FeedBack || "");
            setGrade(data.result.assignmentGrade || "");
        }
    }, [data]);

    const result = data?.result;

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
            toast.error(
                error?.data?.message || "Something went wrong while grading assignment."
            );
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
            {/* Assignment Header */}
            <div className="bg-white p-6 rounded-lg mb-6 border">
                <h2 className="text-2xl font-bold mb-3">Summarize Photosynthesis</h2>
                <p className="text-[#4C4C4C] mb-6">
                    Read this page and write a short summary of how photosynthesis works.
                </p>

                <div className="flex items-start gap-6 text-sm">
                    <div className="font-medium text-gray-800 space-y-2">
                        <p>Name:</p>
                        <p>Status:</p>
                        <p>Submitted On:</p>
                    </div>
                    <div className="text-gray-600 space-y-2">
                        <p>{result?.user?.fullName || "N/A"}</p>
                        <p>{result?.assignmentGrade || "Not Graded"}</p>
                        <p>
                            {result?.submittedAt
                                ? new Date(result.submittedAt).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "long",
                                })
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Answer Section */}
            <div className="px-6">
                <h3 className="font-semibold mb-4">Answer</h3>
                <p className="text-[#4C4C4C] leading-relaxed mb-4">
                    {result?.studentAnswer ?? "No answer provided by the student."}
                </p>

                {result?.studentAttachement && (
                    <>
                        <p className="font-semibold mb-2">
                            Attachment:
                            <span className="ml-1 text-[#4C4C4C]">
                                {result.studentAttachement.split("/").pop()}
                            </span>
                        </p>
                        <div className="rounded-lg overflow-hidden border w-full md:w-[80%] mx-auto my-6">
                            <iframe
                                src={result.studentAttachement}
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
                            required
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none bg-white"
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