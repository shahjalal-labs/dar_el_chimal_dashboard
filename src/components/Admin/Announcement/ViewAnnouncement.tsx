/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDeleteAnnouncementMutation, useGetSingleAnnouncementQuery } from '@/redux/api/announcement';
import { SlCalender } from 'react-icons/sl';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import UpdateAnnouncement from './UpdateAnnouncement';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PiSpinner } from 'react-icons/pi';
import { toast } from 'sonner';

const ViewAnnouncement = () => {
    const route = useRouter();
    const { id } = useParams();
    const { data } = useGetSingleAnnouncementQuery(id);
    
    const [DeleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation();

    const handleDelete = async () => {
        try {
            const response = await DeleteAnnouncement(id).unwrap();
            if (response.success) {
                toast.success(response.message);
                route.push('/admin/announcements');
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    }

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
                {/* <div className='flex items-center gap-2'>
                    <MdOutlineRemoveRedEye className='w-4 h-4' />
                    <p className='text-[#4C4C4C]'>Seen by 21</p>
                </div> */}
            </div>
            <p className='text-[#4C4C4C] mb-10'>{data?.result?.anouncement}</p>

            <div className="flex justify-center gap-3 pt-3">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="bg-[#FE4D4F33] hover:bg-[#FE4D4F26] text-[#FE4D4F] transition-colors ease-in-out duration-200 cursor-pointer">
                            <span className="">Delete</span>
                            {isDeleting ? (
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            ) : (
                                <></>
                            )}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#30373D] text-3xl font-bold text-center">
                                Delete {data?.result?.title}?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[#636F85] text-center text-base mt-4">
                                Are you sure you want to permanently delete this anouncement?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex justify-center items-center gap-4">
                            <AlertDialogCancel className="flex-1 font-bold text-[#636F85] cursor-pointer transition-all duration-500 ease-in-out">
                                No
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A80] flex-1 cursor-pointer transition-all duration-500 ease-in-out"
                                onClick={() => handleDelete()}
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
                    <UpdateAnnouncement id={String(id)} />
                </Dialog>
            </div>
        </div>
    );
};

export default ViewAnnouncement;