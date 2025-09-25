'use client';

import React, { useState } from 'react';
import { useGetAllEcommerceBookingsQuery } from '@/redux/api/ecommerce/booking';
import Image from 'next/image';
import user from "@/assets/User.png";
import DataTable from '../Common/DataTable';
import { Button } from '../ui/button';
import Pagination from '../ui/pagination';

const OrderManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data } = useGetAllEcommerceBookingsQuery(currentPage);

    const formattedData = data?.result?.bookings?.map((entry: { id: string, user: { username: string, email: string, avatar: string }, product: { imageUrl: string, name: string }, paymentType: string, deliveryType: string, quantity: number, totalAmount: number, status: string, createdAt: string, updatedAt: string }) => ({
        "Id": entry.id,
        User: (
            <div className="flex items-center gap-3 w-[150px]">
                <Image
                    src={entry.user.avatar || user}
                    height={50}
                    width={50}
                    alt={entry.user.username}
                    className="w-8 h-8 rounded-full object-cover"
                    priority
                />
                <div className="font-medium text-sm">{entry.user.username}</div>
            </div>
        ),
        Product: (
            <div className="flex items-center gap-3 w-[150px]">
                <Image
                    src={entry.product.imageUrl || './placeholder.svg'}
                    height={50}
                    width={50}
                    alt={entry.product.name}
                    className="w-10 h-10 rounded-full object-cover"
                    priority
                />
                <div className="font-medium text-sm">{entry.product.name}</div>
            </div>
        ),
        "Quantity": entry.quantity,
        "Total Amount": entry.totalAmount,
        "Payment Type": entry.paymentType,
        "Delivery Type": entry.deliveryType,
        "Status": (
            <button className={`${entry?.status === 'PENDING' ? 'bg-[#1E3A8A]' : 'bg-green-700'} text-white px-3 py-1.5 rounded-2xl`}>
                {entry.status}
            </button>
        ),
        "Ordered At": new Date(entry.createdAt).toLocaleDateString('en-US', {
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
            <DataTable title="All Orders" data={formattedData} isButton={false} currentPage={currentPage} />

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

export default OrderManagement;