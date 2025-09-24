'use client';

import React, { useEffect, useState } from 'react';
import { useGetTopCustomersQuery } from '@/redux/api/playground/stat';
import DataTable from '../Common/DataTable';
import Image from 'next/image';
import user from '@/assets/User.png';
import { useGetEventTopCustomersQuery } from '@/redux/api/eventOrganizer/stat';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { useGetEcommerceTopCustomersQuery } from '@/redux/api/ecommerce/stat';
import { useGetTopVendorsQuery } from '@/redux/api/admin/stat';

const TopCustomersTable = () => {
    const authState = useSelector((state: RootState) => state.auth);
    const [data, setData] = useState([]);

    const { data: eventCustomers } = useGetEventTopCustomersQuery(undefined);
    const { data: groundCustomers } = useGetTopCustomersQuery(undefined);
    const { data: ecommerceCustomers } = useGetEcommerceTopCustomersQuery(undefined);
    const { data: topVendors } = useGetTopVendorsQuery(undefined);

    useEffect(() => {
        if (authState.businessCategory === 'PLAYGROUND' && groundCustomers?.result) {
            setData(groundCustomers?.result)
        }
        if (authState.businessCategory === 'EVENT' && eventCustomers?.result) {
            setData(eventCustomers?.result)
        }
        if (authState.businessCategory === 'E_COMMERCE' && ecommerceCustomers?.result) {
            setData(ecommerceCustomers?.result)
        }
    }, [groundCustomers, eventCustomers, ecommerceCustomers, authState])

    const formattedData = data?.map((entry:
        {
            id: string,
            user: { username: string, email: string, phoneNumber: string, avatar: string },
            totalBookings: number,
            totalSpent: number,
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
                    <div className="font-medium text-sm">{entry.user.username}</div>
                </div>
            ),
            "Email": entry.user.email,
            "Phone Number": entry.user.phoneNumber,
            "Total Bookings": entry.totalBookings,
            "Total Spents": entry.totalSpent,
        }));

    const adminFormattedData = topVendors?.result?.map((entry:
        {
            vendorName: string,
            businessCategory: string,
            address: string,
            totalOrders: number,
            totalRevenue: number,
        }) => ({
            "Vendor Name": entry.vendorName,
            "Business Category": entry.businessCategory,
            "Address": entry.address,
            "Total Orders": entry.totalOrders,
            "Total Revenue": entry.totalRevenue,
        }));

    return (
        <div className='bg-white p-6 rounded-lg min-h-[320px]'>
            <h1 className='text-lg font-semibold'>
                {
                    authState.role === 'ADMIN' ?
                        'Top Vendors' :
                        'Top Customers'
                }
            </h1>
            <DataTable title="" data={authState.role === 'ADMIN' ? adminFormattedData : formattedData} isButton={false} buttonText="" currentPage={1} />
        </div>
    );
};

export default TopCustomersTable;