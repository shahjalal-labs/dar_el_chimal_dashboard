'use client';

import React, { useState } from 'react';
import { useGetAllProductsQuery } from '@/redux/api/ecommerce/product';
import Image from 'next/image';
import DataTable from '../Common/DataTable';
import { Button } from '../ui/button';
import Pagination from '../ui/pagination';
import { FaPlus } from 'react-icons/fa';
import { TbCategory } from 'react-icons/tb';

const ManageProduct = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data } = useGetAllProductsQuery(currentPage);

    const formattedData = data?.result?.products?.map((entry: { id: string, imageUrl: string, name: string, description: string, price: number, createdAt: string, updatedAt: string }) => ({
        "Id": entry.id,
        "Product Image": (
            <Image
                src={entry.imageUrl || './placeholder.svg'}
                height={50}
                width={50}
                alt={entry.name}
                className="w-12 h-12 rounded-lg object-cover"
                priority
            />
        ),
        "Product Name": entry.name,
        "Description": entry.description.slice(0, 30) + '...',
        "Price": entry.price,
        "Created At": new Date(entry.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
        "Updated At": new Date(entry.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
    }));

    return (
        <div className=''>
            <DataTable title="All Products" data={formattedData} isButton={true} buttonText='Add Product' icon={<FaPlus />} isButtonTwo={true} buttonTextTwo="View Product Category" iconTwo={<TbCategory />} currentPage={currentPage} />

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

export default ManageProduct;