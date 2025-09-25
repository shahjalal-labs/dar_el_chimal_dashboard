'use client';

import React, { useState } from 'react';
import { useGetAllStoresQuery } from '@/redux/api/ecommerce/store';
import Image from 'next/image';
import user from "@/assets/User.png";
import DataTable from '../Common/DataTable';
import { Button } from '../ui/button';
import Pagination from '../ui/pagination';
import { FaPlus } from 'react-icons/fa';

const ManageOnStore = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data } = useGetAllStoresQuery(currentPage);

    const formattedData = data?.result?.stores?.map((entry: { id: string, imageurl: string, name: string }) => ({
        "Id": entry.id,
        "Store Image": (
            <Image
                src={entry.imageurl || user}
                height={50}
                width={50}
                alt={entry.name}
                className="w-12 h-12 rounded-lg object-cover"
                priority
            />
        ),
        "Store Name": entry.name,
    }));

    return (
        <div className=''>
            <DataTable title="All Stores" data={formattedData} isButton={true} buttonText='Add Store' icon={<FaPlus />} currentPage={currentPage} />

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

export default ManageOnStore;