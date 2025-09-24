'use client';

import React from 'react';
import { useGetTransactionListQuery } from '@/redux/api/admin/stat';
import DataTable from '../Common/DataTable';

const ManageTransactions = () => {
    const { data } = useGetTransactionListQuery(undefined);

    const formattedData = data?.result?.data?.map((entry: {
        amount: number,
        businessCategory: string,
        currency: string,
        status: string,
        createdAt: string,
        transactionId: string
    }) => ({
        "Transaction ID": entry.transactionId,
        "Amount": `${entry.amount} ${entry.currency}`,
        "Business Category": entry.businessCategory,
        "Created At": new Date(entry.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
        "Status": (
            <button
                className={`${entry?.status === 'PAYOUT_PROCESSING' ? 'bg-[#FF6B00]' : 'bg-green-700'} text-white px-3 py-1.5 rounded-2xl`}
            >
                {entry.status}
            </button>
        ),
    }));

    return (
        <DataTable title="All Transactions" data={formattedData} isButton={false} currentPage={1} />
    );
};

export default ManageTransactions;