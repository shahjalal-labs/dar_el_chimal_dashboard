/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { GrUpload } from 'react-icons/gr';
import Image from 'next/image';
import { Button } from '../ui/button';
import { PiSpinner } from 'react-icons/pi';
import { SyncLoader } from 'react-spinners';
import { useGetSingleProductCategoryQuery, useUpdateProductCategroyMutation } from '@/redux/api/ecommerce/productCategory';

interface FormState {
    name: string;
    productCategoriesImage: File | null;
}

const UpdateProductCategory = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSingleProductCategoryQuery(id);
    const closeRef = useRef<HTMLButtonElement>(null);
    const [formData, setFormData] = useState<FormState>({
        name: "",
        productCategoriesImage: null,
    });

    useEffect(() => {
        if (data?.result) {
            setFormData({
                name: data.result.name || "",
                productCategoriesImage: data.result.imageUrl,
            });
        }
    }, [data]);

    const [UpdateCategory, { isLoading: isUpdating }] = useUpdateProductCategroyMutation();

    const handleChange = (value: string, field: keyof FormState) => {
        setFormData((prev) => ({ ...prev, [field]: value as any }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                productCategoriesImage: e.target.files![0]
            }));
        }
    };

    const removeLogo = () => {
        setFormData((prev) => ({
            ...prev,
            productCategoriesImage: null,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.warning("Title is required");
            return;
        }

        const payload = { name: formData.name };
        const categoryData = new FormData();
        categoryData.append('bodyData', JSON.stringify(payload));

        if (formData.productCategoriesImage) {
            categoryData.append('productCategoriesImage', formData.productCategoriesImage);
        }

        try {
            const response = await UpdateCategory({ id, categoryData }).unwrap();
            if (response.success) {
                toast.success(response.message);
                closeRef.current?.click();
            }
        } catch (err) {
            toast.warning((err as any)?.data?.message || "Something went wrong");
        }
    };

    if (isLoading) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-[#1E3A8A]">Data is Loading</span>
                    <SyncLoader color='#1E3A8A' />
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

    return (
        <DialogContent className="min-w-2xs md:min-w-xl lg:min-w-3xl max-h-[80vh] overflow-y-auto p-6" showCloseButton>
            <DialogClose ref={closeRef} className="hidden" />
            <DialogHeader>
                <DialogTitle className="text-xl font-bold">Update Category</DialogTitle>
                <DialogDescription>Fill out the form below to update the category.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Category Name */}
                <div>
                    <Label>Category Name</Label>
                    <Input
                        placeholder="Enter category name"
                        value={formData.name}
                        onChange={(e) => handleChange(e.target.value, "name")}
                        required
                    />
                </div>

                {/* Category Logo */}
                <div>
                    <Label>Category Logo</Label>
                    <label>
                        <div className="border border-dashed rounded-lg p-10 mt-2 flex flex-col items-center gap-2 cursor-pointer">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                            <GrUpload className="h-8 w-8 m-auto text-gray-400" />
                            <span className="text-center text-gray-400">Upload image</span>
                        </div>
                    </label>

                    {formData.productCategoriesImage && (
                        <div className="relative mt-4">
                            <Image
                                src={
                                    typeof formData.productCategoriesImage === 'string'
                                        ? formData.productCategoriesImage
                                        : formData.productCategoriesImage
                                            ? URL.createObjectURL(formData.productCategoriesImage)
                                            : ''
                                }
                                height={100}
                                width={100}
                                alt="event"
                                className="w-full h-full object-cover rounded"
                                priority
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 text-xs px-2 py-1"
                                onClick={removeLogo}
                            >
                                X
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdating} className='w-fit bg-[#1E3A8A] hover:bg-[#1E3A8ACC]'>
                        {
                            isUpdating ?
                                <div className="flex justify-center items-center gap-2">
                                    Updating...
                                    <div className="animate-spin">
                                        <PiSpinner className="h-4 w-4" />
                                    </div>
                                </div> :
                                <span>Update Category</span>
                        }
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default UpdateProductCategory;