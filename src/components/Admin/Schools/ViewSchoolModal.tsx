/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { SyncLoader } from "react-spinners";
import Image from "next/image";
import { DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useGetSingleSchoolQuery } from "@/redux/api/school";

const ViewSchoolModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSingleSchoolQuery({ id });
    const school = data?.result;

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

    if (!school) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <p className="text-center text-gray-700">No data found!</p>
            </DialogContent>
        );
    }

    const { headerData, name, schoolLogo, grades, schoolDocuments, teacherCount, studentsCount, activeTeachers, activeStudents, location } = school;

    return (
        <DialogContent className="p-6 max-h-[80vh] overflow-y-auto" showCloseButton>
            {/* School Info */}
            <div className="flex items-start gap-4 mt-4">
                <Image
                    src={schoolLogo || '/placeholder-school.png'}
                    alt={name}
                    height={500}
                    width={500}
                    className="w-28 h-28 rounded-lg object-cover border"
                    priority
                />
                <div>
                    <h2 className="text-lg font-semibold">{name}</h2>
                    <p className="text-sm text-gray-600">{location}</p>
                    <p className="text-sm text-gray-600">{headerData?.gradeLevel}</p>
                </div>
            </div>

            <Separator className="my-4" />

            {/* School Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <span className="font-medium">Total Teachers:</span> {teacherCount}
                </div>
                <div>
                    <span className="font-medium">Total Students:</span> {studentsCount}
                </div>
                <div>
                    <span className="font-medium">Active Teachers:</span> {activeTeachers}
                </div>
                <div>
                    <span className="font-medium">Active Students:</span> {activeStudents}
                </div>
            </div>

            <Separator className="my-4" />

            {/* Grades */}
            <div>
                <h3 className="font-semibold mb-2 text-gray-800">Grades</h3>
                {grades?.length > 0 ? (
                    <div className="space-y-2">
                        {grades.map((grade: any) => (
                            <div
                                key={grade.id}
                                className="border p-3 rounded-md text-sm flex justify-between items-center"
                            >
                                <span>{grade.grade}</span>
                                <div className="flex gap-4 text-gray-600">
                                    <span>Students: {grade._count.StudentGrades}</span>
                                    <span>Teachers: {grade._count.TeacherGrades}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-sm">No grades available</p>
                )}
            </div>

            <Separator className="my-4" />

            {/* School Documents */}
            <div>
                <h3 className="font-semibold mb-2 text-gray-800">School Documents</h3>
                {schoolDocuments?.length > 0 ? (
                    <ul className="space-y-2 list-disc list-inside text-blue-600">
                        {schoolDocuments.map((doc: string, index: number) => (
                            <li key={index}>
                                <a href={doc} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {doc.split('/').pop()}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 text-sm">No documents uploaded</p>
                )}
            </div>
        </DialogContent>
    );
};

export default ViewSchoolModal;
