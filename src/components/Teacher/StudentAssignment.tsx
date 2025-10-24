"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetStudentAssignmentDetailsByTeacherQuery } from "@/redux/api/teacher/overviewApi";
import { SyncLoader } from "react-spinners";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const StudentAssignment = () => {
    const router = useRouter();
    const { assignmentProgressId } = useParams();
    const { data, isLoading } = useGetStudentAssignmentDetailsByTeacherQuery(assignmentProgressId);

    const result = data?.result;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20 gap-3">
                <span className="text-[#1E3A8A] font-medium">Loading Assignment...</span>
                <SyncLoader color="#1E3A8A" />
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-gray-600 text-center">No student assignment data found.</p>
            </div>
        );
    }

    return (
        <div className="">
            {/* Assignment Header */}
            <div className="bg-white p-6 rounded-lg mb-6">
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
            <div className="">
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
            <div className="">
                <div className="space-y-4">
                    {/* Grade Select */}
                    <div>
                        <label className="font-semibold mb-1.5">Grade</label>
                        <Input
                            value={
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
                            readOnly />
                    </div>

                    {/* Feedback Input */}
                    <div>
                        <label className="font-semibold mb-1.5">Feedback</label>
                        <textarea
                            value={data?.result?.FeedBack}
                            placeholder="Enter your feedback..."
                            className="w-full border rounded-md px-3 py-2 text-sm resize-none h-24 focus:outline-none bg-white mt-2"
                            readOnly
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center items-center gap-3 mt-6">
                    <Button
                        onClick={() => router.back()}
                        className="px-6 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Back
                    </Button>
                    <Button className="px-6 py-2 bg-[#1E3A8A] hover:bg-blue-800 text-white rounded-md text-sm font-medium cursor-pointer">
                        Grade Assignment
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StudentAssignment;