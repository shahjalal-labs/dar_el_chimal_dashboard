/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import GetSchools, { SchoolOption } from "@/components/Common/GetSchools";
import { Label } from "@/components/ui/label";
import {
    useGetTeacherDetailsQuery,
    useUpdateTeacherMutation,
} from "@/redux/api/teacher";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PiSpinner } from "react-icons/pi";
import { useDispatch } from "react-redux";
import {
    setSelectedGrades,
    setTeacherSchoolName,
} from "@/redux/features/teacherSlice";
import { useGetSingleSchoolQuery } from "@/redux/api/school";
import { useGetAllBookCategoriesQuery } from "@/redux/api/bookCategory";
import Select, { ActionMeta, OnChangeValue, StylesConfig } from 'react-select';
import { sortGrades } from "@/lib/gradeUtils";

interface GradeOption {
    id: string;
    label: string;
    schoolId: string;
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
    const [selectedSchool, setSelectedSchool] = useState<SchoolOption | null>(null);
    const [selectedGrades, setSelectedGradesState] = useState<GradeOption[]>([]);

    const { data: teacherData } = useGetTeacherDetailsQuery(id);
    const teacher = teacherData?.result;

    const [schoolId, setSchoolId] = useState<string>(teacher?.Teacher?.[0]?.grade?.school?.id);

    const { data: schoolData } = useGetSingleSchoolQuery({ id: schoolId }, { skip: !schoolId });
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

    const [value, setValue] = useState<readonly CategoryOption[]>([]);

    const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

    useEffect(() => {
        if (teacherData?.result?.teachersBookCategories) {
            setValue(
                teacherData.result.teachersBookCategories.map((category: any) => ({
                    id: category?.category?.id,
                    categoryName: category?.category?.name,
                }))
            );
        }
    }, [teacherData]);

    useEffect(() => {
        if (teacher?.Teacher?.length) {
            const school = teacher.Teacher[0].grade.school;
            setSelectedSchool({
                schoolId: school.id,
                schoolName: school.name,
                image: school.schoolLogo,
            });
            setSchoolId(school.id);

            dispatch(setTeacherSchoolName(school.name));

            const mappedGrades: GradeOption[] = teacher.Teacher.map((t: any) => ({
                id: t.grade.id,
                label: t.grade.grade,
                schoolId: school.id,
            }));

            const sorted = sortGrades(mappedGrades);
            setSelectedGradesState(sorted);
            dispatch(setSelectedGrades(sorted));
        }
    }, [teacher, dispatch]);

    const gradeOptions: GradeOption[] = useMemo(() => {
        if (!schoolData?.result?.grades) return [];
        const mapped = schoolData.result.grades.map((g: any) => ({
            id: g.id,
            label: g.grade,
            schoolId: schoolData.result.id,
        }));
        return sortGrades(mapped);
    }, [schoolData]);

    const isAllSelected = gradeOptions.length > 0 && selectedGrades.length === gradeOptions.length;

    const handleToggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedGradesState([]);
            dispatch(setSelectedGrades([]));
        } else {
            setSelectedGradesState(gradeOptions);
            dispatch(setSelectedGrades(gradeOptions));
        }
    };

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
                newValue = (value || []).filter((v) => v.isFixed);
                break;
        }

        setValue(orderOptions(newValue || []));
    };

    const handleSchoolChange = (school: SchoolOption) => {
        setSelectedSchool(school);
        setSchoolId(school?.schoolId);
        dispatch(setTeacherSchoolName(school?.schoolName));
        if (school?.schoolId !== selectedSchool?.schoolId) {
            setSelectedGradesState([]);
            dispatch(setSelectedGrades([]));
        }
    };

    const handleChange = (newValue: OnChangeValue<GradeOption, true>) => {
        const sorted = sortGrades<GradeOption>([...(newValue || [])]);
        setSelectedGradesState(sorted);
        dispatch(setSelectedGrades(sorted));
    };

    const handleSave = async () => {
        const initialTeacherGrades = teacher?.Teacher || [];
        const initialGradeIds: string[] = initialTeacherGrades.map((t: any) => String(t.grade.id));
        const currentGradeIds: string[] = (selectedGrades || []).map((g) => String(g.id));

        let deletedGrade: string[] = [];
        let newGradeAssign: string[] = [];

        const initialSchoolId = initialTeacherGrades[0]?.grade?.school?.id;
        if (initialSchoolId && schoolId && initialSchoolId !== schoolId) {
            deletedGrade = initialGradeIds;
            newGradeAssign = currentGradeIds;
        } else {
            deletedGrade = initialGradeIds.filter((id) => !currentGradeIds.includes(id));
            newGradeAssign = currentGradeIds.filter((id) => !initialGradeIds.includes(id));
        }

        const initialCategoryIds: string[] = (teacherData?.result?.teachersBookCategories || []).map(
            (category: any) => String(category?.category?.id)
        );
        const currentCategoryIds: string[] = (value || []).map((c) => String(c.id));

        const deletedBookCategoryIds = initialCategoryIds.filter(
            (id) => !currentCategoryIds.includes(id)
        );
        const newBookCategoryIds = currentCategoryIds.filter(
            (id) => !initialCategoryIds.includes(id)
        );

        const body = {
            userData: {},
            gradeData: {
                deletedGrade,
                newGradeAssign,
            },
            newBookCategoryIds,
            deletedBookCategoryIds,
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
                "Something went wrong while updating teacher."
            );
        }
    };

    return (
        <div>
            <div className="flex flex-col items-start gap-6 mb-6 relative">
                {/* Book Categories */}
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
                    />
                </div>

                {/* School Name */}
                <div className="flex-1 relative w-full">
                    <Label className="flex items-center gap-2">
                        School Name
                        <span className="text-xs text-[#636F85] font-normal">(Can search schools)</span>
                    </Label>
                    <GetSchools value={selectedSchool} onChange={handleSchoolChange} />
                </div>

                {/* Grade Section Mapping */}
                <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-1.5">
                        <Label>Grade Section Mapping</Label>
                        {gradeOptions.length > 0 && (
                            <button
                                type="button"
                                onClick={handleToggleSelectAll}
                                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                            >
                                {isAllSelected ? "Unselect All" : "Select All"}
                            </button>
                        )}
                    </div>
                    <Select<GradeOption, true>
                        isMulti
                        options={gradeOptions}
                        value={selectedGrades}
                        onChange={handleChange}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.id}
                        className="basic-multi-select mt-2"
                        classNamePrefix="select"
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

            {/* Save Button */}
            <div className="flex justify-center gap-3 pt-3 mt-6">
                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isUpdating}
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