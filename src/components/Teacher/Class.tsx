/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { useGetTeacherOverviewQuery } from '@/redux/api/teacher/overviewApi';
import { BiBookReader } from 'react-icons/bi';
import { SlCalender } from 'react-icons/sl';
import { TfiAngleRight } from 'react-icons/tfi';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';

const Class = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: teacherOverviewData } = useGetTeacherOverviewQuery(undefined);

    const filteredData = teacherOverviewData?.result?.grades?.filter((item: any) => {
        if (!searchQuery) return true

        return Object.values(item).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase()))
    })

    return (
        <div className="p-8 rounded-lg bg-[#FFFFFF]">
            {/* My Classes */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">My All Classes</h3>
                <div className="relative w-64 pb-2">
                    <Input
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-8 bg-[#F9F9F9] border-none shadow-none"
                    />
                    <div className="absolute right-3 top-3 text-[#79767B] p-2 rounded-lg">
                        <Search className="h-4 w-4" />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {filteredData?.map((grade: any) => (
                    <Link
                        href={`/teacher/classes/${grade?.id}`}
                        key={grade.id}
                        className="bg-[#F7F9FF] border border-[#D8D8D8] rounded-lg p-5 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                    >
                        <div>
                            <p className="font-medium text-xl">
                                {grade.grade} - Section A
                            </p>
                            <p className="flex items-center gap-2 text-[#4C4C4C] mt-3">
                                <BiBookReader className="text-lg" /> {grade.totalStudents} Student{grade.totalStudents > 1 ? "s" : ""} <SlCalender className="text-lg ml-2" /> {new Date().getFullYear()}
                            </p>
                        </div>
                        <span className="text-[#1C1B1F]"><TfiAngleRight className="w-6 h-6" /></span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Class;