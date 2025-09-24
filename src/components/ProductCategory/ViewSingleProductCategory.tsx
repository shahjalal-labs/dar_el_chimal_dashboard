'use client';

import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { SyncLoader } from 'react-spinners';
import Image from 'next/image';
import { useGetSingleProductCategoryQuery } from '@/redux/api/ecommerce/productCategory';

const ViewSingleProductCategory = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSingleProductCategoryQuery(id);

    if (isLoading) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-[#FF6B00] font-medium">Data is Loading</span>
                    <SyncLoader color="#FF6B00" />
                </div>
            </DialogContent>
        );
    }

    if (!data?.result) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <p className="text-center text-gray-700">No data found!</p>
            </DialogContent>
        );
    }

    const category = data.result;

    return (
        <DialogContent className="min-w-2xs md:min-w-xl lg:min-w-3xl overflow-y-auto max-h-[80vh] p-6" showCloseButton>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{category.name}</DialogTitle>
                <DialogDescription className="text-gray-600">
                    Created on{' '}
                    {new Date(category.createdAt).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </DialogDescription>
            </DialogHeader>

            {/* Category Logo */}
            <div className="w-full mt-4 flex justify-center">
                <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="rounded-full border p-2 object-cover"
                    priority
                />
            </div>

            {/* Category Info */}
            <div className="mt-6 space-y-2">
                <span className="font-semibold">Category Name:</span> {category.name}
            </div>

            {/* Updated Info */}
            <div className="mt-6 border-t pt-4">
                <p>
                    <span className="font-semibold">Last Updated:</span>{' '}
                    {new Date(category.updatedAt).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
        </DialogContent>
    );
};

export default ViewSingleProductCategory;