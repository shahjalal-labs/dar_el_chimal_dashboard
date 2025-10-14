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
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
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
    const dispatch = useDispatch();
    const route = useRouter();
    const {
        teacherName,
        userName,
        password,
        email,
        teacherPhoto
    } = useSelector((state: RootState) => state.teacher);
    // const selectedFromRedux = useSelector((state: RootState) => state.school.options);
    // const [selectedOptions, setSelectedOptions] = useState(selectedFromRedux);
    const [mappings, setMappings] = useState<Mapping[]>([
        { id: Date?.now()?.toString(), school: null, grades: [] },
    ]);

    const { data: gradesData } = useGetAllGradesQuery({
        currentPage: 1,
        limit: 1000,
    });

    const [CreateTeacher, { isLoading: isCreating }] = useCreateTeacherMutation();

    const allGrades: GradeOption[] =
        gradesData?.result?.map((singleGrade: any) => ({
            id: singleGrade?.id,
            label: singleGrade?.grade,
            schoolId: singleGrade?.schoolId,
        })) ?? [];

    const handleSchoolChange = (id: string, school: SchoolOption) => {
        setMappings((prev) =>
            prev?.map((item) =>
                item?.id === id ? { ...item, school, grades: [] } : item
            )
        );
    };

    const handleGradeChange = (id: string, selectedGrades: readonly GradeOption[]) => {
        setMappings((prev) =>
            prev?.map((item) =>
                item?.id === id ? { ...item, grades: [...selectedGrades] } : item
            )
        );
    };

    const handleRemoveMapping = (id: string) => {
        setMappings((prev) => prev?.filter((item) => item?.id !== id));
    };

    const selectedSchoolIds = useMemo(
        () => mappings?.filter((m) => m?.school)?.map((m) => m?.school!.schoolId),
        [mappings]
    );

    const handleSave = async () => {
        const body = {
            name: teacherName,
            userName: userName,
            password: password,
            email: email,
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
                dispatch(setPassword(''))
                dispatch(setEmail(''))
                dispatch(setPreviewTeacherPhoto(''))
                route.push('/admin/teachers')
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    };

    // const isButtonDisabled = !selectedOptions?.length;

    return (
        <div>
            {mappings?.map((mapping) => {
                const { school, grades } = mapping;

                // Filter grades for the selected school
                const filteredGradeOptions = school
                    ? allGrades?.filter(
                        (g) => String(g?.schoolId) === String(school?.schoolId)
                    )
                    : [];

                return (
                    <div
                        key={mapping?.id}
                        className="flex flex-col md:flex-row items-start gap-6 mb-6 relative"
                    >
                        {/* School Name */}
                        <div className="flex-1 relative w-full">
                            <Label>School Name</Label>
                            <GetSchools
                                onChange={(selectedSchool) =>
                                    handleSchoolChange(mapping?.id, selectedSchool)
                                }
                                excludeIds={selectedSchoolIds}
                            />

                            {/* Display selected school */}
                            {school && (
                                <div className="flex items-center gap-2 mt-2 absolute top-[35%] left-4">
                                    {school?.image && (
                                        <Image
                                            src={school?.image}
                                            height={32}
                                            width={24}
                                            alt={school?.schoolName}
                                            className="rounded-xl"
                                        />
                                    )}
                                    <span>{school?.schoolName}</span>
                                </div>
                            )}
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
                                onChange={(selectedOptions) =>
                                    handleGradeChange(mapping?.id, selectedOptions)
                                }
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

                        {/* Remove Button */}
                        {mappings?.length > 1 && (
                            <Button
                                variant="ghost"
                                className="absolute -top-2 right-0 text-red-500 hover:text-red-700 hover:bg-transparent cursor-pointer"
                                onClick={() => handleRemoveMapping(mapping?.id)}
                            >
                                <FaTrash />
                            </Button>
                        )}
                    </div>
                );
            })}

            {/* Add More Button */}
            {/* <Button
                onClick={handleAddMapping}
                className="font-semibold bg-[#1E3A8A1A] hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white rounded-xl px-6 py-2?.5 transition-all duration-500 ease-in-out cursor-pointer mt-4"
            >
                <FaPlus className="mr-2" /> Add More
            </Button> */}

            {/* Footer Buttons */}
            <div className="flex justify-center items-center gap-3 pt-6">
                <Link href="/admin/books">
                    <Button
                        variant="outline"
                        className="px-6 border-[#636F85] text-[#636F85] font-medium"
                    >
                        Cancel
                    </Button>
                </Link>

                <Button
                    onClick={handleSave}
                    // disabled={isButtonDisabled}
                    className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A] text-white font-medium px-6"
                >
                    {
                        (isCreating) ?
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
        </div>
    );
};

export default Grade;