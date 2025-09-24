'use client';

import React, { useState } from 'react';
import { useGetAllPlayGroundBookingQuery } from '@/redux/api/playground/booking';
import Image from 'next/image';
import DataTable from '../Common/DataTable';
import { Button } from '../ui/button';
import Pagination from '../ui/pagination';
import user from '@/assets/User.png';

const PlaygroundBooking = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data } = useGetAllPlayGroundBookingQuery(currentPage);

    const formattedData = data?.result?.bookings?.map((entry:
        {
            id: string,
            user: { username: string, email: string, avatar: string },
            practiceGround: { name: string, location: { address: string } },
            date: string,
            startTime: string,
            endTime: string,
            bookingType: string,
            groupSize: number,
            groundRentPrice: number,
            equipmentRentPrice: number,
            status: string,
            createdAt: string,
            updatedAt: string
        }) => ({
            "Id": entry.id,
            User: (
                <div className="flex items-center gap-3 w-[220px]">
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
            "Ground Name": entry.practiceGround.name,
            "Ground Location": entry.practiceGround.location.address.slice(0, 20) + "...",
            "Event Date": new Date(entry.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            "Duration": entry.startTime + ' - ' + entry.endTime,
            "Booking Type": entry.bookingType,
            "Group Size": entry.groupSize,
            "Ground Rent": entry.groundRentPrice,
            "Equipment Rent": entry.equipmentRentPrice,
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
                minute: '2-digit'
            }),
            "Updated At": new Date(entry.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
        }));

    return (
        <div className=''>
            <DataTable title="Booked Playgrounds" data={formattedData} isButton={false} buttonText="" currentPage={currentPage} />

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

export default PlaygroundBooking;