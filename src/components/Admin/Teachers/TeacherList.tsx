"use client";

import React, { useState } from 'react';
import DataTable from '@/components/Common/DataTable';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/ui/pagination';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import defaultImg from '@/assets/no-img.jpg';
import { useGetAllTeachersQuery } from '@/redux/api/admin/teacher';

const TeacherList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data } = useGetAllTeachersQuery({ currentPage, limit: 10 });

    const formattedData = data?.result?.result?.map(
        (entry: { id: string, profileImage: string, fullName: string, email: string, gender: string, DOB: string, phone: string, status: string, joinedAt: string, updatedAt: string }) => ({
            "Id": entry.id,
            "Profile Image": (
                <Image
                    src={entry.profileImage || defaultImg}
                    height={50}
                    width={50}
                    alt={entry.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                    priority
                />
            ),
            "Name": entry.fullName,
            "Email": entry.email,
            "Gender": entry.gender,
            "Date of Birth": entry.DOB,
            "Phone Number": entry.phone,
            "Status": entry.status,
            "Joined At": new Date(entry.joinedAt).toLocaleString('en-US', {
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
                    <h1 className='text-2xl font-bold mb-3'>Teachers</h1>
                    <p className='font-medium'><span className='text-[#72727299]'>Library</span><span className='text-[#72727299] px-2'>/</span>Teacher List</p>
                </div>
                <Link href="/admin/teachers/add-new-teacher">
                    <Button className='bg-transparent text-[#1E3A8A] border border-[#1E3A8A] hover:bg-transparent cursor-pointer'>
                        <FaPlus />
                        Create New Teacher
                    </Button>
                </Link>
            </div>

            <DataTable title="Teacher List" data={formattedData} currentPage={currentPage} willSearch={true} />

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

export default TeacherList;