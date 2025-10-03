"use client";

import React, { useState } from 'react';
import DataTable from '@/components/Common/DataTable';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import defaultImg from '@/assets/no-img.jpg'
import { useGetAllBooksQuery } from '@/redux/api/admin/book';
import { FaPlus } from 'react-icons/fa';

const Books = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data } = useGetAllBooksQuery(currentPage);

    const formattedData = data?.result?.result?.map(
        (entry: { id: string, coverImg: string, bookName: string, description: string, createdAt: string, updatedAt: string, category: { name: string } }) => ({
            "Id": entry.id,
            "Picture": (
                <Image
                    src={entry.coverImg || defaultImg}
                    height={50}
                    width={50}
                    alt={entry.bookName}
                    className="w-8 h-8 rounded-lg object-cover"
                    priority
                />
            ),
            "Book Name": entry.bookName,
            "Description": entry.description,
            "Category": entry.category.name,
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
            <div className='flex justify-between items-center mb-10'>
                <div>
                    <h1 className='text-2xl font-bold mb-3'>Book List</h1>
                    <p className='font-medium'><span className='text-[#72727299]'>Book Management</span><span className='text-[#72727299] px-2'>/</span>Book List</p>
                </div>
                <div>
                    <Button className='bg-transparent text-[#1E3A8A] border border-[#1E3A8A] hover:bg-transparent cursor-pointer'>
                        <FaPlus />
                        Add New Book
                    </Button>
                </div>
            </div>

            <DataTable title="Book Category List" data={formattedData} currentPage={currentPage} />

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

export default Books;