/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { useGetAllAnnouncementsByTeacherQuery } from '@/redux/api/teacher/overviewApi';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../ui/button';
import { FaPlus } from 'react-icons/fa';
import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi';
import { SlCalender } from 'react-icons/sl';

const Announcements = () => {
    const route = useRouter();
    const { id } = useParams();
    const { data } = useGetAllAnnouncementsByTeacherQuery(id)

    return (
        <div>
            <Button onClick={() => route.back()} className='mb-6 bg-white/80 text-black hover:text-white cursor-pointer'><TfiAngleLeft />Back</Button>

            <div className='md:flex justify-between items-center mb-10'>
                <div className='mb-6 md:mb-0'>
                    <h1 className='text-2xl font-bold mb-3'>Announcement List</h1>
                </div>
                <Link href={`/teacher/classes/${id}/add-new-announcement`}>
                    <Button className='bg-transparent text-[#1E3A8A] border border-[#1E3A8A] hover:bg-transparent cursor-pointer'>
                        <FaPlus />
                        Add New Announcement
                    </Button>
                </Link>
            </div>

            <div className='space-y-4'>
                {
                    !data?.result?.announcments?.length ?
                        <div className='text-center'>No announcements yet!</div> :
                        data?.result?.announcments?.map((announce: any, idx: number) => (
                            <Link href={`/teacher/classes/${id}/announcements/${announce?.id}`} key={idx} className='bg-[#F7F9FF] border border-[#D8D8D8] rounded-2xl flex justify-between items-center p-5'>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <SlCalender className='w-4 h-4' />
                                        <p className='text-[#4C4C4C]'>{new Date(announce?.postdate).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}</p>
                                    </div>
                                    <h1 className='text-[#262626] font-semibold mt-2'>{announce?.anouncement}</h1>
                                </div>
                                <Button variant="ghost"><TfiAngleRight className='w-6 h-6' /></Button>
                            </Link>
                        ))
                }
            </div>
        </div>
    );
};

export default Announcements;