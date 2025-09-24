/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../ui/dialog';
import { SyncLoader } from 'react-spinners';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useGetSingleParentCategoryQuery, useUpdateParentCategroyMutation } from '@/redux/api/admin/parentCategory';
import { PiSpinner } from 'react-icons/pi';
import product from '@/assets/default.png';

const UpdateParentCategory = ({ id }: { id: string }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const { data, isLoading } = useGetSingleParentCategoryQuery(id);
    const [updateParentCategory, { isLoading: isUpdating }] = useUpdateParentCategroyMutation();

    const [formData, setFormData] = useState({
        name: '',
    });

    useEffect(() => {
        if (data?.result) {
            setFormData({
                name: data.result.name,
            });
        }
    }, [data]);

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
                <p className="text-center text-gray-700">No parent category found!</p>
            </DialogContent>
        );
    }

    const parentCategory = data.result;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await updateParentCategory({
                id,
                categoryData: formData,
            }).unwrap();
            if (response.success) {
                toast.success(response.message);
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update parent category');
        }
    };

    return (
        <DialogContent className="min-w-2xs md:min-w-xl lg:min-w-3xl max-h-[80vh] overflow-y-auto p-6" showCloseButton>
            <DialogClose ref={closeRef} className="hidden" />
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Update Parent Category</DialogTitle>
                <DialogDescription className="text-gray-600">
                    Created on{' '}
                    {new Date(parentCategory.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </DialogDescription>
            </DialogHeader>

            {/* Update Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter category name"
                        required
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="submit" disabled={isUpdating} className="w-fit bg-[#FF6B00] hover:bg-[#FF6B00CC]">
                        {isUpdating ? (
                            <div className="flex justify-center items-center gap-2">
                                Updating...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div>
                        ) : (
                            <span>Update Parent Category</span>
                        )}
                    </Button>
                </div>
            </form>

            {/* Show sub-categories */}
            {parentCategory.categories && parentCategory.categories.length > 0 && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold mb-2">Sub Categories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {parentCategory.categories.map((cat: any) => (
                            <div key={cat.id} className="border rounded-lg overflow-hidden shadow-sm">
                                <Image
                                    src={cat.imageUrl || product}
                                    alt={cat.name || "Image"}
                                    width={200}
                                    height={120}
                                    className="w-full h-28 object-cover"
                                    priority
                                />
                                <div className="p-2">
                                    <p className="text-sm font-medium">{cat.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </DialogContent>
    );
};

export default UpdateParentCategory;