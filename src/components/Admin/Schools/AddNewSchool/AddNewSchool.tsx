"use client";

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MdOutlineDataset } from 'react-icons/md';
import { RiGraduationCapLine } from 'react-icons/ri';
import { TabsContent } from '@radix-ui/react-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveBookTab } from '@/redux/features/uiSlice';
import { RootState } from '@/redux/store/store';
import General from './General';
import Grade from './Grade';

const AddNewSchool = () => {
    const dispatch = useDispatch();
    const tab = useSelector((state: RootState) => state.ui.activeBookTab);

    const handleTabChange = (value: string) => {
        dispatch(setActiveBookTab(value as "general" | "resources" | "grade"));
    }

    return (
        <div>
            {/* Header */}
            <div className='mb-10'>
                <h1 className='text-2xl font-bold mb-3'>Add New School</h1>
                <p className='font-medium'>
                    <span className='text-[#72727299]'>Library</span>
                    <span className='text-[#72727299] px-2'>/</span>
                    Add New School</p>
            </div>

            {/* Form */}
            <div className="p-6 bg-white rounded-xl mt-6">
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

                    {/* ---------- TAB CONTENTS ---------- */}
                    <TabsContent value="general">
                        <General />
                    </TabsContent>
                    <TabsContent value="grade">
                        <Grade />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AddNewSchool;