/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RootState } from '@/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { setEmail, setPassword, setPreviewTeacherPhoto, setTeacherName, setUserName } from '@/redux/features/teacherSlice';
import GetSchools, { SchoolOption } from '@/components/Common/GetSchools';
import Link from 'next/link';
import { PiSpinner } from 'react-icons/pi';
import { useGetAllGradesQuery } from '@/redux/api/grade';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCreateTeacherMutation } from '@/redux/api/teacher';

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

    const [CreateTeacher, { isLoading: isCreating }] = useCreateTeacherMutation();

    const allGrades: GradeOption[] = gradesData?.result?.map((singleGrade: any) => ({
        id: singleGrade?.id,
        label: singleGrade?.grade,
        schoolId: singleGrade?.schoolId,
    })) ?? [];

    const handleSchoolChange = (id: string, school: SchoolOption) => {
        setMappings((prev) => prev?.map((item) => item?.id === id ? { ...item, school, grades: [] } : item));
    };

    const handleGradeChange = (id: string, selectedGrades: readonly GradeOption[]) => {
        setMappings((prev) => prev?.map((item) => item?.id === id ? { ...item, grades: [...selectedGrades] } : item));
    };

    const selectedSchoolIds = useMemo(() => mappings?.filter((m) => m?.school)?.map((m) => m?.school!.schoolId), [mappings]);

    const handleSave = async () => {
        const body = {
            name: teacherName,
            userName: userName,
            email: email,
            password: password,
            schoolId: mappings[0]?.school?.schoolId,
            gradeIds: mappings[0]?.grades?.map((g: any) => g?.id)
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
                dispatch(setTeacherName(''))
                dispatch(setUserName(''))
                dispatch(setEmail(''))
                dispatch(setPassword(''))
                dispatch(setPreviewTeacherPhoto(''))
                route.push('/admin/teachers')
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    };

    const isButtonDisabled = !mappings[0].school || !mappings[0].grades.length;

    return (
        <form onSubmit={handleSave}>
            {mappings?.map((mapping) => {
                const { school, grades } = mapping;

                const filteredGradeOptions = school ? allGrades?.filter((g) => String(g?.schoolId) === String(school?.schoolId)) : [];

                return (
                    <div
                        key={mapping?.id}
                        className="mb-6 relative space-y-5"
                    >
                        {/* School Name */}
                        <div className="flex-1 relative w-full">
                            <Label>School Name</Label>
                            <GetSchools
                                onChange={(selectedSchool) => handleSchoolChange(mapping?.id, selectedSchool)}
                                excludeIds={selectedSchoolIds}
                            />
                        </div>

                        {/* Grade Section Mapping */}
                        <div className="flex-1 w-full">
                            <Label>Grade Section Mapping</Label>
                            <Select<GradeOption, true>
                                isMulti
                                options={filteredGradeOptions}
                                className="basic-multi-select mt-2"
                                classNamePrefix="select"
                                getOptionLabel={(option) => option?.label}
                                getOptionValue={(option) => option?.id}
                                value={grades}
                                onChange={(selectedOptions) => handleGradeChange(mapping?.id, selectedOptions)}
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