"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import DataTable from '@/components/Common/DataTable';
import Pagination from '@/components/ui/pagination';
import defaultImg from '@/assets/no-img.jpg';
import { useGetAllSchoolsByAdminQuery } from '@/redux/api/admin';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const SchoolList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [limit, setLimit] = useState(10);
    const { data, isLoading } = useGetAllSchoolsByAdminQuery({ currentPage, limit, searchTerm });
    console.log("School List Data:", data);

    const formattedData = data?.result?.schools?.map(
        (entry: {
            id: string,
            schoolLogo: string,
            name: string,
            location: string,
            teacherCount: number,
            studentsCount: number,
            createdAt: string,
            updatedAt: string
        }) => ({
            "Id": entry?.id,
            "School": (
                <Image
                    src={entry?.schoolLogo || defaultImg}
                    height={50}
                    width={50}
                    alt={entry?.name || "School Logo"}
                    className="w-8 h-8 rounded-full object-cover"
                    priority
                />
            ),
            "School Name": (
                entry?.name?.length > 30 ?
                    entry?.name?.slice(0, 30) + "..." :
                    entry?.name
            ),
            "Location": (
                entry?.location.length > 30 ?
                    entry?.location.slice(0, 30) + "..." :
                    entry?.location
            ),
            "Total Teachers": entry?.teacherCount,
            "Total Students": entry?.studentsCount,
            "Created At": new Date(entry?.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            "Updated At": new Date(entry?.updatedAt).toLocaleString('en-US', {
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

            <DataTable
                title="School List"
                data={formattedData}
                isLoading={isLoading}
                searchPlaceholder="Search by school name or location"
                currentPage={currentPage}
                willSearch={true}
                setSearchTerm={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                }}
                deleteItem="School"
            />

            <div className='flex flex-col md:flex-row justify-between items-center gap-6 mt-8'>
                <div className='text-base text-[#4A4A4A] flex items-center justify-start gap-2'>
                    <span>Show</span>
                    <Select
                        value={String(limit)}
                        onValueChange={(val) => {
                            setLimit(Number(val));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="h-8 min-w-[3.5rem] w-fit px-2 rounded-md bg-[#1E3A8A1A] text-[#1E3A8A] font-semibold border-none hover:bg-[#1E3A8A26] cursor-pointer flex items-center gap-1 focus:ring-0 focus:ring-offset-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="min-w-[4rem]">
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>from {data?.result?.meta?.total || 0}</span>
                </div>
                <Pagination totalPage={data?.result?.meta?.totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
            </div>
        </div>
    );
};

export default SchoolList;