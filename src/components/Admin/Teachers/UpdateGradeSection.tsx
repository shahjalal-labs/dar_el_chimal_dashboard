/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useGetAllBookCategoriesQuery } from "@/redux/api/bookCategory";
import Select, { ActionMeta, OnChangeValue, StylesConfig } from 'react-select';

interface GradeOption {
    id: string;
    label: string;
    schoolId: string;
    __isNew__?: boolean;
}

interface CategoryOption {
    id: string;
    categoryName: string;
    isFixed?: false;
}

const styles: StylesConfig<CategoryOption, true> = {
    multiValue: (base, state) => ({
        ...base,
        backgroundColor: state.data.isFixed ? "#9CA3AF" : "#E5E7EB", // gray
        borderRadius: "9999px",
        padding: "0 4px",
    }),
    multiValueLabel: (base, state) => ({
        ...base,
        fontWeight: state.data.isFixed ? "600" : "400",
        color: state.data.isFixed ? "white" : "#374151",
        paddingRight: 6,
    }),
    multiValueRemove: (base, state) => ({
        ...base,
        display: state.data.isFixed ? "none" : "flex",
        cursor: "pointer",
    }),
    control: (base) => ({
        ...base,
        borderColor: '#CBD5E1',
        borderRadius: '0.5rem',
        boxShadow: 'none',
        padding: '2px 4px',
    }),
};

