"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import DataTable from '@/components/Common/DataTable';
import Pagination from '@/components/ui/pagination';
import { useGetAllSchoolsQuery } from '@/redux/api/admin/school';
import defaultImg from '@/assets/no-img.jpg';

const SchoolList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data } = useGetAllSchoolsQuery({ currentPage, limit: 10 });

    const formattedData = data?.result?.schools?.map(
        (entry: { id: string, schoolLogo: string, name: string, location: string, teacherCount: number, studentsCount: number, createdAt: string, updatedAt: string }) => ({
            "Id": entry.id,
            "School": (
                <Image
                    src={entry.schoolLogo || defaultImg}
                    height={50}
                    width={50}
                    alt={entry.name}
                    className="w-8 h-8 rounded-full object-cover"
                    priority
                />
            ),
            "School Name": entry.name,
            "Location": (
                entry.location.length > 30 ?
                    entry.location.slice(0, 30) + "..." :
                    entry.location
            ),
            "Total Teachers": entry.teacherCount,
            "Total Students": entry.studentsCount,
            "Created At": new Date(entry.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            "Updated At": new Date(entry.updatedAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
        }));

    return (
        <div>
            <div className='md:flex justify-between items-center mb-10'>
                <div className='mb-6 md:mb-0'>
                    <h1 className='text-2xl font-bold mb-3'>School</h1>
                    <p className='font-medium'><span className='text-[#72727299]'>Library</span><span className='text-[#72727299] px-2'>/</span>School list</p>
                </div>
                <Link href="/admin/schools/add-new-school">
                    <Button className='bg-transparent text-[#1E3A8A] border border-[#1E3A8A] hover:bg-transparent cursor-pointer'>
                        <FaPlus />
                        Add New School
                    </Button>
                </Link>
            </div>

            <DataTable title="School List" data={formattedData} currentPage={currentPage} willSearch={true} />

            <div className='flex flex-col md:flex-row justify-between items-center gap-6 mt-8'>
                <div className='text-base text-[#4A4A4A] flex items-center justify-start gap-2'>
                    <span>Show</span>
                    <Button
                        variant="default"
                        size="icon"
                        className="h-8 w-8 rounded-none bg-[#1E3A8A1A] text-[#1E3A8A] hover:bg-[#1E3A8A1A]"
                    >
                        {formattedData?.length}
                    </Button>
                    <span>from {data?.result?.meta?.total}</span>
                </div>
                <Pagination totalPage={data?.result?.meta?.totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
            </div>
        </div>
    );
};

export default SchoolList;