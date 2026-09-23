/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SyncLoader } from 'react-spinners';
import { GoLink } from 'react-icons/go';
import { MdOutlineDataset } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { TfiAngleRight } from 'react-icons/tfi';
import audio from "@/assets/mp.svg";
import video from "@/assets/link.svg";
import pdf from "@/assets/docs.svg";
import Link from 'next/link';
import { useGetSingleBookQuery } from '@/redux/api/book';
import Resource from './Resource';
import { ImageIcon } from 'lucide-react';

const BookOverview = () => {
    const router = useRouter();
    const { id, bookId } = useParams();
    const searchParams = useSearchParams();
    const urlTab = searchParams.get('tab');
    const [tab, setTab] = useState(urlTab === 'resources' ? 'resources' : 'general');
    const [isAddResource, setIsAddResource] = useState(false);

    useEffect(() => {
        if (urlTab === 'resources' || urlTab === 'general') {
            setTab(urlTab);
        }
    }, [urlTab]);

    const { data, isLoading } = useGetSingleBookQuery(bookId);
    const book = data?.result;

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
        <div>
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

            <div className="p-6 bg-white rounded-xl shadow-sm">
                {/* Tabs */}
                <Tabs
                    value={tab}
                    onValueChange={(val) => {
                        setTab(val);
                        router.replace(`/teacher/classes/books/${id}/${bookId}?tab=${val}`, { scroll: false });
                    }}
                    className="w-full"
                >
                    <TabsList className="flex gap-2 border-b border-gray-200 pb-2 mb-4">
                        <TabsTrigger
                            value="general"
                            className={`px-4 py-2 rounded-md text-sm font-medium ${tab === 'general'
                                ? 'bg-[#F8F8F8] text-[#1E3A8A]'
                                : 'bg-white text-black hover:bg-gray-200'
                                }`}
                        >
                            <MdOutlineDataset />General
                        </TabsTrigger>
                        <TabsTrigger
                            value="resources"
                            className={`px-4 py-2 rounded-md text-sm font-medium ${tab === 'resources'
                                ? 'bg-[#F8F8F8] text-[#1E3A8A]'
                                : 'bg-white text-black hover:bg-gray-200'
                                }`}
                        >
                            <GoLink />Resources
                        </TabsTrigger>
                    </TabsList>

                    {/* General Tab */}
                    <TabsContent value="general">
                        <div className="space-y-5">
                            {/* Cover Image */}
                            <div className="w-full">
                                <Image
                                    src={book.coverImg || "https://res.cloudinary.com/dddrm7ep8/image/upload/v1788255470/n2tfqinlzgwpdkittexh.jpg"}
                                    alt={book.bookName}
                                    height={1000}
                                    width={2000}
                                    className="w-full h-full xl:h-[400px] object-cover rounded-lg border"
                                    priority
                                />
                            </div>

                            {/* Book Info */}
                            <div>
                                <h2 className="text-2xl xl:text-3xl font-bold">{book.bookName}</h2>
                                <p className="text-[#4C4C4C] text-xl xl:text-2xl mt-4">{book.category?.name}</p>
                            </div>

                            {/* Book Meta */}
                            <div className='bg-[#F7F9FF] rounded-xl'>
                                <div className="p-6 w-full max-w-sm xl:text-xl">
                                    <div className="flex justify-between py-1">
                                        <span className="font-semibold">Author:</span>
                                        <span className='text-[#636F85]'>{book.author}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="font-semibold">Category:</span>
                                        <span className='text-[#636F85]'>{book.category?.name}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="font-semibold">ISBN:</span>
                                        <span className='text-[#636F85]'>{book.ISBN}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="font-semibold">Created At:</span>
                                        <span className='text-[#636F85]'>{new Date(book.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <Separator className="my-3" />
                                <h3 className="font-semibold text-xl mb-1">Description</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {book.description}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-center items-center gap-3 pt-3">
                                <Button
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="px-6 border-[#636F85] text-[#636F85] font-medium"
                                >
                                    Back
                                </Button>
                                <Link href={`/teacher/classes/books/${id}/${bookId}/pdf?pdfurl=${encodeURIComponent(book?.file || '')}`}>
                                    <Button
                                        className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A] text-white font-medium px-6"
                                    >
                                        Open Book
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Resources Tab */}
                    <TabsContent value="resources">
                        {
                            isAddResource ?
                                <Resource bookId={bookId} setIsAddResource={setIsAddResource} /> :
                                <>
                                    <div className='flex justify-between items-center mb-6'>
                                        <h1 className='font-medium text-xl md:text-2xl text-[#30373D]'>Total Attachments: {book?.Resources?.length || 0}</h1>
                                        <Button
                                            type="button"
                                            onClick={() => setIsAddResource(true)}
                                            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 border border-[#1E3A8A] text-white font-medium px-6 flex items-center gap-2 cursor-pointer shadow-xs">
                                            <FaPlus />Add Resource
                                        </Button>
                                    </div>
                                    {book.Resources?.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {book.Resources.map((res: any) => (
                                                <Link
                                                    key={res.id}
                                                    href={`/teacher/classes/books/${id}/${bookId}/${res?.id}`}
                                                    className="group border border-[#D8D8D880] bg-[#F7F9FFCC] rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition"
                                                >
                                                    <div className='flex items-center gap-4'>
                                                        <div className={`px-2 py-2.5 rounded-lg flex items-center justify-center w-12 h-12 ${
                                                            res.Type === "Pdf"
                                                                ? 'bg-[#FF9A3E1A]'
                                                                : res.Type === "Video"
                                                                ? 'bg-[#56A5781A]'
                                                                : res.Type === "Image"
                                                                ? 'bg-purple-100 text-purple-600'
                                                                : 'bg-[#FF4A4A1A]'
                                                        }`}>
                                                            {res.Type === "Image" ? (
                                                                <ImageIcon className="w-7 h-7 text-purple-600" />
                                                            ) : (
                                                                <Image
                                                                    src={res.Type === "Pdf" ? pdf : res.Type === "Video" ? video : audio}
                                                                    height={32}
                                                                    width={32}
                                                                    alt=''
                                                                    className='w-8 h-8'
                                                                    priority
                                                                />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold md:text-lg group-hover:text-[#1E3A8A] transition">{res.title}</h4>
                                                            <p className="text-[#636F85] text-sm md:text-base">Type: {res.Type || 'Document'}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{new Date(res.createdAt).toLocaleString('en-US')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-[#636F85] group-hover:text-[#1E3A8A] p-2 transition">
                                                        <TfiAngleRight className='w-5 h-5' />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-sm">No resources available.</p>
                                    )}
                                </>
                        }
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default BookOverview;
