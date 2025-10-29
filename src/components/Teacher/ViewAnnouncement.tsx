/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SlCalender } from 'react-icons/sl';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useDeleteAnnouncementByTeacherMutation, useGetSingleAnnouncementByTeacherQuery } from '@/redux/api/teacher/overviewApi';
import UpdateAnnouncement from './UpdateAnnouncement';
import { TfiAngleLeft } from 'react-icons/tfi';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { toast } from 'sonner';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { PiSpinner } from 'react-icons/pi';

const ViewAnnouncement = () => {
    const route = useRouter();
    const { announcmentId } = useParams();
    const { data } = useGetSingleAnnouncementByTeacherQuery(announcmentId);
    const [DeleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementByTeacherMutation();

    const handleDelete = async (announcmentId: string) => {
        try {
            const response = await DeleteAnnouncement(announcmentId).unwrap();
            if (response.success) {
                toast.success(response.message);
                route.back();
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    }

    return (
        <div>
            <Button onClick={() => route.back()} className='mb-6 bg-white/80 text-black hover:text-white cursor-pointer'><TfiAngleLeft />Back</Button>

            <h1 className='text-[#262626] text-2xl font-bold'>{data?.result?.title}</h1>
            <div className='flex items-center gap-6 my-4'>
                <div className='flex items-center gap-2'>
                    <SlCalender className='w-4 h-4' />
                    <p className='text-[#4C4C4C]'>{new Date(data?.result?.postdate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}</p>
                </div>
                {/* <div className='flex items-center gap-2'>
                    <MdOutlineRemoveRedEye className='w-4 h-4' />
                    <p className='text-[#4C4C4C]'>Seen by 21</p>
                </div> */}
            </div>
            <p className='text-[#4C4C4C] mb-10'>{data?.result?.anouncement}</p>

            <div className="flex justify-center gap-3 pt-3">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        {/* <Button className="bg-[#FE4D4F33] hover:bg-[#FE4D4F26] text-[#FE4D4F] transition-colors ease-in-out duration-200 cursor-pointer">
                            
                            {(isSchoolDeleting || isBookDeleting) &&
                                selectedId === singleData?.Id ? (
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            ) : (
                                <RiDeleteBin6Line className="w-6 h-6" />
                            )}
                        </Button> */}

                        <Button
                            variant="outline"
                            className="px-6 border-[#636F85] text-[#636F85]"
                        >
                            {isDeleting ? (
                                <div className='flex items-center gap-2'>
                                    <span className="">Deleting...</span>
                                    <div className="animate-spin">
                                        <PiSpinner className="h-4 w-4" />
                                    </div>
                                </div>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <span className="">Delete</span>
                                    <RiDeleteBin6Line className="w-6 h-6" />
                                </div>
                            )}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#30373D] text-3xl font-bold text-center">
                                Delete Announcement?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[#636F85] text-center text-base mt-4">
                                Are you sure you want to permanently delete this Announcement?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex justify-center items-center gap-4">
                            <AlertDialogCancel className="flex-1 font-bold text-[#636F85] cursor-pointer transition-all duration-500 ease-in-out">
                                No
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A80] flex-1 cursor-pointer transition-all duration-500 ease-in-out"
                                onClick={() => handleDelete(String(announcmentId))}
                            >
                                Yes
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className={`px-10 text-white font-medium border border-[#1E3A8A] transition-all duration-300 bg-[#1E3A8A] hover:bg-[#1E3A8A]/80`}
                        >
                            Edit
                        </Button>
                    </DialogTrigger>
                    <UpdateAnnouncement announcmentId={String(announcmentId)} />
                </Dialog>
            </div>
        </div>
    );
};

export default ViewAnnouncement;