const UpdateGradeSection = ({ id }: { id: string }) => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<SchoolOption | null>(null);
    const [selectedGrades, setSelectedGradesState] = useState<GradeOption[]>([]);
    const [optionToRemove, setOptionToRemove] = useState<GradeOption | null>(null);
    const [categoryOptionToRemove, setCategoryOptionToRemove] = useState<CategoryOption | null>(null);

    const { data: teacherData } = useGetTeacherDetailsQuery(id);
    const teacher = teacherData?.result;

    const [schoolId, setSchoolId] = useState<string>(teacher?.Teacher?.[0]?.grade?.school?.id);

    const { data: schoolData } = useGetSingleSchoolQuery({ id: schoolId });
    const { data: allBookCategories } = useGetAllBookCategoriesQuery({ currentPage: 1, limit: 1000 });

    const allCategories: CategoryOption[] =
        allBookCategories?.result?.result?.map((category: any) => ({
            id: category?.id,
            categoryName: category?.name,
            isFixed: false,
        })) ?? [];

    const orderOptions = (values: readonly CategoryOption[]) => {
        return [
            ...values.filter((v) => v.isFixed),
            ...values.filter((v) => !v.isFixed),
        ];
    };

    const [value, setValue] = useState<readonly CategoryOption[]>(
        teacherData?.result?.teachersBookCategories?.map((category: any) => ({ id: category?.category?.id, categoryName: category?.category?.name }))
    );

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

    const onChange = (
        newValue: OnChangeValue<CategoryOption, true>,
        actionMeta: ActionMeta<CategoryOption>
    ) => {
        switch (actionMeta.action) {
            case "remove-value":
            case "pop-value":
                if (actionMeta.removedValue.isFixed) {
                    return;
                }
                break;
            case "clear":
                newValue = value.filter((v) => v.isFixed); // keep fixed ones
                break;
        }

        setValue(orderOptions(newValue));
    };

    const handleSchoolChange = (school: SchoolOption) => {
        setSelectedSchool(school);
        setSchoolId(school?.schoolId);
        dispatch(setTeacherSchoolName(school?.schoolName));
    };

    const handleChange = (newValue: any) => {
        setSelectedGradesState(newValue);
        dispatch(setSelectedGrades(newValue));
    };

    const handleRemoveCategory = (option: CategoryOption) => {
        setCategoryOptionToRemove(option);
        setIsCategoryModalOpen(true);
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
                    deletedGrade: [optionToRemove?.id],
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

    const confirmRemoveCategory = async () => {
        if (!categoryOptionToRemove) return;
        try {
            const body = {
                userData: {},
                gradeData: {},
                newBookCategoryIds: [],
                deletedBookCategoryIds: [categoryOptionToRemove?.id]
            };

            const formData = new FormData();
            formData.append("bodyData", JSON.stringify(body));
            const response = await updateTeacher({ id, formData }).unwrap();

            if (response.success) {
                toast.success(response.message);
                setValue((prev) => prev.filter((g) => g.id !== categoryOptionToRemove.id));
                setIsCategoryModalOpen(false);
                setCategoryOptionToRemove(null);
            }
        } catch (error) {
            toast.warning(
                (error as any)?.data?.message ||
                "Something went wrong while removing the category."
            );
        }
    };

    const handleSave = async () => {
        let newGradeAssign = [""];

        const mappedGrades = teacher.Teacher.map((t: any) => ({
            id: t.grade.id
        }));

        const mappedCategories = teacherData?.result?.teachersBookCategories?.map((category: any) => ({
            id: category?.category?.id
        }))

        const mappedIds = mappedCategories.map((g: any) => String(g.id).trim());

        const newBookCategoryIds = value
            .filter(sg => !mappedIds.includes(String(sg.id).trim()))
            .map(sg => sg.id);

        if (teacher?.Teacher[0]?.grade?.school?.id !== schoolId) {
            newGradeAssign = selectedGrades?.map((g) => g.id);
        }
        else {
            const mappedIds = mappedGrades.map((g: any) => String(g.id).trim());
            newGradeAssign = selectedGrades
                .filter(sg => !mappedIds.includes(String(sg.id).trim()))
                .map(sg => sg.id);
        }

        const body = {
            userData: {},
            gradeData: {
                deletedGrade: [],
                newGradeAssign: newGradeAssign,
            },
            newBookCategoryIds: newBookCategoryIds,
            deletedBookCategoryIds: []
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
                <div className="w-full">
                    <Label>Select Book Categories</Label>
                    <Select
                        value={value}
                        isMulti
                        styles={styles}
                        name="categories"
                        className="react-select-container rounded-xl mt-2"
                        classNamePrefix="select"
                        getOptionLabel={(option) => option.categoryName}
                        getOptionValue={(option) => option.id}
                        onChange={onChange}
                        options={allCategories}
                        placeholder="Choose categories..."
                        components={{
                            MultiValueRemove: (props) => (
                                <div
                                    onClick={(e) => {
                                        console.log(props);
                                        e.preventDefault();
                                        handleRemoveCategory(props.data as CategoryOption);
                                    }}
                                    className="px-1 cursor-pointer text-gray-500 hover:text-red-600">
                                    ✕
                                </div>
                            )
                        }}
                    />
                </div>

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
                        // onCreateOption={handleCreateOption}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.id}
                        components={{
                            MultiValueRemove: (props) => (
                                <div className="px-1 cursor-pointer text-gray-500 hover:text-red-600">
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

                {/* Tag */}
                <div className="flex flex-wrap gap-2">
                    {selectedGrades?.map((grade: any) => (
                        <div key={grade?.id} className="bg-[#F1F5F9] text-sm rounded-md flex items-center gap-1.5 w-fit px-2.5 py-0.5">
                            {grade?.label}
                            <button type="button" onClick={() => handleRemoveClick(grade)} className="text-gray-700 hover:text-red-600 text-lg cursor-pointer">
                                ×
                            </button>
                        </div>
                    ))}
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
                            variant="default"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border rounded-md bg-white text-black hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmRemove}
                            disabled={isUpdating}
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

            {/* ✅ Confirmation Modal 2 */}
            <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                <DialogContent className="p-6">
                    <DialogHeader>
                        <DialogTitle>Remove Category</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-700">
                        Are you sure you want to remove{" "}
                        <span className="font-semibold">{categoryOptionToRemove?.categoryName}</span>?
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="default"
                            onClick={() => setIsCategoryModalOpen(false)}
                            className="px-4 py-2 border rounded-md bg-white text-black hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmRemoveCategory}
                            disabled={isUpdating}
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