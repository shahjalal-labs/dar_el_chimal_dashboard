/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RootState } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import GetSchools, { SchoolOption } from "@/components/Common/GetSchools";
import Link from "next/link";
import { PiSpinner } from "react-icons/pi";
import { useGetAllGradesQuery } from "@/redux/api/grade";
import { useAssignedBooksQuery } from "@/redux/api/school";
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
import { sortGrades } from "@/lib/gradeUtils";

interface GradeOption {
    id: string;
    label: string;
    schoolId: string;
}

interface BookOption {
    id: string;
    label: string;
    gradeIds?: string[];
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
    const [selectedBooks, setSelectedBooks] = useState<BookOption[]>([]);
    const [lastGradeId, setLastGradeId] = useState<string | null>(null);

    const { data: gradesData } = useGetAllGradesQuery({ currentPage: 1, limit: 1000 });

    const selectedSchoolId = mappings[0]?.school?.schoolId;
    const { data: assignedBooksData } = useAssignedBooksQuery(selectedSchoolId, { skip: !selectedSchoolId });

    const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();

    const allGrades: GradeOption[] = useMemo(() => {
        const raw = gradesData?.result?.map((g: any) => ({
            id: g.id,
            label: g.grade,
            schoolId: g.schoolId,
        })) ?? [];
        return sortGrades(raw);
    }, [gradesData]);

    const handleSchoolChange = (id: string, school: SchoolOption) => {
        setMappings((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, school, grade: null } : item
            )
        );
        setSelectedBooks([]);
        setLastGradeId(null);
    };

    const handleGradeChange = (id: string, selectedGrade: GradeOption | null) => {
        setMappings((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, grade: selectedGrade } : item
            )
        );
    };

    const availableBooks: BookOption[] = useMemo(() => {
        if (!assignedBooksData?.result || !mappings[0]?.grade) return [];
        const currentGradeId = mappings[0].grade.id;
        const matching = assignedBooksData.result
            .filter((b: any) => b.gradeIds?.includes(currentGradeId))
            .map((b: any) => ({
                id: b.id,
                label: b.bookName || "Untitled Book",
                gradeIds: b.gradeIds,
            }));
        if (matching.length > 0) return matching;
        return assignedBooksData.result.map((b: any) => ({
            id: b.id,
            label: b.bookName || "Untitled Book",
            gradeIds: b.gradeIds,
        }));
    }, [assignedBooksData, mappings]);

    useEffect(() => {
        const currentGradeId = mappings[0]?.grade?.id || null;
        if (currentGradeId !== lastGradeId) {
            setLastGradeId(currentGradeId);
            if (availableBooks.length > 0) {
                setSelectedBooks(availableBooks);
            } else {
                setSelectedBooks([]);
            }
        }
    }, [mappings, lastGradeId, availableBooks]);

    const isAllSelected = availableBooks.length > 0 && selectedBooks.length === availableBooks.length;
    const handleToggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedBooks([]);
        } else {
            setSelectedBooks(availableBooks);
        }
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
            email,
            schoolId: school.schoolId,
            gradeId: grade.id,
            bookIds: selectedBooks.map((b) => b.id),
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
                setSelectedBooks([]);
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
                const filteredGradeOptions = school ? sortGrades(allGrades.filter((g) => String(g.schoolId) === String(school.schoolId))) : [];

                return (
                    <div key={mapping.id} className="mb-6 space-y-5">
                        {/* School Name */}
                        <div className="flex-1 w-full">
                            <Label>School Name</Label>
                            <GetSchools
                                value={school}
                                onChange={(selectedSchool) => handleSchoolChange(mapping.id, selectedSchool)}
                                excludeIds={mappings.filter((m) => m.id !== mapping.id && m.school).map((m) => m.school!.schoolId)}
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
                                placeholder={grade ? "" : "Select grade..."}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: "#CBD5E1",
                                        borderRadius: "0.5rem",
                                        boxShadow: "none",
                                        padding: "2px 4px",
                                    }),
                                    placeholder: (base, state) => ({
                                        ...base,
                                        display: (state.hasValue || Boolean(grade)) ? 'none' : 'block',
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }),
                                }}
                            />
                        </div>

                        {/* Assign Books Section */}
                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-1.5">
                                <Label>Assign Books</Label>
                                {availableBooks.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleToggleSelectAll}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                                    >
                                        {isAllSelected ? "Unselect All" : "Select All"}
                                    </button>
                                )}
                            </div>
                            <Select<BookOption, true>
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                options={availableBooks}
                                className="basic-multi-select mt-2"
                                classNamePrefix="select"
                                placeholder={selectedBooks.length > 0 ? "" : (grade ? "Select books to assign..." : "Please select a grade first")}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.id}
                                value={selectedBooks}
                                onChange={(selected) => setSelectedBooks([...(selected || [])])}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: "#CBD5E1",
                                        borderRadius: "0.5rem",
                                        boxShadow: "none",
                                        padding: "2px 4px",
                                    }),
                                    placeholder: (base, state) => ({
                                        ...base,
                                        display: (state.hasValue || selectedBooks.length > 0) ? 'none' : 'block',
                                    }),
                                    multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: "#E5E7EB",
                                        borderRadius: "9999px",
                                        padding: "0 4px",
                                    }),
                                    multiValueLabel: (base) => ({
                                        ...base,
                                        fontWeight: 500,
                                        color: "#374151",
                                        paddingRight: 6,
                                    }),
                                }}
                            />
                            {grade && availableBooks.length === 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                    No books currently mapped to this school/grade.
                                </p>
                            )}
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