'use client';

import React, { useState } from 'react';
import DataTable from '../Common/DataTable';
import { Button } from '../ui/button';
import Pagination from '../ui/pagination';
import Image from 'next/image';
import { FiPlus } from 'react-icons/fi';
import { useGetAllEventsQuery } from '@/redux/api/eventOrganizer/event';
import { RiTeamLine } from 'react-icons/ri';

const ManageEvent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data } = useGetAllEventsQuery(currentPage);

    const formattedData = data?.result?.events?.map((entry: { id: string, category: { name: string }, title: string, date: string, vipTicketsPrice: number, economyTicketsPrice: number, imageUrl: string }) => ({
        "Id": entry.id,
        "Event Name": (
            <div className="flex items-center gap-3">
                <Image
                    src={entry.imageUrl}
                    height={50}
                    width={50}
                    alt={entry.title}
                    className="w-8 h-8 rounded-full object-cover"
                    priority
                />
                <div className="text-xs text-muted-foreground">{entry.title}</div>
            </div>
        ),
        "Sports category": entry.category.name,
        "Event Date": new Date(entry.date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }),
        "VIP Ticket Price": entry.vipTicketsPrice,
        "Economy Ticket Price": entry.economyTicketsPrice,
    }));

    return (
        <div className=''>
            <DataTable title="Manage Event" data={formattedData} isButton={true} isButtonTwo={true} buttonText="Add Event" buttonTextTwo="View Teams" currentPage={currentPage} icon={<FiPlus />} iconTwo={<RiTeamLine />} />

            <div className='flex flex-col md:flex-row justify-between items-center gap-6 mt-8'>
                <div className='text-base text-[#4A4A4A] flex items-center justify-start gap-2'>
                    <span>Show</span>
                    <Button
                        variant="default"
                        size="icon"
                        className="h-8 w-8 rounded-none bg-[#FF6B001A] text-[#FF6B00] hover:bg-[#FF6B001A]"
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

export default ManageEvent;