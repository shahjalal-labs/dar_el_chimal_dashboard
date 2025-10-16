"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetSingleAnnouncementQuery } from '@/redux/api/announcement';
import { SlCalender } from 'react-icons/sl';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import UpdateAnnouncement from './UpdateAnnouncement';

const ViewAnnouncement = () => {
    const { id } = useParams();
    const { data } = useGetSingleAnnouncementQuery(id);

    return (
        <div>
            <h1 className='text-[#262626] text-2xl font-bold'>{data?.result?.title}</h1>
            <div className='flex items-center gap-6 my-4'>
                <div className='flex items-center gap-2'>
                    <SlCalender className='w-4 h-4' />
                    <p className='text-[#4C4C4C]'>{new Date(data?.result?.postdate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}</p>
                </div>
                <div className='flex items-center gap-2'>
                    <MdOutlineRemoveRedEye className='w-4 h-4' />
                    <p className='text-[#4C4C4C]'>Seen by 21</p>
                </div>
            </div>
            <p className='text-[#4C4C4C] mb-10'>{data?.result?.anouncement}</p>

            <div className="flex justify-center gap-3 pt-3">
                <Button
                    variant="outline"
                    className="px-6 border-[#636F85] text-[#636F85]"
                >
                    Delete
                </Button>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className={`px-10 text-white font-medium border border-[#1E3A8A] transition-all duration-300 bg-[#1E3A8A] hover:bg-[#1E3A8A]/80`}
                        >
                            Edit
                        </Button>
                    </DialogTrigger>
                    <UpdateAnnouncement id={String(id)} />
                </Dialog>
            </div>
        </div>
    );
};

export default ViewAnnouncement;