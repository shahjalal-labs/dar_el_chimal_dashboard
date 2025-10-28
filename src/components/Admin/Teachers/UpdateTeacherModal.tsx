"use client";

import React, { useRef } from 'react';
import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MdOutlineDataset } from 'react-icons/md';
import { RiGraduationCapLine } from 'react-icons/ri';
import General from './AddNewTeacher/General';
import { SyncLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { setActiveBookTab } from '@/redux/features/uiSlice';
import { useGetTeacherDetailsQuery } from '@/redux/api/teacher';
import UpdateGradeSection from './UpdateGradeSection';

const UpdateTeacherModal = ({ id }: { id: string }) => {
    const dispatch = useDispatch();
    const closeRef = useRef<HTMLButtonElement>(null);
    const tab = useSelector((state: RootState) => state.ui.activeBookTab);

    const { data, isLoading } = useGetTeacherDetailsQuery(id);

    const handleTabChange = (value: string) => {
        dispatch(setActiveBookTab(value as "general" | "resources" | "grade"));
    };

    if (isLoading) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-[#1E3A8A]">Data is Loading</span>
                    <SyncLoader color='#1E3A8A' />
                </div>
            </DialogContent>
        );
    }

    if (!data?.result) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <p className="text-center text-gray-700">No data found!</p>
            </DialogContent>
        );
    }
    return (
        <DialogContent className='overflow-y-auto overflow-x-hidden max-h-[75%] max-w-[90%] p-6' showCloseButton>
            <DialogClose ref={closeRef} className="hidden" />
            <h1 className='font-bold text-2xl'>Edit Teacher: {data?.result?.fullName || ""}</h1>

            <div className="bg-white rounded-xl">
                <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="flex gap-2 border-b border-gray-200 pb-2 mb-4">
                        <TabsTrigger
                            value="general"
                            className={`px-4 py-2 rounded-md text-sm font-medium ${tab === "general"
                                ? "bg-[#F8F8F8] text-[#1E3A8A]"
                                : "bg-white text-black hover:bg-gray-200"
                                }`}
                        >
                            <MdOutlineDataset /> General
                        </TabsTrigger>

                        <TabsTrigger
                            value="grade"
                            className={`px-4 py-2 rounded-md text-sm font-medium ${tab === "grade"
                                ? "bg-[#F8F8F8] text-[#1E3A8A]"
                                : "bg-white text-black hover:bg-gray-200"
                                }`}
                        >
                            <RiGraduationCapLine /> Grade Mapping
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
                        <General id={id} />
                    </TabsContent>
                    <TabsContent value="grade">
                        <UpdateGradeSection id={id} />
                    </TabsContent>
                </Tabs>
            </div>
        </DialogContent>
    );
};

export default UpdateTeacherModal;