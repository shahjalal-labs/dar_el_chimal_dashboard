/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import GetSchools from '@/components/Common/GetSchools';
import { useDispatch, useSelector } from 'react-redux';
import { setSchool } from '@/redux/features/bookSlice';
import { RootState } from '@/redux/store/store';
import Image from 'next/image';
import { useGetAllGradesQuery } from '@/redux/api/admin/grade';

const Grade = () => {
    const dispatch = useDispatch();
    const { schoolName, image } = useSelector((state: RootState) => state.book);
    const { data } = useGetAllGradesQuery({ currentPage: 1, limit: 1000 })

    const gradeOptions =
        data?.result?.map((singleGrade: any) => ({
            id: singleGrade.id,
            label: singleGrade.grade,
        })) ?? [];

    console.log(gradeOptions);

    return (
        <div>
            <div className="flex items-start gap-6">
                {/* School Name */}
                <div className="flex-1 relative">
                    <Label>School Name</Label>
                    <GetSchools
                        onChange={(school) => {
                            dispatch(setSchool(school))
                        }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className='absolute z-10 top-[50%] left-[15px]'>
                        <Image
                            src={image}
                            height={50}
                            width={50}
                            alt={schoolName}
                            style={{ width: 24, height: 24, borderRadius: '50%' }}
                            priority
                        />
                        <span className=''>{schoolName}</span>
                    </div>
                </div>
                {/* Grade Section Mapping */}
                <div className="flex-1">
                    <Label>Grade Section Mapping</Label>
                    <Select
                        isMulti
                        options={gradeOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.id}
                        onChange={(selectedOptions) => {
                            console.log("Selected Grades:", selectedOptions);
                        }}
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
                            placeholder: (base) => ({
                                ...base,
                                color: '#909296',
                                fontSize: '0.875rem',
                            }),
                            input: (base) => ({
                                ...base,
                                outline: 'none',
                            }),
                        }}
                    />
                    <div className="mt-6 flex items-center gap-4">
                        <Button className="font-semibold bg-[#1E3A8A1A] hover:bg-[#1E3A8A] text-black hover:text-white rounded-xl px-6 py-2.5 transition-all duration-500 ease-in-out cursor-pointer">All</Button>
                        <Button className="text-[#D00E11] font-semibold bg-[#D00E111A] hover:bg-[#D00E11] hover:text-white rounded-xl px-6 py-2.5 transition-all duration-500 ease-in-out cursor-pointer">Clear</Button>
                    </div>
                </div>
            </div>
            <Button className="font-semibold bg-[#1E3A8A1A] hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white rounded-xl px-6 py-2.5 transition-all duration-500 ease-in-out cursor-pointer"><FaPlus />Add More</Button>

            <div className="flex justify-center items-center gap-3 pt-3">
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