"use client";

import React, { useState } from 'react';
import DataTable from '@/components/Common/DataTable';
import { useGetAllBookCategoriesQuery } from '@/redux/api/admin/bookCategory';
import Image from 'next/image';
import defaultImg from '@/assets/no-img.jpg';
import Pagination from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';

const BookCategoryList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data } = useGetAllBookCategoriesQuery(currentPage);

    const formattedData = data?.result?.result?.map(
        (entry: { id: string, image: string, name: string, description: string, createdAt: string, updatedAt: string }) => ({
            "Id": entry.id,
            "Picture": (
                <Image
                    src={entry.image || defaultImg}
                    height={50}
                    width={50}
                    alt={entry.name}
                    className="w-8 h-8 rounded-full object-cover"
                    priority
                />
            ),
            "Category Name": entry.name,
            "Description": (
                entry.description.length > 30 ?
                    entry.description.slice(0, 30) + "..." :
                    entry.description
            ),
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
                    <h1 className='text-2xl font-bold mb-3'>Book Categories</h1>
                    <p className='font-medium'><span className='text-[#72727299]'>Book Management</span><span className='text-[#72727299] px-2'>/</span>Book Categories</p>
                </div>
                <Link href="/admin/book-categories/new-book-category">
                    <Button className='bg-transparent text-[#1E3A8A] border border-[#1E3A8A] hover:bg-transparent cursor-pointer'>
                        <FaPlus />
                        Add New Category
                    </Button>
                </Link>
            </div>

            <DataTable title="Book Category List" data={formattedData} currentPage={currentPage} willSearch={true} />

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
                <Pagination totalPage={data?.result?.meta?.totalPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
            </div>
        </div>
    );
};

export default BookCategoryList;