/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useGetSingleBookQuery } from '@/redux/api/admin/book';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SyncLoader } from 'react-spinners';

const BookOverview = () => {
    const { id } = useParams();
    const router = useRouter();
    const { data, isLoading } = useGetSingleBookQuery(id);
    const book = data?.result;
    const [tab, setTab] = useState('general');

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 gap-3">
                <span className="text-[#1E3A8A] font-medium">Loading book data...</span>
                <SyncLoader color="#1E3A8A" />
            </div>
        );
    }

    if (!book) {
        return (
            <div className="text-center text-gray-600 mt-10">
                <p>No book data found.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Book Overview</h1>
                <p className="font-medium text-sm">
                    <span className="text-[#72727299]">Book Management</span>
                    <span className="text-[#72727299] px-2">/</span>
                    <span className="text-[#72727299]">Book List</span>
                    <span className="text-[#72727299] px-2">/</span>
                    Book Overview
                </p>
            </div>

            {/* Tabs */}
            <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="flex gap-2 border-b border-gray-200 pb-2 mb-4">
                    <TabsTrigger
                        value="general"
                        className={`px-4 py-2 rounded-md text-sm font-medium ${tab === 'general'
                                ? 'bg-[#1E3A8A] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        General
                    </TabsTrigger>
                    <TabsTrigger
                        value="resources"
                        className={`px-4 py-2 rounded-md text-sm font-medium ${tab === 'resources'
                                ? 'bg-[#1E3A8A] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Resources
                    </TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general">
                    <div className="space-y-5">
                        {/* Cover Image */}
                        <div className="w-full">
                            <Image
                                src={book.coverImg}
                                alt={book.bookName}
                                height={300}
                                width={600}
                                className="w-full h-[250px] object-cover rounded-lg border"
                                priority
                            />
                        </div>

                        {/* Book Info */}
                        <div>
                            <h2 className="text-xl font-bold">{book.bookName}</h2>
                            <p className="text-gray-600">{book.category?.name}</p>
                        </div>

                        {/* Book Meta */}
                        <div className="bg-[#F8FAFC] rounded-xl p-4 w-full max-w-md text-sm border">
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-700">Author:</span>
                                <span>{book.author}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-700">Category:</span>
                                <span>{book.category?.name}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-700">ISBN:</span>
                                <span>{book.ISBN}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-700">Created At:</span>
                                <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Separator className="my-3" />
                            <h3 className="font-semibold mb-1">Description</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {book.description}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-3">
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                className="px-6 border-gray-400 text-gray-700"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={() => window.open(book.file, '_blank')}
                                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white px-6"
                            >
                                Open Book
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources">
                    {book.Resources?.length > 0 ? (
                        <div className="space-y-3">
                            {book.Resources.map((res: any) => (
                                <div
                                    key={res.id}
                                    className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition"
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            {res.title}
                                        </h4>
                                        <p className="text-sm text-gray-600">{res.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Uploaded by: {res.uploderName}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => window.open(res.file, '_blank')}
                                        className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-white px-4 py-2"
                                    >
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-sm">No resources available.</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BookOverview;
