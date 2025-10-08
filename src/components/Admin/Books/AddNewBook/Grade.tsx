/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { FaPlus, FaTrash } from 'react-icons/fa';
import GetSchools from '@/components/Common/GetSchools';
import { useDispatch, useSelector } from 'react-redux';
import { setSchoolGradeMappings } from '@/redux/features/bookSlice';
import { RootState } from '@/redux/store/store';
import Image from 'next/image';
import { useGetAllGradesQuery } from '@/redux/api/admin/grade';

const Grade = () => {
    const dispatch = useDispatch();
    const { schoolGradeMappings } = useSelector((state: RootState) => state.book);

    const { data: gradesData } = useGetAllGradesQuery({ currentPage: 1, limit: 1000 });

    const [mappings, setMappings] = useState([
        { id: Date.now().toString(), school: null, grades: [] },
    ]);

    console.log(schoolGradeMappings);

    const allGrades =
        gradesData?.result?.map((singleGrade: any) => ({
            id: singleGrade.id,
            label: singleGrade.grade,
            schoolId: singleGrade.schoolId,
        })) ?? [];

    // Function to add new mapping (school + grade)
    const handleAddMapping = () => {
        const updated = [
            ...mappings,
            { id: Date.now().toString(), school: null, grades: [] },
        ];
        setMappings(updated);
        dispatch(setSchoolGradeMappings(updated));
    };

    // Function to remove mapping
    const handleRemoveMapping = (id: string) => {
        const updated = mappings.filter((item) => item.id !== id);
        setMappings(updated);
        dispatch(setSchoolGradeMappings(updated));
    };

    // Handle school selection (store schoolId, name, image)
    const handleSchoolChange = (id: string, school: any) => {
        const updated = mappings.map((item) =>
            item.id === id ? { ...item, school, grades: [] } : item
        );
        setMappings(updated);
        dispatch(setSchoolGradeMappings(updated));
    };

    // Handle grade selection (store grade ids + names)
    const handleGradeChange = (id: string, selectedGrades: any) => {
        const updated = mappings.map((item) =>
            item.id === id ? { ...item, grades: selectedGrades } : item
        );
        setMappings(updated);
        dispatch(setSchoolGradeMappings(updated));
    };

    // Filter schools so already selected ones can't be chosen again
    const selectedSchoolIds = useMemo(
        () =>
            mappings
                .filter((m) => m.school)
                .map((m) => m.school.schoolId),
        [mappings]
    );

    return (
        <div>
            {mappings.map((mapping, index) => {
                const { school, grades } = mapping;

                // Grades available only for the selected school
                const filteredGradeOptions = school
                    ? allGrades.filter((g) => g.schoolId === school.schoolId)
                    : [];

                return (
                    <div key={mapping.id} className="flex items-start gap-6 mb-6 relative">
                        {/* School Name */}
                        <div className="flex-1 relative">
                            <Label>School Name</Label>
                            <GetSchools
                                onChange={(selectedSchool: any) =>
                                    handleSchoolChange(mapping.id, selectedSchool)
                                }
                                excludeIds={selectedSchoolIds}
                            />
                            {/* KEEPING YOUR DIV EXACTLY AS REQUESTED */}
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                className="absolute top-[50%] left-[15px]"
                            >
                                {school?.image && (
                                    <Image
                                        src={school.image}
                                        height={50}
                                        width={50}
                                        alt={school.schoolName}
                                        style={{ width: 24, height: 24, borderRadius: '50%' }}
                                        priority
                                    />
                                )}
                                <span className="">{school?.schoolName}</span>
                            </div>
                        </div>

                        {/* Grade Section Mapping */}
                        <div className="flex-1">
                            <Label>Grade Section Mapping</Label>
                            <Select
                                isMulti
                                options={filteredGradeOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.id}
                                value={grades}
                                onChange={(selectedOptions) =>
                                    handleGradeChange(mapping.id, selectedOptions)
                                }
                                styles={{
                                    container: (base) => ({
                                        ...base,
                                        marginTop: '0.5rem',
                                    }),
                                    control: (base) => ({
                                        ...base,
                                        borderColor: '#CBD5E1',
                                        borderRadius: '0.5rem',
                                        boxShadow: 'none',
                                        padding: '2px 4px',
                                    }),
                                    option: (base) => ({
                                        ...base,
                                        backgroundColor: '#FFFFFF',
                                        color: '#000000',
                                    }),
                                }}
                            />
                        </div>

                        {/* Remove Button */}
                        {mappings.length > 1 && (
                            <Button
                                variant="ghost"
                                className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 hover:bg-transparent cursor-pointer"
                                onClick={() => handleRemoveMapping(mapping.id)}
                            >
                                <FaTrash />
                            </Button>
                        )}
                    </div>
                );
            })}

            {/* Add More Button */}
            <Button
                onClick={handleAddMapping}
                className="font-semibold bg-[#1E3A8A1A] hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white rounded-xl px-6 py-2.5 transition-all duration-500 ease-in-out cursor-pointer mt-4"
            >
                <FaPlus className="mr-2" /> Add More
            </Button>

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

                <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A] text-white font-medium px-6">
                    Save & Continue
                </Button>
            </div>
        </div>
    );
};

export default Grade;