/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { useGetAllAssignmentsByTeacherQuery } from '@/redux/api/teacher/overviewApi';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../ui/button';
import { FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import line from '@/assets/line.svg';
import { TfiAngleRight } from 'react-icons/tfi';

const Assignment = () => {
    const { id } = useParams();
    const { data } = useGetAllAssignmentsByTeacherQuery(id)

    return (
        <div>
            <div className='md:flex justify-between items-center mb-10'>
                <div className='mb-6 md:mb-0'>
                    <h1 className='text-2xl font-bold mb-3'>Assignment List</h1>
                </div>
                <Link href="/admin/schools/add-new-school">
                    <Button className='bg-transparent text-[#1E3A8A] border border-[#1E3A8A] hover:bg-transparent cursor-pointer'>
                        <FaPlus />
                        Add New Assignment
                    </Button>
                </Link>
            </div>

            <div className='space-y-4'>
                {
                    data?.result?.assignments?.map((assignment: any, idx: number) => (
                        <Link href={`/teacher/classes/${id}/assignment/${assignment?.id}`} key={idx} className='bg-[#F7F9FF] border border-[#E7E8EB] rounded-xl p-5 flex justify-between items-center hover:bg-gray-50 cursor-pointer'>
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
                }
            </div>
        </div>
    );
};

export default Assignment;