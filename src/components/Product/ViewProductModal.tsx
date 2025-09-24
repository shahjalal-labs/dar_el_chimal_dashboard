'use client';

import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { SyncLoader } from 'react-spinners';
import Image from 'next/image';
import { useGetSingleProductQuery } from '@/redux/api/ecommerce/product';

const ViewProductModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSingleProductQuery(id);

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
                <p className="text-center text-gray-700">No product data found!</p>
            </DialogContent>
        );
    }

    const product = data.result;

    return (
        <DialogContent className="min-w-2xs md:min-w-xl lg:min-w-3xl overflow-y-auto max-h-[80vh] p-6" showCloseButton>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
                <DialogDescription className="text-gray-600">
                    Created on{' '}
                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </DialogDescription>
            </DialogHeader>

            {/* Product Image */}
            <div className="w-full mt-4 rounded-lg overflow-hidden">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover"
                    priority
                />
            </div>

            {/* Product Details */}
            <div className="mt-6 space-y-2">
                <p className="text-gray-800">{product.description}</p>
                <p><span className="font-semibold">Price:</span> ${product.price}</p>
                <p><span className="font-semibold">For:</span> {product.gender}</p>
            </div>

            {/* QR Code Image */}
            <div className="w-full mt-4 rounded-lg overflow-hidden">
                <Image
                    src={product.qrCodeImageUrl}
                    alt={product.name}
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover"
                    priority
                />
            </div>

            {/* Store Info */}
            {product.stores && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold mb-2">Store Information</h3>
                    <div className="flex items-center gap-4">
                        <Image
                            src={product.stores.imageurl}
                            alt={product.stores.name}
                            width={80}
                            height={80}
                            className="rounded-lg border"
                        />
                        <div>
                            <p><span className="font-semibold">Name:</span> {product.stores.name}</p>
                            <p><span className="font-semibold">Username:</span> {product.stores.username}</p>
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
    );
};

export default ViewProductModal;
