/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { SyncLoader } from 'react-spinners';

const TransactionList = ({ data }: { data: any }) => {
    if (!data) {
        return (
            <div className="flex justify-center items-center p-10 gap-4">
                <span className="text-[#FF6B00] font-medium">Loading Transactions</span>
                <SyncLoader color="#FF6B00" />
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="p-10 text-center text-gray-500">
                No transactions found!
            </div>
        );
    }

    return (
        <div className="space-y-4 bg-white p-6 rounded-xl h-fit">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <div className="">
                {data.slice(0, 5).map((tx: any) => (
                    <div
                        key={tx.transactionId}
                        className="flex justify-between items-center border-b border-gray-200 py-2"
                    >
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-800">
                                {tx.businessCategory}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="font-medium text-gray-800">
                                {tx.currency} {tx.amount}
                            </span>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${tx.status === 'PAYOUT_SUCCESS'
                                    ? 'bg-green-600 text-white'
                                    : tx.status === 'PAYOUT_PROCESSING'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-400 text-white'
                                }`}>
                                {tx.status.replace('_', ' ')}
                            </span>
                            <span className="text-gray-400 text-xs mt-1">
                                {new Date(tx.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionList;