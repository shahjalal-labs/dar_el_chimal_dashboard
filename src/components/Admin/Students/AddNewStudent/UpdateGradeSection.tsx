/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RootState } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import GetSchools, { SchoolOption } from "@/components/Common/GetSchools";
import Link from "next/link";
import { PiSpinner } from "react-icons/pi";
import { useGetAllGradesQuery } from "@/redux/api/grade";
import { useAssignedBooksQuery } from "@/redux/api/school";
import { toast } from "sonner";
import {
    useGetStudentDetailsQuery,
    useUpdateStudentMutation,
} from "@/redux/api/student";
import {
    setEmail,
    setStudentSchoolName,
} from "@/redux/features/studentSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
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
    grade: GradeOption[];
}

const UpdateGradeSection = ({ id }: { id: string }) => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [optionToRemove, setOptionToRemove] = useState("");
    const { email } = useSelector((state: RootState) => state.student);

    const [mappings, setMappings] = useState<Mapping[]>([{ id: Date.now().toString(), school: null, grade: [] }]);
    const [selectedBooks, setSelectedBooks] = useState<BookOption[]>([]);

    const { data } = useGetStudentDetailsQuery(id);
    const { data: gradesData } = useGetAllGradesQuery({ currentPage: 1, limit: 1000 });

    const selectedSchoolId = mappings[0]?.school?.schoolId;
    const { data: assignedBooksData } = useAssignedBooksQuery(selectedSchoolId, { skip: !selectedSchoolId });

    const [UpdateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

    useEffect(() => {
        if (data?.result) {
            dispatch(setEmail(data?.result?.email || ""));
            dispatch(setStudentSchoolName(data?.result?.StudentGrades[0]?.grade?.school?.name));

            const prefilledSchool: SchoolOption | null = data?.result?.StudentGrades?.[0]?.grade?.school ?
                {
                    schoolId: data.result.StudentGrades[0].grade.school.id,
                    schoolName: data.result.StudentGrades[0].grade.school.name,
                    image: data.result.StudentGrades[0].grade.school.schoolLogo || "",
                } : null;

            const prefilledGrades: GradeOption[] = data?.result?.StudentGrades?.map((g: any) => ({
                id: g.grade.id,
                label: g.grade.grade,
                schoolId: g.grade.schoolId,
            })) ?? [];

            setMappings((prev) => prev.map((item, idx) => idx === 0 ? { ...item, school: prefilledSchool, grade: sortGrades(prefilledGrades) } : item));

            if (data?.result?.StudentBooks) {
                const prefilledBooks: BookOption[] = data.result.StudentBooks
                    .filter((sb: any) => sb.book)
                    .map((sb: any) => ({
                        id: sb.book.id,
                        label: sb.book.bookName || "Untitled Book",
                    }));
                setSelectedBooks(prefilledBooks);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const allGrades: GradeOption[] = useMemo(() => {
        const raw = gradesData?.result?.map((g: any) => ({
            id: g.id,
            label: g.grade,
            schoolId: g.schoolId,
        })) ?? [];
        return sortGrades(raw);
    }, [gradesData]);

    const availableBooks: BookOption[] = useMemo(() => {
        if (!assignedBooksData?.result) return [];
        const studentGradeIds = (mappings[0]?.grade || []).map((g) => g.id);
        if (studentGradeIds.length === 0) {
            return assignedBooksData.result.map((b: any) => ({
                id: b.id,
                label: b.bookName || "Untitled Book",
                gradeIds: b.gradeIds,
            }));
        }
        const matching = assignedBooksData.result
            .filter((b: any) => b.gradeIds?.some((gid: string) => studentGradeIds.includes(gid)))
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

    const isAllBooksSelected = availableBooks.length > 0 && selectedBooks.length === availableBooks.length;
    const handleToggleSelectAllBooks = () => {
        if (isAllBooksSelected) {
            setSelectedBooks([]);
        } else {
            setSelectedBooks(availableBooks);
        }
    };

    const handleSchoolChange = (id: string, school: SchoolOption) => {
        setMappings((prev) => prev.map((item) => item.id === id ? { ...item, school, grade: [] } : item));
        setSelectedBooks([]);
    };

    const handleGradeChange = (id: string, selectedGrades: readonly GradeOption[]) => {
        const sorted = sortGrades([...selectedGrades]);
        setMappings((prev) => prev.map((item) => item.id === id ? { ...item, grade: sorted } : item));
    };

    const handleRemoveClick = (id: string) => {
        setOptionToRemove(id);
        setIsModalOpen(true);
    };

    const confirmRemove = async () => {
        const body = {
            userData: {},
            gradeData: {
                deletedGrade: [optionToRemove],
                newGradeAssign: [],
            },
            bookIds: selectedBooks.map((b) => b.id),
        };

        const formData = new FormData();
        formData.append("bodyData", JSON.stringify(body));

        try {
            const response = await UpdateStudent({ id, formData }).unwrap();
            if (response.success) {
                toast.success(response.message);

                setMappings((prev) => prev.map((m) => ({ ...m, grade: m.grade.filter((g) => g.id !== optionToRemove) })));

                setIsModalOpen(false);
                setOptionToRemove("");
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    };

    const selectedSchoolIds = useMemo(() => mappings.filter((m) => m.school).map((m) => m.school!.schoolId), [mappings]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const school = mappings[0]?.school;
        const grades = mappings[0]?.grade;

        if (!school || grades.length === 0) {
            toast.warning("Please select both a school and at least one grade.");
            return;
        }

        const body = {
            userData: {},
            gradeData: {
                deletedGrade: [],
                newGradeAssign: grades.map((g) => g.id),
            },
            bookIds: selectedBooks.map((b) => b.id),
        };

        const formData = new FormData();
        formData.append("bodyData", JSON.stringify(body));

        try {
            const response = await UpdateStudent({ id, formData }).unwrap();
            if (response.success) {
                toast.success(response.message);
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    };

    const isButtonDisabled =
        !mappings[0]?.school || mappings[0]?.grade.length === 0;

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {/* Email Field */}
            {
                pathname !== "/admin/students" &&
                <div>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        placeholder="Enter student email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            }

            {mappings?.map((mapping) => {
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
                            <Label>Grade Section Mapping</Label>
                            <Select<GradeOption, true>
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                placeholder={grade && grade.length > 0 ? "" : "Select grades"}
                                options={filteredGradeOptions}
                                className="mt-2"
                                classNamePrefix="select"
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.id}
                                onChange={(selected) => handleGradeChange(mapping.id, selected || [])}
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
                                        display: (state.hasValue || (grade && grade.length > 0)) ? 'none' : 'block',
                                    }),
                                    multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: "#F1F5F9",
                                        borderRadius: "6px",
                                        padding: "2px 6px",
                                    }),
                                    multiValueLabel: (base) => ({
                                        ...base,
                                        color: "#111827",
                                        fontWeight: 500,
                                    }),
                                    multiValueRemove: (base) => ({
                                        ...base,
                                        color: "#64748B",
                                        cursor: "pointer",
                                        ":hover": {
                                            backgroundColor: "transparent",
                                            color: "#EF4444",
                                        },
                                    }),
                                }}
                            />
                        </div>

                        {/* Tag */}
                        <div className="flex gap-2 flex-wrap">
                            {grade?.map((g) => (
                                <div key={g?.id} className="bg-[#F1F5F9] text-sm rounded-md flex items-center gap-1.5 w-fit px-2.5 py-0.5">
                                    {g?.label}
                                    <button type="button" onClick={() => handleRemoveClick(g?.id)} className="text-gray-700 hover:text-red-600 text-lg cursor-pointer">
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Assign Books */}
                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-1.5">
                                <Label>Assign Books</Label>
                                {availableBooks.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleToggleSelectAllBooks}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                                    >
                                        {isAllBooksSelected ? "Unselect All" : "Select All"}
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
                                placeholder={selectedBooks.length > 0 ? "" : (grade?.length ? "Select books to assign..." : "Please select a grade first")}
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
                            {grade?.length > 0 && availableBooks.length === 0 && (
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
                {
                    pathname !== '/admin/students' &&
                    <Link href="/admin/students">
                        <Button
                            type="button"
                            variant="outline"
                            className="px-6 border-[#636F85] text-[#636F85] font-medium"
                        >
                            Cancel
                        </Button>
                    </Link>
                }

                <Button
                    type={!isModalOpen ? "submit" : "button"}
                    disabled={isButtonDisabled}
                    className={`px-6 text-white font-medium border border-[#1E3A8A] transition-all ease-in-out duration-500 cursor-pointer ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"}`}
                >
                    {(isUpdating && !isModalOpen) ? (
                        <div className="flex items-center gap-2">
                            Updating...
                            <PiSpinner className="h-4 w-4 animate-spin" />
                        </div>
                    ) : (
                        "Update & Continue"
                    )}
                </Button>
            </div>

            {/* 🧾 Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="p-6">
                    <DialogHeader>
                        <DialogTitle>Remove Grade</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-700">
                        Are you sure you want to remove this grade?
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="default"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border rounded-md bg-white text-black hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmRemove}
                            className="px-4 py-2 bg-red-600 hover:bg-red-300 text-white rounded-md transition-all ease-in-out duration-500 cursor-pointer"
                        >
                            {isUpdating ? (
                                <div className="flex justify-center items-center gap-2">
                                    Removing...
                                    <div className="animate-spin">
                                        <PiSpinner className="h-4 w-4" />
                                    </div>
                                </div>
                            ) : (
                                "Remove"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </form>
    );
};

export default UpdateGradeSection;