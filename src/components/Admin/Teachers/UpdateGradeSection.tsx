/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import GetSchools, { SchoolOption } from "@/components/Common/GetSchools";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
    useGetTeacherDetailsQuery,
    useUpdateTeacherMutation,
} from "@/redux/api/teacher";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreatableSelect from "react-select/creatable";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PiSpinner } from "react-icons/pi";
import { useDispatch } from "react-redux";
import {
    setSelectedGrades,
    setTeacherSchoolName,
} from "@/redux/features/teacherSlice";
import defaultImg from "@/assets/school.png";
import { useGetSingleSchoolQuery } from "@/redux/api/school";

interface GradeOption {
    id: string;
    label: string;
    schoolId: string;
    __isNew__?: boolean;
}

const UpdateGradeSection = ({ id }: { id: string }) => {
    const dispatch = useDispatch();
    const [selectedSchool, setSelectedSchool] = useState<SchoolOption | null>(null);
    const [selectedGrades, setSelectedGradesState] = useState<GradeOption[]>([]);
    const [optionToRemove, setOptionToRemove] = useState<GradeOption | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: teacherData } = useGetTeacherDetailsQuery(id);
    const teacher = teacherData?.result;
    const schoolId = teacher?.Teacher?.[0]?.grade?.school?.id;
    const { data: schoolData } = useGetSingleSchoolQuery({ id: schoolId });
    const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

    useEffect(() => {
        if (teacher?.Teacher?.length) {
            const school = teacher.Teacher[0].grade.school;
            setSelectedSchool({
                schoolId: school.id,
                schoolName: school.name,
                image: school.schoolLogo,
            });

            dispatch(setTeacherSchoolName(school.name));

            const mappedGrades: GradeOption[] = teacher.Teacher.map((t: any) => ({
                id: t.grade.id,
                label: t.grade.grade,
                schoolId: school.id,
            }));

            setSelectedGradesState(mappedGrades);
            dispatch(setSelectedGrades(mappedGrades));
        }
    }, [teacher, dispatch]);

    const gradeOptions: GradeOption[] = useMemo(() => {
        if (!schoolData?.result?.grades) return [];
        return schoolData.result.grades.map((g: any) => ({
            id: g.id,
            label: g.grade,
            schoolId: schoolData.result.id,
        }));
    }, [schoolData]);

    const handleSchoolChange = (school: SchoolOption) => {
        setSelectedSchool(school);
        dispatch(setTeacherSchoolName(school.schoolName));
    };

    const handleChange = (newValue: any) => {
        setSelectedGradesState(newValue);
        dispatch(setSelectedGrades(newValue));
    };

    const handleCreateOption = (inputValue: string) => {
        const newOption: GradeOption = {
            id: crypto.randomUUID(),
            label: inputValue,
            schoolId: selectedSchool?.schoolId || "",
            __isNew__: true,
        };
        const newOptions = [...selectedGrades, newOption];
        setSelectedGradesState(newOptions);
        dispatch(setSelectedGrades(newOptions));
    };

    const handleRemoveClick = (option: GradeOption) => {
        setOptionToRemove(option);
        setIsModalOpen(true);
    };

    const confirmRemove = async () => {
        if (!optionToRemove) return;
        try {
            const body = {
                userData: {},
                gradeData: {
                    deletedGrade: [optionToRemove.id],
                    newGradeAssign: [],
                },
            };
            const formData = new FormData();
            formData.append("bodyData", JSON.stringify(body));
            const response = await updateTeacher({ id, formData }).unwrap();
            if (response.success) {
                toast.success(response.message);
                setSelectedGradesState((prev) =>
                    prev.filter((g) => g.id !== optionToRemove.id)
                );
                setIsModalOpen(false);
                setOptionToRemove(null);
            }
        } catch (error) {
            toast.warning(
                (error as any)?.data?.message ||
                "Something went wrong while removing the grade."
            );
        }
    };

    const handleSave = async () => {
        const newGradeAssign = selectedGrades
            .filter((g) => g.__isNew__)
            .map((g) => g.id);

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
            const response = await updateTeacher({ id, formData }).unwrap();
            if (response.success) {
                toast.success(response.message);
            }
        } catch (error) {
            toast.warning(
                (error as any)?.data?.message ||
                "Something went wrong while updating grades."
            );
        }
    };

    return (
        <div>
            <div className="flex flex-col items-start gap-6 mb-6 relative">
                {/* ✅ School Name */}
                <div className="flex-1 relative w-full">
                    <Label>School Name</Label>
                    <GetSchools onChange={handleSchoolChange} />
                    {selectedSchool && (
                        <div className="flex items-center gap-2 mt-2 absolute top-[35%] left-4">
                            <Image
                                src={selectedSchool.image || defaultImg}
                                height={50}
                                width={50}
                                alt={selectedSchool.schoolName}
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    opacity: "50%",
                                }}
                                priority
                            />
                            <span className="opacity-[55%]">{selectedSchool.schoolName}</span>
                        </div>
                    )}
                </div>

                {/* ✅ Grade Mapping */}
                <div className="flex-1 w-full">
                    <Label>Grade Section Mapping</Label>
                    <CreatableSelect
                        isMulti
                        options={gradeOptions}
                        value={selectedGrades}
                        onChange={handleChange}
                        onCreateOption={handleCreateOption}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.id}
                        components={{
                            MultiValueRemove: (props) => (
                                <div
                                    onClick={() => handleRemoveClick(props.data as GradeOption)}
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
                        <Button
                            onClick={() => setIsModalOpen(false)}
                            className="px-3 py-1 border rounded-md"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmRemove}
                            disabled={isUpdating}
                            className="px-3 py-1 bg-red-600 text-white rounded-md"
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

            {/* ✅ Buttons */}
            <div className="flex justify-center gap-3 pt-3 mt-6">
                <Button
                    type="submit"
                    onClick={handleSave}
                    className="px-6 text-white font-medium border border-[#1E3A8A] transition-all duration-300 bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"
                >
                    {isUpdating ? (
                        <div className="flex justify-center items-center gap-2">
                            Updating...
                            <div className="animate-spin">
                                <PiSpinner className="h-4 w-4" />
                            </div>
                        </div>
                    ) : (
                        "Update & Continue"
                    )}
                </Button>
            </div>
        </div>
    );
};

export default UpdateGradeSection;