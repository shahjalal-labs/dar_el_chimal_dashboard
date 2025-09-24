'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import Pagination from '../ui/pagination';
import DataTable from '../Common/DataTable';
import Image from 'next/image';
import user from "@/assets/User.png";
import { useGetAllEventBookingsQuery } from '@/redux/api/eventOrganizer/booking';

const ManageBooking = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data } = useGetAllEventBookingsQuery(currentPage);

    const formattedData = data?.result?.bookings?.map((entry: { id: string, user: { username: string, email: string, avatar: string }, event: { title: string, date: string }, ticketType: string, ticketCount: number, totalAmount: number, status: string, createdAt: string, updatedAt: string }) => ({
        "Id": entry.id,
        User: (
            <div className="flex items-center gap-3">
                <Image
                    src={entry.user.avatar || user}
                    height={50}
                    width={50}
                    alt={entry.user.username}
                    className="w-8 h-8 rounded-full object-cover"
                    priority
                />
                <div>
                    <div className="font-medium text-sm">{entry.user.username}</div>
                    <div className="text-xs text-muted-foreground">{entry.user.email}</div>
                </div>
            </div>
        ),
        "Event Name": entry.event.title,
        "Event Date": new Date(entry.event.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
        "Ticket Type": entry.ticketType,
        "Total Tickets": entry.ticketCount,
        "Total Amount": entry.totalAmount,
        "Status": (
            <button className={`${entry?.status === 'PENDING' ? 'bg-[#FF6B00]' : 'bg-green-700'} text-white px-3 py-1.5 rounded-2xl`}>
                {entry.status}
            </button>
        ),
        "Booked At": new Date(entry.createdAt).toLocaleDateString('en-US', {
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
            <DataTable title="All Booked Events" data={formattedData} isButton={false} buttonText="" currentPage={currentPage} />

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

export default ManageBooking;