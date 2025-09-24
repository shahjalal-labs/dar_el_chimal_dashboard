/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, Dialog } from '../ui/dialog';
import { SyncLoader } from 'react-spinners';
import Image from 'next/image';
import { useGetSingleParentCategoryQuery } from '@/redux/api/admin/parentCategory';
import product from '@/assets/default.png';
import { FaEdit, FaPlus } from 'react-icons/fa';
import UpdateSubCategory from '../SubCategory/UpdateSubCategory';
import AddSubCategory from '../SubCategory/AddSubCategory';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'sonner';
import { useDeleteSubCategroyMutation } from '@/redux/api/admin/subCategory';
import { PiSpinner } from 'react-icons/pi';

const ViewParentCategory = ({ id }: { id: string }) => {
    const [selectedId, setSelectedId] = useState('');

    const { data, isLoading } = useGetSingleParentCategoryQuery(id);
    const [DeleteSubCategroy, { isLoading: isSubCategroyDeleting }] = useDeleteSubCategroyMutation();

    const handleDelete = async (id: string) => {
        try {
            const response = await DeleteSubCategroy(id).unwrap();
            if (response.success) {
                toast.success(response.message)
            }
        } catch (err) {
            toast.warning((err as any)?.data?.message || "Something went wrong");
        }
    }

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
                <p className="text-center text-gray-700">No parent category data found!</p>
            </DialogContent>
        );
    }

    const parent = data.result;

    return (
        <DialogContent className="min-w-2xs md:min-w-xl lg:min-w-3xl overflow-y-auto max-h-[80vh] p-6" showCloseButton>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{parent.name}</DialogTitle>
                <DialogDescription className="text-gray-600">
                    <div>
                        Created on{' '}
                        {new Date(parent.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </div>
                </DialogDescription>
            </DialogHeader>

            {/* Subcategories List */}
            <div className="mt-6">
                <div className='md:flex justify-between items-center mb-4'>
                    <h3 className="font-semibold text-lg mb-4">All Sub Categories</h3>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button
                                className="flex justify-center items-center rounded-lg gap-1 px-4 py-2 transition-colors ease-in-out duration-500 cursor-pointer bg-[#FF6B00] hover:bg-[#FF6B0080] text-white"
                            >
                                <FaPlus />
                                Add Sub Category
                            </button>
                        </DialogTrigger>
                        {
                            id &&
                            (<AddSubCategory id={id} />)
                        }
                    </Dialog>
                </div>
                {parent.categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {parent.categories.map((cat: any) => (
                            <div key={cat.id} className="border rounded-lg p-3 shadow-sm">
                                <div className='flex flex-col items-center'>
                                    <Image
                                        src={cat.imageUrl || product}
                                        alt={cat.name || "Image"}
                                        width={200}
                                        height={150}
                                        className="w-full h-32 object-cover rounded-md mb-2"
                                        priority
                                    />
                                </div>
                                <div className='flex justify-between items-end'>
                                    <div className='text-start'>
                                        <p className="font-medium">{cat.name}</p>
                                        <p className="text-xs text-gray-500">
                                            Created on{' '}
                                            {new Date(cat.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Updated on{' '}
                                            {new Date(cat.updatedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className='hover:bg-black/50 text-black p-1.5 rounded-lg flex justify-center items-center transition-colors ease-in-out duration-500 cursor-pointer'>
                                                    <FaEdit className='h-4 w-4' />
                                                </button>
                                            </DialogTrigger>
                                            <UpdateSubCategory id={cat?.id} />
                                        </Dialog>
                                        <button
                                            onClick={() => {
                                                setSelectedId(cat?.id)
                                                handleDelete(cat?.id)
                                            }}
                                            className='hover:bg-[#FE4D4F26] text-[#FE4D4F] p-1.5 rounded-lg flex justify-center items-center transition-colors ease-in-out duration-500 cursor-pointer'>
                                            {
                                                (isSubCategroyDeleting && selectedId === cat?.id) ?
                                                    <div className="animate-spin">
                                                        <PiSpinner className="h-4 w-4" />
                                                    </div> :
                                                    <RiDeleteBin6Line className='w-4 h-4' />
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No categories found under this parent category.</p>
                )}
            </div>
        </DialogContent>
    );
};

export default ViewParentCategory;