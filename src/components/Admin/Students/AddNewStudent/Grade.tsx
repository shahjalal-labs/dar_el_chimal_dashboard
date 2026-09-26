/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RootState } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import GetSchools, { SchoolOption } from "@/components/Common/GetSchools";
import Link from "next/link";
import { PiSpinner } from "react-icons/pi";
import { useGetAllGradesQuery } from "@/redux/api/grade";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateStudentMutation } from "@/redux/api/student";
import {
    setEmail,
    setPreviewStudentPhoto,
    setStudentName,
    setStudentPassword,
    setStudentUserName,
} from "@/redux/features/studentSlice";

interface GradeOption {
    id: string;
    label: string;
    schoolId: string;
}

interface Mapping {
    id: string;
    school: SchoolOption | null;
    grade: GradeOption | null;
}

const Grade = () => {
    const route = useRouter();
    const dispatch = useDispatch();
    const {
        studentName,
        studentUserName,
        email,
        studentPassword,
        studentPhoto,
    } = useSelector((state: RootState) => state.student);

    const [mappings, setMappings] = useState<Mapping[]>([{ id: Date.now().toString(), school: null, grade: null }]);

    const { data: gradesData } = useGetAllGradesQuery({ currentPage: 1, limit: 1000 });

    const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();

    const allGrades: GradeOption[] =
        gradesData?.result?.map((g: any) => ({
            id: g.id,
            label: g.grade,
            schoolId: g.schoolId,
        })) ?? [];

    const handleSchoolChange = (id: string, school: SchoolOption) => {
        setMappings((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, school, grade: null } : item
            )
        );
    };

    const handleGradeChange = (id: string, selectedGrade: GradeOption | null) => {
        setMappings((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, grade: selectedGrade } : item
            )
        );
    };

    const selectedSchoolIds = useMemo(
        () => mappings.filter((m) => m.school).map((m) => m.school!.schoolId),
        [mappings]
    );

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const school = mappings[0]?.school;
        const grade = mappings[0]?.grade;

        if (!school || !grade) {
            toast.warning("Please select both a school and a grade.");
            return;
        }

        const body = {
            name: studentName,
            userName: studentUserName,
            password: studentPassword,
            schoolId: school.schoolId,
            gradeId: grade.id,
        };

        const formData = new FormData();
        formData.append("bodyData", JSON.stringify(body));

        if (studentPhoto) {
            formData.append("profileImage", studentPhoto);
        }

        try {
            const response = await createStudent(formData).unwrap();
            if (response.success) {
                toast.success(response.message);
                dispatch(setStudentName(""));
                dispatch(setStudentUserName(""));
                dispatch(setStudentPassword(""));
                dispatch(setPreviewStudentPhoto(""));
                setEmail("");
                setMappings([{ id: Date.now().toString(), school: null, grade: null }]);
                route.push("/admin/students");
            }
        } catch (error) {
            toast.warning(
                (error as any)?.data?.message || "Something went wrong while creating student."
            );
        }
    };

    const isButtonDisabled = !mappings[0]?.school || !mappings[0]?.grade;

    return (
        <form onSubmit={handleSave} className="space-y-6">

            {mappings.map((mapping) => {
                const { school, grade } = mapping;
                const filteredGradeOptions = school ? allGrades.filter((g) => String(g.schoolId) === String(school.schoolId)) : [];

                return (
                    <div key={mapping.id} className="mb-6 space-y-5">
                        {/* School Name */}
                        <div className="flex-1 w-full">
                            <Label>School Name</Label>
                            <GetSchools
                                value={school}
                                onChange={(selectedSchool) => handleSchoolChange(mapping.id, selectedSchool)}
                                excludeIds={selectedSchoolIds}
                            />
                        </div>

                        {/* Grade Section */}
                        <div className="flex-1 w-full">
                            <Label>Grade</Label>
                            <Select<GradeOption, false>
                                isMulti={false}
                                options={filteredGradeOptions}
                                className="basic-single-select mt-2"
                                classNamePrefix="select"
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.id}
                                value={grade}
                                onChange={(selected) => handleGradeChange(mapping.id, selected as GradeOption)}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: "#CBD5E1",
                                        borderRadius: "0.5rem",
                                        boxShadow: "none",
                                        padding: "2px 4px",
                                    }),
                                }}
                            />
                        </div>
                    </div>
                );
            })}

            {/* Footer Buttons */}
            <div className="flex justify-center items-center gap-3 pt-4">
                <Link href="/admin/students">
                    <Button
                        variant="outline"
                        type="button"
                        className="px-6 border-[#636F85] text-[#636F85] font-medium"
                    >
                        Cancel
                    </Button>
                </Link>

                <Button
                    type="submit"
                    disabled={isButtonDisabled}
                    className={`px-6 text-white font-medium transition-all ease-in-out duration-500 cursor-pointer ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed border border-gray-400" : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A]"}`}
                >
                    {isCreating ? (
                        <div className="flex items-center gap-2">
                            Saving...
                            <PiSpinner className="h-4 w-4 animate-spin" />
                        </div>
                    ) : (
                        "Save & Continue"
                    )}
                </Button>
            </div>
        </form>
    );
};

export default Grade;