/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { SyncLoader } from "react-spinners";
import Image from "next/image";
import { DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useGetStudentDetailsQuery } from "@/redux/api/student";
import defaultUserImg from "@/assets/User.png";
import defaultSchoolImg from "@/assets/school.png";

interface ViewStudentModalProps {
    id: string;
    fallbackPassword?: string;
}

const StudentSchoolCard = ({ school, grades }: { school: any; grades: string[] }) => {
    const [logoError, setLogoError] = useState(false);
    return (
        <div className="border rounded-md p-4 mb-4 text-sm bg-white">
            <div className="flex items-center gap-3 mb-2">
                <Image
                    src={!logoError && school?.schoolLogo && typeof school.schoolLogo === "string" && school.schoolLogo.trim() !== "" ? school.schoolLogo : defaultSchoolImg}
                    alt={school?.name || "School"}
                    width={60}
                    height={60}
                    className="w-14 h-14 rounded object-cover border"
                    onError={() => setLogoError(true)}
                />
                <div>
                    <p className="font-medium text-gray-800">{school?.name}</p>
                    <p className="text-gray-600 text-sm">
                        Location: {school?.location || "N/A"}
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
                    {school?.teacherCount ?? "N/A"}
                </div>
                <div>
                    <span className="font-medium">Total Students:</span>{" "}
                    {school?.studentsCount ?? "N/A"}
                </div>
                <div>
                    <span className="font-medium">Active Teachers:</span>{" "}
                    {school?.activeTeachers ?? "N/A"}
                </div>
                <div>
                    <span className="font-medium">Active Students:</span>{" "}
                    {school?.activeStudents ?? "N/A"}
                </div>
            </div>
        </div>
    );
};

const ViewStudentModal = ({ id, fallbackPassword }: ViewStudentModalProps) => {
    const { data, isLoading } = useGetStudentDetailsQuery(id);
    const student = data?.result;
    const [profileImgError, setProfileImgError] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const studentGrades = student?.StudentGrades || [];

    // ✅ Group grades by school
    const groupedBySchool = useMemo(() => {
        if (!studentGrades.length) return [];

        const map = new Map();

        studentGrades.forEach((item: any) => {
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
    }, [studentGrades]);

    // ✅ Loading state
    if (isLoading) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-[#1E3A8A] font-medium">Loading student data...</span>
                    <SyncLoader color="#1E3A8A" />
                </div>
            </DialogContent>
        );
    }

    // ✅ Empty state
    if (!student) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <p className="text-center text-gray-700">No data found!</p>
            </DialogContent>
        );
    }

    // ✅ Destructure student details
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
    } = student;

    const studentPassword =
        student?.password ||
        (fallbackPassword && fallbackPassword !== "N/A" ? fallbackPassword : null) ||
        "Not provided";

    return (
        <DialogContent className="p-6 max-h-[80vh] overflow-y-auto" showCloseButton>
            {/* ✅ Student Info */}
            <div className="flex items-start gap-4">
                <Image
                    src={!profileImgError && profileImage && typeof profileImage === "string" && profileImage.trim() !== "" ? profileImage : defaultUserImg}
                    alt={loginUserName || "Student Image"}
                    height={500}
                    width={500}
                    className="w-28 h-28 rounded-lg object-cover border"
                    priority
                    onError={() => setProfileImgError(true)}
                />
                <div>
                    <h2 className="text-lg font-semibold">{fullName || loginUserName}</h2>
                    <p className="text-sm text-gray-600">{role}</p>
                    <p className="text-sm text-gray-500">Status: {status}</p>
                </div>
            </div>

            <Separator className="my-4" />

            {/* ✅ Basic Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <span className="font-medium">User Name:</span>{" "}
                    <span className="font-semibold text-gray-900">{loginUserName || "Not provided"}</span>
                </div>
                <div>
                    <span className="font-medium">Password:</span>{" "}
                    <span className="font-semibold text-gray-900">{studentPassword}</span>
                </div>
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

            {/* ✅ Grade & School Information */}
            <div>
                <h3 className="font-semibold mb-3 text-gray-800">
                    Grade & School Information
                </h3>

                {groupedBySchool.length > 0 ? (
                    groupedBySchool.map(({ school, grades }) => (
                        <StudentSchoolCard key={school.id} school={school} grades={grades} />
                    ))
                ) : (
                    <p className="text-gray-600 text-sm">
                        No grade or school information available
                    </p>
                )}
            </div>
        </DialogContent>
    );
};

export default ViewStudentModal;