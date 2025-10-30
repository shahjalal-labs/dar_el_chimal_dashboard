/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { SyncLoader } from "react-spinners";
import Image from "next/image";
import { DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useGetTeacherDetailsQuery } from "@/redux/api/teacher";

const ViewTeacherModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetTeacherDetailsQuery(id);
    const teacher = data?.result;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const teacherDetails = teacher?.Teacher || [];

    console.log(teacher);

    const groupedBySchool = useMemo(() => {
        if (!teacherDetails?.length) return [];

        const map = new Map();

        teacherDetails.forEach((item: any) => {
            const school = item.grade?.school;
            if (!school) return;

            const schoolId = school.id;
            if (!map.has(schoolId)) {
                map.set(schoolId, {
                    school,
                    grades: [],
                });
            }
            map.get(schoolId).grades.push(item.grade.grade);
        });

        return Array.from(map.values());
    }, [teacherDetails]);

    if (isLoading) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-[#1E3A8A] font-medium">Data is Loading</span>
                    <SyncLoader color="#1E3A8A" />
                </div>
            </DialogContent>
        );
    }

    if (!teacher) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <p className="text-center text-gray-700">No data found!</p>
            </DialogContent>
        );
    }

    const {
        loginUserName,
        fullName,
        email,
        gender,
        DOB,
        phone,
        profileImage,
        role,
        status,
        joinedAt,
    } = teacher;

    return (
        <DialogContent className="p-6 max-h-[80vh] overflow-y-auto" showCloseButton>
            {/* Teacher Info */}
            <div className="flex items-start gap-4">
                <Image
                    src={profileImage || "/default-profile.png"}
                    alt={loginUserName || "Image"}
                    height={500}
                    width={500}
                    className="w-28 h-28 rounded-lg object-cover border"
                    priority
                />
                <div>
                    <h2 className="text-lg font-semibold">{fullName || loginUserName}</h2>
                    <p className="text-sm text-gray-600">{role}</p>
                    <p className="text-sm text-gray-500">Status: {status}</p>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Basic Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <span className="font-medium">Email:</span> {email || "Not provided"}
                </div>
                <div>
                    <span className="font-medium">Phone:</span> {phone || "Not provided"}
                </div>
                <div>
                    <span className="font-medium">Gender:</span> {gender || "Not specified"}
                </div>
                <div>
                    <span className="font-medium">Date of Birth:</span>{" "}
                    {DOB ? new Date(DOB).toLocaleDateString() : "Not provided"}
                </div>
                <div>
                    <span className="font-medium">Joined At:</span>{" "}
                    {joinedAt ? new Date(joinedAt).toLocaleDateString() : "Not available"}
                </div>
            </div>

            <Separator className="my-4" />

            {/* Grade & School Information */}
            <div>
                <h3 className="font-semibold mb-3 text-gray-800">
                    Grade & School Information
                </h3>

                {groupedBySchool.length > 0 ? (
                    groupedBySchool.map(({ school, grades }) => (
                        <div
                            key={school.id}
                            className="border rounded-md p-4 mb-4 text-sm bg-white"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Image
                                    src={school.schoolLogo}
                                    alt={school.name}
                                    width={60}
                                    height={60}
                                    className="w-14 h-14 rounded object-cover border"
                                />
                                <div>
                                    <p className="font-medium text-gray-800">{school.name}</p>
                                    <p className="text-gray-600 text-sm">
                                        Location: {school.location}
                                    </p>
                                </div>
                            </div>

                            {/* Grades under this school */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {grades.map((g: string, i: number) => (
                                    <span
                                        key={i}
                                        className="bg-[#EEF2FF] text-[#1E3A8A] text-xs font-medium px-3 py-1 rounded-full"
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                                <div>
                                    <span className="font-medium">Total Teachers:</span>{" "}
                                    {school.teacherCount}
                                </div>
                                <div>
                                    <span className="font-medium">Total Students:</span>{" "}
                                    {school.studentsCount}
                                </div>
                                <div>
                                    <span className="font-medium">Active Teachers:</span>{" "}
                                    {school.activeTeachers}
                                </div>
                                <div>
                                    <span className="font-medium">Active Students:</span>{" "}
                                    {school.activeStudents}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 text-sm">
                        No grade or school information available
                    </p>
                )}
            </div>

            {/* Book Categories Section */}
            <Separator className="my-4" />

            <div>
                <h3 className="font-semibold mb-3 text-gray-800">Book Categories</h3>

                {teacher.teachersBookCategories && teacher.teachersBookCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {teacher.teachersBookCategories.map((item: any) => (
                            <span
                                key={item.id}
                                className="bg-[#FFF4ED] text-[#E35314] text-xs font-medium px-3 py-1 rounded-full border border-[#E3531430]"
                            >
                                {item.category?.name || "Unnamed Category"}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-sm">
                        No book categories assigned to this teacher.
                    </p>
                )}
            </div>
        </DialogContent>
    );
};

export default ViewTeacherModal;