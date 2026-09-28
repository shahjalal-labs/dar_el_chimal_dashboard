/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Image from "next/image";
import { SyncLoader } from "react-spinners";
import { DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useGetStudentDetailsByTeacherQuery } from "@/redux/api/teacher/overviewApi";

const ViewStudentDetailsModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetStudentDetailsByTeacherQuery(id);
    const student = data?.result;

    if (isLoading) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-[#1E3A8A] font-medium">Data is Loading...</span>
                    <SyncLoader color="#1E3A8A" />
                </div>
            </DialogContent>
        );
    }

    if (!student) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <p className="text-center text-gray-700">No student data found!</p>
            </DialogContent>
        );
    }

    const { loginUserName, email, profileImage, role, fullName, status, joinedAt, StudentGrades, assignments } = student;

    const studentGrade = StudentGrades?.[0]?.grade?.grade ?? "N/A";
    const school = StudentGrades?.[0]?.grade?.school;

    return (
        <DialogContent className="p-6 max-h-[80vh] overflow-y-auto" showCloseButton>
            {/* Student Info */}
            <div className="flex items-start gap-4">
                <Image
                    src={profileImage}
                    alt={loginUserName}
                    width={120}
                    height={120}
                    className="w-28 h-28 rounded-lg object-cover border"
                    priority
                />
                <div>
                    <h2 className="text-lg font-semibold">{fullName}</h2>
                    <p className="text-sm text-gray-600">{email}</p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Role:</span> {role}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span> {status}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Joined:</span>{" "}
                        {new Date(joinedAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <Separator className="my-4" />

            {/* School & Grade Info */}
            {school && (
                <div className="flex items-center gap-4">
                    <Image
                        src={school.schoolLogo}
                        alt={school.name}
                        width={80}
                        height={80}
                        className="w-16 h-16 rounded-md object-cover border"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-800">{school.name}</h3>
                        <p className="text-sm text-gray-600">Grade: {studentGrade}</p>
                        <p className="text-sm text-gray-600">Location: {school.location}</p>
                    </div>
                </div>
            )}

            <Separator className="my-4" />

            {/* Assignments */}
            <div>
                <h3 className="font-semibold mb-2 text-gray-800">Assignments</h3>

                {assignments?.length > 0 ? (
                    <div className="space-y-3">
                        {assignments.map((a: any) => (
                            <div
                                key={a.id}
                                className="border p-3 rounded-md text-sm bg-gray-50 flex flex-col gap-1"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-800">
                                        Status: {a.assignmentStatus}
                                    </span>
                                    <span className="text-gray-600">
                                        Grade: {a.assignmentGrade ?? "Not graded"}
                                    </span>
                                </div>
                                {a.FeedBack && (
                                    <p className="text-gray-700 italic">“{a.FeedBack}”</p>
                                )}
                                {a.studentAttachement && (
                                    <a
                                        href={a.studentAttachement}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        View Attachment
                                    </a>
                                )}
                                {a.submittedAt && (
                                    <p className="text-xs text-gray-500">
                                        Submitted: {new Date(a.submittedAt).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-sm">No assignments found</p>
                )}
            </div>
        </DialogContent>
    );
};

export default ViewStudentDetailsModal;