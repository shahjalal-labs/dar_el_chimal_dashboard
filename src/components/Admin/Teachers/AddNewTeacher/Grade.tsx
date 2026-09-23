/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { FormEvent, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RootState } from '@/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { resetTeacherForm } from '@/redux/features/teacherSlice';
import GetSchools, { SchoolOption } from '@/components/Common/GetSchools';
import Link from 'next/link';
import { PiSpinner } from 'react-icons/pi';
import { useGetAllGradesQuery } from '@/redux/api/grade';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCreateTeacherMutation } from '@/redux/api/teacher';
import Select, { ActionMeta, OnChangeValue, StylesConfig } from 'react-select';
import { useGetAllBookCategoriesQuery } from '@/redux/api/bookCategory';
import { sortGrades } from '@/lib/gradeUtils';

interface GradeOption {
    id: string;
    label: string;
    schoolId: string;
}

interface Mapping {
    id: string;
    school: SchoolOption | null;
    grades: GradeOption[];
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

const Grade = () => {
    const route = useRouter();
    const dispatch = useDispatch();
    const {
        teacherName,
        userName,
        password,
        email,
        teacherPhoto
    } = useSelector((state: RootState) => state.teacher);
    const [mappings, setMappings] = useState<Mapping[]>([{ id: Date?.now()?.toString(), school: null, grades: [] },]);

    const { data: gradesData } = useGetAllGradesQuery({ currentPage: 1, limit: 1000 });
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

    const [CreateTeacher, { isLoading: isCreating }] = useCreateTeacherMutation();

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

    const allGrades: GradeOption[] = useMemo(() => {
        const raw = gradesData?.result?.map((singleGrade: any) => ({
            id: singleGrade?.id,
            label: singleGrade?.grade,
            schoolId: singleGrade?.schoolId,
        })) ?? [];
        return sortGrades(raw);
    }, [gradesData]);

    const handleSchoolChange = (id: string, school: SchoolOption) => {
        setMappings((prev) => prev?.map((item) => item?.id === id ? { ...item, school, grades: [] } : item));
    };

    const handleGradeChange = (id: string, selectedGrades: readonly GradeOption[]) => {
        const sorted = sortGrades([...selectedGrades]);
        setMappings((prev) => prev?.map((item) => item?.id === id ? { ...item, grades: sorted } : item));
    };

    const selectedSchoolIds = useMemo(() => mappings?.filter((m) => m?.school)?.map((m) => m?.school!.schoolId), [mappings]);

    const handleSave = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const body = {
            name: teacherName,
            userName: userName,
            email: email,
            password: password,
            schoolId: mappings[0]?.school?.schoolId,
            gradeIds: mappings[0]?.grades?.map((g: any) => g?.id),
            bookCategoryIds: value?.map((c: any) => c?.id)
        }

        const formData = new FormData();
        formData.append('bodyData', JSON.stringify(body))

        if (teacherPhoto) {
            formData.append('profileImage', teacherPhoto)
        }

        try {
            const response = await CreateTeacher(formData).unwrap();
            if (response.success) {
                toast.success(response.message);
                dispatch(resetTeacherForm());
                route.push('/admin/teachers');
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    };

    const isButtonDisabled = !mappings[0].school || !mappings[0].grades.length;

    return (
        <form
            onSubmit={handleSave}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                    e.preventDefault();
                }
            }}
        >
            <div className="w-full">
                <Label>Select Book Categories</Label>
                <Select
                    value={value}
                    isMulti
                    styles={styles}
                    name="categories"
                    className="react-select-container rounded-xl mt-2 mb-5"
                    classNamePrefix="select"
                    getOptionLabel={(option) => option.categoryName}
                    getOptionValue={(option) => option.id}
                    onChange={onChange}
                    options={allCategories}
                    placeholder="Choose categories..."
                />
            </div>

            {mappings?.map((mapping) => {
                const { school, grades } = mapping;

                const filteredGradeOptions = school
                    ? sortGrades(allGrades?.filter((g) => String(g?.schoolId) === String(school?.schoolId)))
                    : [];

                const isAllSelected = filteredGradeOptions.length > 0 && grades.length === filteredGradeOptions.length;

                const handleToggleSelectAll = () => {
                    if (isAllSelected) {
                        handleGradeChange(mapping.id, []);
                    } else {
                        handleGradeChange(mapping.id, filteredGradeOptions);
                    }
                };

                return (
                    <div
                        key={mapping?.id}
                        className="mb-6 relative space-y-5"
                    >
                        {/* School Name */}
                        <div className="flex-1 relative w-full">
                            <Label className="flex items-center gap-2">
                                School Name
                                <span className="text-xs text-[#636F85] font-normal">(Can search schools)</span>
                            </Label>
                            <GetSchools
                                value={school}
                                onChange={(selectedSchool) => handleSchoolChange(mapping?.id, selectedSchool)}
                                excludeIds={selectedSchoolIds}
                            />
                        </div>

                        {/* Grade Section Mapping */}
                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-1.5">
                                <Label>Grade Section Mapping</Label>
                                {filteredGradeOptions.length > 0 && (
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
                                options={filteredGradeOptions}
                                className="basic-multi-select mt-2"
                                classNamePrefix="select"
                                getOptionLabel={(option) => option?.label}
                                getOptionValue={(option) => option?.id}
                                value={grades}
                                onChange={(selectedOptions) => handleGradeChange(mapping?.id, selectedOptions || [])}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: '#CBD5E1',
                                        borderRadius: '0.5rem',
                                        boxShadow: 'none',
                                        padding: '2px 4px',
                                    }),
                                }}
                            />
                        </div>
                    </div>
                );
            })}

            {/* Footer Buttons */}
            <div className="flex justify-center items-center gap-3 pt-6">
                <Link href="/admin/teachers">
                    <Button
                        type="button"
                        variant="outline"
                        className="px-6 border-[#636F85] text-[#636F85] font-medium"
                    >
                        Cancel
                    </Button>
                </Link>

                <Button
                    type="submit"
                    disabled={isButtonDisabled}
                    className={`px-6 text-white font-medium transition-all ease-in-out duration-500 cursor-pointer ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"}`}
                >
                    {
                        isCreating ?
                            <div className="flex justify-center items-center gap-2">
                                Saving...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div> :
                            "Save & Continue"
                    }
                </Button>
            </div>
        </form>
    );
};

export default Grade;