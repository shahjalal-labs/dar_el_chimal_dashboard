/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { useGetAllAnnouncementsQuery } from '@/redux/api/announcement';
import { SlCalender } from "react-icons/sl";
import { SyncLoader } from 'react-spinners';
import { TfiAngleRight } from 'react-icons/tfi';

const AnnouncementList = () => {
    const { data } = useGetAllAnnouncementsQuery(undefined);

    return (
        <div>
            <div className='md:flex justify-between items-center mb-10'>
                <div className='mb-6 md:mb-0'>
                    <h1 className='text-2xl font-bold mb-3'>Announcement List</h1>
                </div>
                <Link href="/admin/announcements/add-new-announcement">
                    <Button className='bg-transparent text-[#1E3A8A] border border-[#1E3A8A] hover:bg-transparent cursor-pointer'>
                        <FaPlus />
                        Add New Announcement
                    </Button>
                </Link>
            </div>

            <div className='grid grid-cols-1 gap-4'>
                {
                    !data?.result?.length ?
                        <div className="flex justify-center items-center gap-4">
                            <span className="text-[#1E3A8A]">Data is Loading</span>
                            <SyncLoader color='#1E3A8A' />
                        </div> :
                        data?.result?.map((announce: any, idx: number) => (
                            <Link href={`/admin/announcements/${announce?.id}`} key={idx} className='bg-[#F7F9FF] border border-[#D8D8D8] rounded-2xl flex justify-between items-center p-5'>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <SlCalender className='w-4 h-4' />
                                        <p className='text-[#4C4C4C]'>{new Date(announce?.postdate).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}</p>
                                    </div>
                                    <h1 className='text-[#262626] font-semibold mt-2'>{announce?.anouncement}</h1>
                                </div>
                                <button><TfiAngleRight className='w-6 h-6' /></button>
                            </Link>
                        ))
                }
            </div>
        </div>
    );
};

export default AnnouncementList;