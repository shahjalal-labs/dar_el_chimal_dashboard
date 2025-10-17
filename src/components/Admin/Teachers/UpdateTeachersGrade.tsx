/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import GetSchools, { SchoolOption } from "@/components/Common/GetSchools";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useGetAllGradesQuery } from "@/redux/api/grade";
import {
    useGetTeacherDetailsQuery,
    useUpdateTeacherMutation,
} from "@/redux/api/teacher";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import CreatableSelect from "react-select/creatable";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PiSpinner } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
    setSelectedGrades,
    setTeacherSchoolName,
} from "@/redux/features/teacherSlice";
import defaultImg from "@/assets/User.png";

interface GradeOption {
    id: string;
    label: string;
    schoolId: string;
    __isNew__?: boolean;
}

interface Mapping {
    id: string;
    school: SchoolOption | null;
    grades: GradeOption[];
}

const UpdateTeachersGrade = ({ id }: { id: string }) => {
    const dispatch = useDispatch();
    const { teacherSchoolName, selectedGrades } = useSelector(
        (state: RootState) => state.teacher
    );

    const [optionToRemove, setOptionToRemove] = useState<GradeOption | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mappings, setMappings] = useState<Mapping[]>([
        { id: Date.now().toString(), school: null, grades: [] },
    ]);

    const { data } = useGetTeacherDetailsQuery(id);
    const { data: gradesData } = useGetAllGradesQuery({
        currentPage: 1,
        limit: 1000,
    });
    const [UpdateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

    useEffect(() => {
        if (data?.result?.Teacher?.length) {
            const schoolData = data.result.Teacher[0].grade.school;
            const school: SchoolOption = {
                schoolId: schoolData.id,
                schoolName: schoolData.name,
                image: schoolData.schoolLogo,
            };

            dispatch(setTeacherSchoolName(schoolData.name));

            const selectedGrades: GradeOption[] = data.result.Teacher.map(
                (teacherEntry: any) => ({
                    id: teacherEntry.grade.id,
                    label: teacherEntry.grade.grade,
                    schoolId: teacherEntry.grade.school.id,
                })
            );

            dispatch(setSelectedGrades(selectedGrades));

            setMappings([
                {
                    id: Date.now().toString(),
                    school,
                    grades: selectedGrades,
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const allGrades: GradeOption[] =
        gradesData?.result?.map((singleGrade: any) => ({
            id: singleGrade?.id,
            label: singleGrade?.grade,
            schoolId: singleGrade?.schoolId,
        })) ?? [];

    console.log(allGrades);

    const handleSchoolChange = (school: SchoolOption) => {
        dispatch(setTeacherSchoolName(school?.schoolName));
        setMappings((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, school, grades: [] } : item
            )
        );
    };

    const handleRemoveClick = (option: GradeOption) => {
        setOptionToRemove(option);
        setIsModalOpen(true);
    };

    const confirmRemove = async () => {
        if (!optionToRemove) return;

        const body = {
            userData: {},
            gradeData: {
                deletedGrade: [optionToRemove.id],
                newGradeAssign: [],
            },
        };

        const formData = new FormData();
        formData.append("bodyData", JSON.stringify(body));

        try {
            const response = await UpdateTeacher({ id, formData }).unwrap();
            if (response.success) {
                toast.success(response.message);

                // Remove from UI
                setMappings((prev) =>
                    prev.map((mapping) => ({
                        ...mapping,
                        grades: mapping.grades.filter(
                            (grade) => grade.id !== optionToRemove.id
                        ),
                    }))
                );

                setIsModalOpen(false);
                setOptionToRemove(null);
            }
        } catch (error) {
            toast.warning(
                (error as any)?.data?.message ||
                "Something went wrong while removing grade."
            );
        }
    };

    const selectedSchoolIds = useMemo(
        () =>
            mappings
                .filter((m) => m?.school)
                .map((m) => m?.school!.schoolId),
        [mappings]
    );

    const handleSave = async () => {
        const newGradeAssign = mappings.flatMap((mapping) =>
            mapping.grades
                .filter((grade) => grade.__isNew__)
                .map((grade) => grade.id)
        );

        const body = {
            userData: {},
            gradeData: {
                deletedGrade: [],
                newGradeAssign,
            },
        };

        const formData = new FormData();
        formData.append("bodyData", JSON.stringify(body));

        try {
            const response = await UpdateTeacher({ id, formData }).unwrap();
            if (response.success) {
                toast.success(response.message);

                // ✅ Mark them as saved
                setMappings((prev) =>
                    prev.map((mapping) => ({
                        ...mapping,
                        grades: mapping.grades.map((grade) => ({
                            ...grade,
                            __isNew__: false,
                        })),
                    }))
                );
            }
        } catch (error) {
            toast.warning(
                (error as any)?.data?.message ||
                "Something went wrong while saving new grades."
            );
        }
    };

    return (
        <div>
            <div className="flex flex-col items-start gap-6 mb-6 relative">
                {/* ✅ School Name */}
                <div className="flex-1 relative w-full">
                    <Label>School Name</Label>
                    <GetSchools
                        onChange={(selectedSchool) => handleSchoolChange(selectedSchool)}
                        excludeIds={selectedSchoolIds}
                    />

                    {teacherSchoolName && (
                        <div className="flex items-center gap-2 mt-2 absolute top-[35%] left-4">
                            <Image
                                src={defaultImg}
                                height={50}
                                width={50}
                                alt={teacherSchoolName || "Teacher Name"}
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    opacity: "0%",
                                }}
                                priority
                            />
                            <span>{teacherSchoolName}</span>
                        </div>
                    )}
                </div>

                {/* ✅ Grade Mapping */}
                <div className="flex-1 w-full">
                    <Label>Grade Section Mapping</Label>
                    <CreatableSelect
                        isMulti
                        value={selectedGrades}
                        components={{
                            MultiValueRemove: (props) => (
                                <div
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleRemoveClick(props.data as GradeOption);
                                    }}
                                    className="px-1 cursor-pointer text-gray-500 hover:text-red-600"
                                >
                                    ✕
                                </div>
                            ),
                        }}
                        styles={{
                            container: (base) => ({
                                ...base,
                                marginTop: "0.5rem",
                            }),
                            control: (base) => ({
                                ...base,
                                borderColor: "#CBD5E1",
                                borderRadius: "0.5rem",
                                boxShadow: "none",
                                padding: "2px 4px",
                            }),
                            option: (base) => ({
                                ...base,
                                backgroundColor: "#FFFFFF",
                                color: "#000000",
                            }),
                        }}
                    />
                </div>
            </div>

            {/* ✅ Confirmation Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="p-6">
                    <DialogHeader>
                        <DialogTitle>Remove Grade</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-700">
                        Are you sure you want to remove{" "}
                        <span className="font-semibold">{optionToRemove?.label}</span>?
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-3 py-1 border rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmRemove}
                            disabled={isUpdating}
                            className="px-3 py-1 bg-red-600 text-white rounded-md"
                        >
                            {isUpdating ? "Removing..." : "Remove"}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ✅ Buttons */}
            <div className="flex justify-center gap-3 pt-3 mt-6">
                <Button
                    variant="outline"
                    className="px-6 border-[#636F85] text-[#636F85]"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    onClick={handleSave}
                    className="px-6 text-white font-medium border border-[#1E3A8A] transition-all duration-300 bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"
                >
                    {isUpdating ? (
                        <div className="flex justify-center items-center gap-2">
                            Saving...
                            <div className="animate-spin">
                                <PiSpinner className="h-4 w-4" />
                            </div>
                        </div>
                    ) : (
                        "Save & Continue"
                    )}
                </Button>
            </div>
        </div>
    );
};

export default UpdateTeachersGrade;