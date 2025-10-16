/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RootState } from '@/redux/store/store';
import { ChevronDownIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAnnouncement, setAnnouncementDate } from '@/redux/features/announcementSlice';
import { Textarea } from '@/components/ui/textarea';
import { PiSpinner } from 'react-icons/pi';
import { useGetSingleAnnouncementQuery, useUpdateAnnouncementMutation } from '@/redux/api/announcement';
import { toast } from 'sonner';

const UpdateAnnouncement = ({ id }: { id: string }) => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { announcementTitle, announcement, announcementDate } = useSelector((state: RootState) => state.announcement);

    const { data } = useGetSingleAnnouncementQuery(id);

    useEffect(() => {
        if (data?.result) {
            dispatch(setAnnouncement(data?.result?.anouncement))
            dispatch(setAnnouncementDate(data?.result?.postdate))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const [UpdateAnnouncement, { isLoading }] = useUpdateAnnouncementMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body =
        {
            title: announcementTitle,
            anouncement: announcement,
            postdate: announcementDate
        }
        try {
            const response = await UpdateAnnouncement({ id, body }).unwrap();
            if (response.success) {
                toast.success(response.message);
            }
        }
        catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    }

    const isButtonDisabled =
        !announcement || !announcementDate;

    return (
        <DialogContent className='p-6 space-y-5'>
            <h1 className='text-2xl font-bold'>Edit Announcement</h1>

            <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                    <Label>Date</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
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
                <div>
                    <Label>Announcement</Label>
                    <Textarea
                        value={announcement}
                        onChange={(e) => dispatch(setAnnouncement(e.target.value))}
                        className=""
                        required
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-3 pt-3">
                    <Button
                        variant="outline"
                        className="px-6 border-[#636F85] text-[#636F85]"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={isButtonDisabled}
                        className={`px-6 text-white font-medium border border-[#1E3A8A] transition-all duration-300 ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"}`}
                    >
                        {
                            (isLoading) ?
                                <div className="flex justify-center items-center gap-2">
                                    Saving...
                                    <div className="animate-spin">
                                        <PiSpinner className="h-4 w-4" />
                                    </div>
                                </div> :
                                "Save Announcements"
                        }
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default UpdateAnnouncement;