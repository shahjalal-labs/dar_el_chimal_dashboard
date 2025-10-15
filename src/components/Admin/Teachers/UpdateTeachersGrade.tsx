/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from 'react';
import Select from 'react-select';
import GetSchools, { SchoolOption } from '@/components/Common/GetSchools';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useGetAllGradesQuery } from '@/redux/api/grade';

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

const UpdateTeachersGrade = ({ id }: { id: string }) => {
    const [mappings, setMappings] = useState<Mapping[]>([
        { id: Date?.now()?.toString(), school: null, grades: [] },
    ]);

    const { data: gradesData } = useGetAllGradesQuery({
        currentPage: 1,
        limit: 1000,
    });

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

    const selectedSchoolIds = useMemo(
        () => mappings?.filter((m) => m?.school)?.map((m) => m?.school!.schoolId),
        [mappings]
    );

    return (
        <div>
            {mappings?.map((mapping) => {
                const { school, grades } = mapping;

                // Filter grades for the selected school
                const filteredGradeOptions = school
                    ? allGrades?.filter(
                        (g: any) => String(g?.schoolId) === String(school?.schoolId)
                    )
                    : [];

                return (
                    <div
                        key={mapping?.id}
                        className="flex flex-col items-start gap-6 mb-6 relative"
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
                                            alt={school?.schoolName || "School Name"}
                                            className="rounded-xl"
                                            priority
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
                    </div>
                );
            })}
        </div>
    );
};

export default UpdateTeachersGrade;