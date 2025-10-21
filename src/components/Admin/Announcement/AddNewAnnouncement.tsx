/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { setAnnouncement, setAnnouncementDate, setAnnouncementTitle } from '@/redux/features/announcementSlice';
import { RootState } from '@/redux/store/store';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { useCreateAnnouncementMutation } from '@/redux/api/announcement';
import { PiSpinner } from 'react-icons/pi';

const AddNewAnnouncement = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { announcement, announcementTitle, announcementDate } = useSelector((state: RootState) => state.announcement);

    const [CreateAnnouncement, { isLoading }] = useCreateAnnouncementMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body =
        {
            title: announcementTitle,
            anouncement: announcement,
            postdate: announcementDate
        }
        try {
            const response = await CreateAnnouncement(body).unwrap();
            if (response.success) {
                toast.success(response.message);
            }
        }
        catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    }

    const isButtonDisabled =
        !announcementTitle || !announcement || !announcementDate;

    return (
        <div>
            {/* Header */}
            <div className='mb-10'>
                <h1 className='text-2xl font-bold mb-3'>Add New Announcement</h1>
                <p className='font-medium'>
                    <span className='text-[#72727299]'>Announcement</span>
                    <span className='text-[#72727299] px-2'>/</span>
                    Add New Announcement</p>
            </div>

            <form onSubmit={handleSubmit} className='bg-white rounded-2xl space-y-5 p-10'>
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        value={announcementTitle}
                        onChange={(e) => dispatch(setAnnouncementTitle(e.target.value))}
                        className=""
                        required
                    />
                </div>
                <div>
                    <Label>Announcement</Label>
                    <Textarea
                        value={announcement}
                        onChange={(e) => dispatch(setAnnouncement(e.target.value))}
                        className=""
                        required
                    />
                </div>
                <div>
                    <Label>Date</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant="outline"
                                className={`w-full bg-white border border-gray-300 rounded-lg px-5 py-3 transition-colors duration-200 justify-between mt-2 ${announcementDate ? "text-gray-800" : "text-gray-400"
                                    }`}
                            >
                                {announcementDate
                                    ? new Date(announcementDate).toLocaleDateString()
                                    : "Select date"}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400" />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            className="w-72 overflow-hidden p-2 bg-white border border-gray-300 rounded-3xl shadow-lg"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={announcementDate ? new Date(announcementDate) : undefined}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    if (!date) {
                                        dispatch(setAnnouncementDate(null));
                                        return;
                                    }
                                    dispatch(setAnnouncementDate(date));
                                    setOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-3 pt-3">
                    <Link href="/admin/announcements">
                        <Button
                            variant="outline"
                            className="px-6 border-[#636F85] text-[#636F85]"
                        >
                            Cancel
                        </Button>
                    </Link>

                    <Button
                        type="submit"
                        disabled={isButtonDisabled}
                        className={`px-6 text-white font-medium transition-all duration-300 ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"}`}
                    >
                        {
                            (isLoading) ?
                                <div className="flex justify-center items-center gap-2">
                                    Saving...
                                    <div className="animate-spin">
                                        <PiSpinner className="h-4 w-4" />
                                    </div>
                                </div> :
                                "Save & Continue"
                        }
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddNewAnnouncement;