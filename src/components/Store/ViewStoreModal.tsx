/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useGetSingleStoreQuery } from '@/redux/api/ecommerce/store';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { SyncLoader } from 'react-spinners';
import Image from 'next/image';
import { getCountryName } from '@/lib/utils';

const ViewStoreModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSingleStoreQuery(id);

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

    const store = data.result;

    return (
        <DialogContent className="min-w-2xs md:min-w-xl lg:min-w-3xl overflow-y-auto max-h-[80vh] p-6" showCloseButton>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{store.name}</DialogTitle>
                <DialogDescription className="text-gray-600">
                    {store.location?.address}
                </DialogDescription>
            </DialogHeader>

            {/* Store Banner */}
            <div className="w-full mt-4 rounded-lg overflow-hidden">
                <Image
                    src={store.imageurl}
                    alt={store.name}
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover"
                    priority
                />
            </div>

            {/* Store Details */}
            <div className="mt-6 space-y-2">
                <p><span className="font-semibold">Country:</span> {getCountryName(store.countryCode)}</p>
                <p><span className="font-semibold">Delivery Charge:</span> ${store.deliveryCharge}</p>
                <p><span className="font-semibold">VAT:</span> {store.vat * 100}%</p>
                <p><span className="font-semibold">Created At:</span> {new Date(store.createdAt).toLocaleString()}</p>
            </div>

            {/* Product List */}
            {store.product?.length > 0 && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold mb-3">Products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {store.product.map((prod: any) => (
                            <div key={prod.id} className="border rounded-lg p-4">
                                <Image
                                    src={prod.imageUrl}
                                    alt={prod.name}
                                    width={300}
                                    height={200}
                                    className="w-full h-40 object-cover rounded-md"
                                />
                                <h4 className="mt-2 font-semibold">{prod.name}</h4>
                                <p className="text-gray-600 text-sm">{prod.description}</p>
                                <p className="mt-1 text-xl font-semibold">${prod.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </DialogContent>
    );
};

export default ViewStoreModal;
