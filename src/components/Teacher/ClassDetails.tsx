"use client";

import React from "react";
import { SyncLoader } from "react-spinners";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useGetTeacherGradeDetailsQuery } from "@/redux/api/teacher/overviewApi";
import totalAnoucments from "@/assets/totalAnoucments.svg";
import totalAssignments from "@/assets/totalAssignments.svg";
import totalBooks from "@/assets/totalBooks.svg";
import totalLinks from "@/assets/totalLinks.svg";
import totalStudents from "@/assets/totalStudents.svg";
import Image from "next/image";
import { BiBookReader } from "react-icons/bi";
import { SlCalender } from "react-icons/sl";

const ClassDetails = () => {
    const { id } = useParams();
    const { data, isLoading } = useGetTeacherGradeDetailsQuery(id);

    const classData = data?.result;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 gap-4">
                <span className="text-[#1E3A8A] font-medium">Loading class details...</span>
                <SyncLoader color="#1E3A8A" />
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-center text-gray-700">No class data found!</p>
            </div>
        );
    }

    const {
        totalStudent,
        assignBook,
        totalResources,
        totalAssignment,
        totalAnnouncment,
        gradeData,
    } = classData;

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            {/* Header Section */}
            <div>
                <p className="font-medium text-xl">
                    Grade {gradeData?.grade} - Section A
                </p>
                <p className="flex items-center gap-2 text-[#4C4C4C] mt-3">
                    <BiBookReader className="text-lg" /> {totalStudent} Student{totalStudent > 1 ? "s" : ""} <SlCalender className="text-lg ml-2" /> {new Date().getFullYear()}
                </p>
            </div>

            <Separator className="my-4" />

            {/* Stats Grid Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Total Students */}
                <div className="bg-[#63D27C1A] sm:col-span-1 px-6 py-4 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-lg text-[#636F85]">Total Students</p>
                        <h3 className="text-[56px] font-bold text-black">{totalStudent}</h3>
                    </div>
                    <div className="bg-[#63D27C1A] p-4 rounded-full">
                        <Image
                            src={totalStudents}
                            height={50}
                            width={50}
                            alt="Image"
                            className="w-10 h-10"
                            priority
                        />
                    </div>
                </div>

                {/* Total Books */}
                <div className="bg-[#F1E7FF] sm:col-span-1 px-6 py-4 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-lg text-[#636F85]">Total Books</p>
                        <h3 className="text-[56px] font-bold text-black">{assignBook}</h3>
                    </div>
                    <div className="bg-[#AE7BF51A] p-4 rounded-full">
                        <Image
                            src={totalBooks}
                            height={50}
                            width={50}
                            alt="Image"
                            className="w-10 h-10"
                            priority
                        />
                    </div>
                </div>

                {/* Total Resources */}
                <div className="bg-[#E7EFFF] sm:col-span-1 px-6 py-4 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-lg text-[#636F85]">Total Resources</p>
                        <h3 className="text-[56px] font-bold text-black">{totalResources}</h3>
                    </div>
                    <div className="bg-[#3471EB1A] p-4 rounded-full">
                        <Image
                            src={totalLinks}
                            height={50}
                            width={50}
                            alt="Image"
                            className="w-10 h-10"
                            priority
                        />
                    </div>
                </div>

                {/* Total Assignments */}
                <div className="bg-[#FFEFE7] sm:col-span-1 px-6 py-4 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-lg text-[#636F85]">Total Assignments</p>
                        <h3 className="text-[56px] font-bold text-black">{totalAssignment}</h3>
                    </div>
                    <div className="bg-[#FF9D6B1A] p-4 rounded-full">
                        <Image
                            src={totalAssignments}
                            height={50}
                            width={50}
                            alt="Image"
                            className="w-10 h-10"
                            priority
                        />
                    </div>
                </div>

                {/* Announcements */}
                <div className="bg-[#E5F5FF] sm:col-span-1 px-6 py-4 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-lg text-[#636F85]">Announcements</p>
                        <h3 className="text-[56px] font-bold text-black">{totalAnnouncment}</h3>
                    </div>
                    <div className="bg-[#71C8FF1A] p-4 rounded-full">
                        <Image
                            src={totalAnoucments}
                            height={50}
                            width={50}
                            alt="Image"
                            className="w-10 h-10"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetails;