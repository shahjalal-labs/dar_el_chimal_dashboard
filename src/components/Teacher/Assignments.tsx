/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    useGetAllAssignmentsByTeacherQuery,
    useGetTeacherOverviewQuery,
} from '@/redux/api/teacher/overviewApi';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../ui/button';
import { FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import line from '@/assets/line.svg';
import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const Assignments = () => {
    const route = useRouter();
    const { id } = useParams();

    const { data: teacherOverviewData } = useGetTeacherOverviewQuery(undefined);
    const teacherGrades = useMemo(
        () => teacherOverviewData?.result?.grades || [],
        [teacherOverviewData]
    );

    const [selectedGradeId, setSelectedGradeId] = useState<string>(
        id && id !== 'all' ? (id as string) : ''
    );

    useEffect(() => {
        if (id && id !== 'all') {
            setSelectedGradeId(id as string);
        } else if (!selectedGradeId && teacherGrades.length > 0) {
            setSelectedGradeId(teacherGrades[0].id);
        }
    }, [id, teacherGrades, selectedGradeId]);

    const { data, isLoading } = useGetAllAssignmentsByTeacherQuery(selectedGradeId, {
        skip: !selectedGradeId,
    });

    const handleGradeChange = (gradeId: string) => {
        setSelectedGradeId(gradeId);
        route.replace(`/teacher/classes/${gradeId}/assignments`);
    };

    const currentGrade = teacherGrades.find((g: any) => g.id === selectedGradeId);

    return (
        <div>
            <Button onClick={() => route.back()} className='mb-6 bg-white/80 text-black hover:text-white cursor-pointer'><TfiAngleLeft />Back</Button>

            <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8'>
                <div>
                    <h1 className='text-2xl font-bold'>Assignment List</h1>
                    {currentGrade && (
                        <p className='text-sm text-gray-500 mt-1'>
                            Showing assignments for {currentGrade.grade}
                        </p>
                    )}
                </div>

                <div className='flex items-center gap-3'>
                    {teacherGrades.length > 0 && (
                        <div className='w-48 sm:w-56'>
                            <Select value={selectedGradeId} onValueChange={handleGradeChange}>
                                <SelectTrigger className='bg-white border-gray-300 text-sm font-medium shadow-sm h-10'>
                                    <SelectValue placeholder='Select Class' />
                                </SelectTrigger>
                                <SelectContent className='bg-white z-50 shadow-md'>
                                    {teacherGrades.map((g: any) => (
                                        <SelectItem key={g.id} value={g.id}>
                                            {g.grade}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <Link href={`/teacher/classes/${selectedGradeId || id}/add-new-assignment`}>
                        <Button className='bg-transparent text-[#1E3A8A] border border-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-colors cursor-pointer h-10'>
                            <FaPlus />
                            Add New Assignment
                        </Button>
                    </Link>
                </div>
            </div>

            <div className='space-y-4'>
                {
                    isLoading ? (
                        <div className='text-center text-gray-500 my-10 w-full mx-auto'>Loading assignments...</div>
                    ) : !data?.result?.assignments?.length ? (
                        <div className='text-center text-[#1E3A8A] my-10 w-full mx-auto'>No assignment created yet!</div>
                    ) : (
                        data?.result?.assignments?.map((assignment: any, idx: number) => (
                            <Link href={`/teacher/classes/${selectedGradeId || id}/assignments/${assignment?.id}`} key={idx} className='bg-[#F7F9FF] border border-[#E7E8EB] rounded-xl p-5 flex justify-between items-center hover:bg-gray-50 cursor-pointer'>
                                <div>
                                    <h1 className='text-[#262626] text-xl font-medium mb-2'>{assignment?.title}</h1>
                                    <div className='flex items-center gap-2'>
                                        <Image
                                            src={line}
                                            height={50}
                                            width={50}
                                            alt=''
                                            className='h-10 w-8'
                                            priority
                                        />
                                        <div>
                                            <p className='text-[#4C4C4C]'>Assigned on: {new Date(assignment?.createdAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</p>
                                            <p className='text-[#4C4C4C] mt-1.5'>Due Date: {new Date(assignment?.dueDate).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</p>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[#1C1B1F]"><TfiAngleRight className="w-6 h-6" /></span>
                            </Link>
                        ))
                    )
                }
            </div>
        </div>
    );
};

export default Assignments;