/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { SyncLoader } from 'react-spinners';
import Image from 'next/image';
import user from "@/assets/User.png";

const BookingList = ({ data }: { data: any }) => {
    const bookings = data || [];

    if (!data) {
        return (
            <div className="flex justify-center items-center p-10 gap-4">
                <span className="text-[#1E3A8A] font-medium">Loading Bookings</span>
                <SyncLoader color="#1E3A8A" />
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="p-10 text-center text-gray-500">
                No bookings found!
            </div>
        );
    }

    return (
        <div className="space-y-4 bg-white p-6 rounded-xl h-fit">
            <h2 className="text-lg font-semibold mb-6">Recent Bookings</h2>
            <div className="space-y-3">
                {bookings?.slice(0, 5).map((booking: any) => (
                    <div
                        key={booking?.id}
                        className="flex justify-between items-center"
                    >
                        <div className="flex items-center gap-3">
                            <Image
                                src={booking?.practiceGround?.images?.[0] || booking?.user?.avatar || booking?.product?.imageUrl || user}
                                alt={booking?.practiceGround?.name || booking?.user?.username || booking?.product?.name}
                                height={100}
                                width={100}
                                className="w-12 h-12 rounded-full object-cover"
                                priority
                            />
                            <span className="font-medium text-gray-800">
                                {booking?.practiceGround?.name || booking?.event?.title || booking?.product?.name}
                            </span>
                        </div>
                        <span
                            className={`px-4 py-1 text-sm font-medium rounded-full ${booking?.status === 'ACTIVE'
                                ? 'bg-green-600 text-white'
                                : 'bg-orange-500 text-white'
                                }`}
                        >
                            {booking?.status === 'ACTIVE' ? 'Active' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingList;
