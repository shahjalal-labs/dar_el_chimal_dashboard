/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../ui/dialog';
import { SyncLoader } from 'react-spinners';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useGetSingleSubCategoryQuery, useUpdateSubCategroyMutation } from '@/redux/api/admin/subCategory';
import { PiSpinner } from 'react-icons/pi';

const UpdateSubCategory = ({ id }: { id: string }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const { data, isLoading } = useGetSingleSubCategoryQuery(id);
    const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategroyMutation();

    const [formData, setFormData] = useState({
        name: '',
        parentCategoryId: '',
    });

    useEffect(() => {
        if (data?.result) {
            setFormData({
                name: data.result.name,
                parentCategoryId: data.result.parentCategoryId,
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
                <p className="text-center text-gray-700">No sub category found!</p>
            </DialogContent>
        );
    }

    const subCategory = data.result;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await updateSubCategory({
                id,
                categoryData: formData,
            }).unwrap();
            if (response.success) {
                toast.success(response.message);
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update sub category');
        }
    };

    return (
        <DialogContent className="min-w-2xs md:min-w-lg lg:min-w-xl max-h-[80vh] overflow-y-auto p-6" showCloseButton>
            <DialogClose ref={closeRef} className="hidden" />
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Update Sub Category</DialogTitle>
                <DialogDescription className="text-gray-600">
                    Created on{' '}
                    {new Date(subCategory.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </DialogDescription>
            </DialogHeader>

            {/* Update Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                    <Label htmlFor="name">Sub Category Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter sub category name"
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
                            <span>Update Sub Category</span>
                        )}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default UpdateSubCategory;