'use client';

import React, { useState } from 'react';
import { useGetAllAvailableGroundsQuery } from '@/redux/api/playground/ground';
import { Button } from '../ui/button';
import Pagination from '../ui/pagination';
import DataTable from '../Common/DataTable';
import { GoPlus } from "react-icons/go";

const GroundAvailability = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data } = useGetAllAvailableGroundsQuery(currentPage);

    const formattedData = data?.result?.data?.map((entry: { _id: string, category: { name: string }, location: { address: string }, name: string, pricePerHour: number, maxGroupMembers: number, openingStartTime: string, openingEndTime: string, isAvailable: boolean }) => ({
        "Id": entry?._id,
        "Gound Name": entry?.name,
        "Category": entry?.category?.name,
        "Location": entry?.location?.address,
        "Rent Per Hour": entry?.pricePerHour,
        "Max Group Members": entry?.maxGroupMembers,
        "Start Time": entry?.openingStartTime,
        "End Time": entry?.openingEndTime,
        "Availability": entry?.isAvailable ? 'Available' : 'N/A',
    }));

    return (
        <div className=''>
            <DataTable title="Ground Availability" data={formattedData} isButton={true} buttonText="Add Ground" currentPage={currentPage} icon={<GoPlus className='h-6 w-6 text-white' />} />

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

export default GroundAvailability;