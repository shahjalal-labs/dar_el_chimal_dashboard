/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleAssignmentByTeacherQuery } from "@/redux/api/teacher/overviewApi";
import { Eye } from "lucide-react";
import { CiEdit } from "react-icons/ci";
import { SyncLoader } from "react-spinners";
import Link from "next/link";
import { Dialog, DialogTrigger } from "../ui/dialog";
import GradeStudentAssignmentModal from "./GradeStudentAssignmentModal";
import { Button } from "../ui/button";
import { TfiAngleLeft } from "react-icons/tfi";

const AssignmentDetails = () => {
    const route = useRouter();
    const [open, setOpen] = useState(false);
    const { id, assignmentId } = useParams();
    const { data, isLoading } = useGetSingleAssignmentByTeacherQuery(assignmentId);
    const assignmentData = data?.result;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20 gap-3">
                <span className="text-[#1E3A8A] font-medium">Loading Assignment...</span>
                <SyncLoader color="#1E3A8A" />
            </div>
        );
    }

    if (!assignmentData) {
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-gray-600 text-center">No assignment data found.</p>
            </div>
        );
    }

    const { assignment, students, totalSubmissions } = assignmentData;
    const { title, instruction, bookData, startPage, endPage, dueDate } = assignment;

    return (
        <div className="">
            {/* Section Title */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-6">Assignments</h2>
                <Button onClick={() => route.back()} className='mb-6 bg-white/80 text-black hover:text-white cursor-pointer'><TfiAngleLeft />Back</Button>
            </div>

            {/* Assignment Header Card */}
            <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-2xl font-semibold mb-3">{title}</h3>
                <p className="text-[#636F85] mb-6">{instruction}</p>

                {/* Book Info */}
                <div className="flex items-center gap-4 bg-[#F7F9FF] border border-[#D8D8D8] p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <Image
                        src={bookData?.coverImg}
                        alt={bookData?.bookName || "Book Cover"}
                        width={50}
                        height={50}
                        className="rounded-md object-cover w-12 h-12"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{bookData?.bookName}</span>
                        <span className="text-[#4C4C4C]">
                            Page {startPage} to {endPage}
                        </span>
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-lg overflow-x-auto p-6">
                {/* Due Date & Submissions */}
                <div className="mb-6">
                    <div>
                        <span className="font-medium">Due:</span>{" "}
                        <span className="text-[#4C4C4C]">{new Date(dueDate).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}</span>
                    </div>
                    <div className="mt-4">
                        <span className="font-medium">No of Submissions:</span> <span className="text-[#4C4C4C]">{totalSubmissions}</span>
                    </div>
                </div>

                <table className="w-full text-sm overflow-x-auto">
                    <thead className="bg-gray-100 text-gray-700 text-left">
                        <tr>
                            <th className="py-3 px-5 font-medium">Name</th>
                            <th className="py-3 px-5 font-medium">Status</th>
                            <th className="py-3 px-5 font-medium">Submitted On</th>
                            <th className="py-3 px-5 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students?.length > 0 ? (
                            students?.map((student: any, index: number) => (
                                <tr
                                    key={student?.assignmentProgressId}
                                    className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                >
                                    {/* Name */}
                                    <td className="py-3 px-5 text-gray-800">
                                        {student?.fullName ?? "N/A"}
                                    </td>

                                    {/* Grade */}
                                    <td className="py-3 px-5">
                                        {student?.grade ? (
                                            <span className="font-semibold text-gray-900">
                                                {
                                                    student?.grade === "A_plus" ? 'A+' :
                                                        student?.grade === "A" ? 'A' :
                                                            student?.grade === "A_minus" ? 'A-' :
                                                                student?.grade === "B_plus" ? 'B+' :
                                                                    student?.grade === "B" ? 'B' :
                                                                        student?.grade === "B_minus" ? 'B-' :
                                                                            student?.grade === "C_plus" ? 'C+' :
                                                                                student?.grade === "C" ? 'C' :
                                                                                    student?.grade === "C_minus" ? 'C-' :
                                                                                        student?.grade === "D" ? 'D' : 'F'
                                                }
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">---</span>
                                        )}
                                    </td>

                                    {/* Submitted On */}
                                    <td className="py-3 px-5 text-gray-700">
                                        {student?.submittedAt
                                            ? new Date(student?.submittedAt).toLocaleDateString("en-US", {
                                                day: "2-digit",
                                                month: "short",
                                            })
                                            : "---"}
                                    </td>

                                    {/* Action Buttons */}
                                    <td className="py-3 px-5 flex justify-center gap-3">
                                        <Link href={`/teacher/classes/${id}/assignments/${assignmentId}/${student?.assignmentProgressId}`}>
                                            <Button variant="default" className="text-[#F4A640] cursor-pointer bg-[#F4A64033] hover:bg-transparent">
                                                <Eye size={24} />
                                            </Button>
                                        </Link>
                                        <Dialog open={open} onOpenChange={setOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="default" className="text-[#17A235] cursor-pointer bg-[#17A23533] hover:bg-transparent">
                                                    <CiEdit size={24} />
                                                </Button>
                                            </DialogTrigger>
                                            {open && <GradeStudentAssignmentModal assignmentProgressId={String(student?.assignmentProgressId)} onClose={() => setOpen(false)} />}
                                        </Dialog>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-6 text-center text-gray-500 font-medium"
                                >
                                    No student submissions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignmentDetails;