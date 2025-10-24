/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PiSpinner } from "react-icons/pi";
import { toast } from "sonner";
import { SyncLoader } from "react-spinners";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import uploadImg from '@/assets/uploadImg.svg';
import { RxCross1 } from "react-icons/rx";
import { useGetSingleBookCategoryQuery, useUpdateBookCategoryMutation } from "@/redux/api/bookCategory";
import { Button } from "@/components/ui/button";

interface FormDataType {
    categoryName: string;
    description: string;
    image: File | null;
}

const UpdateBookCategoryModal = ({ id }: { id: string }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormDataType>({
        categoryName: '',
        description: '',
        image: null,
    });

    const { data, isLoading } = useGetSingleBookCategoryQuery(id);
    const [UpdateCategory, { isLoading: isUpdating }] = useUpdateBookCategoryMutation();

    useEffect(() => {
        if (data?.result) {
            setFormData({
                categoryName: data.result.name || "",
                description: data.result.description || "",
                image: null,
            });

            if (data.result.image) {
                setPreviewUrl(data.result.image);
            }
        }
    }, [data]);

    useEffect(() => {
        if (formData.image) {
            const url = URL.createObjectURL(formData.image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [formData.image]);

    const updateChange = (field: keyof FormDataType, value: string | File | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.categoryName || !formData.description) {
            toast.warning("Please fill all fields.");
            return;
        }

        const payload = {
            name: formData.categoryName,
            description: formData.description,
        };

        const body = new FormData();
        body.append('bodyData', JSON.stringify(payload));

        if (formData.image) {
            body.append('file', formData.image);
        }

        try {
            const response = await UpdateCategory({ id, body }).unwrap();
            if (response.success) {
                toast.success(response.message);
                closeRef.current?.click();
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
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
            <AlertDialogHeader>
                <DialogTitle className="text-xl font-bold">Update Book Category</DialogTitle>
                <DialogDescription>
                    Fill out the form below to update the book category.
                </DialogDescription>
            </AlertDialogHeader>

            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Book Category Name */}
                <div>
                    <Label className='text-[#30373D] font-medium mb-2.5'>Book Category Name</Label>
                    <Input
                        id='categoryName'
                        type='text'
                        value={formData.categoryName}
                        onChange={(e) => updateChange('categoryName', e.target.value)}
                        className='border border-[#CBD5E1] text-black mb-4'
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <Label className='text-[#30373D] font-medium mb-2.5'>Description</Label>
                    <Input
                        id='description'
                        type='text'
                        value={formData.description}
                        onChange={(e) => updateChange('description', e.target.value)}
                        className='border border-[#CBD5E1] text-black mb-4'
                        required
                    />
                </div>

                {/* Upload Image */}
                <div>
                    <Label className='text-[#30373D] font-medium mb-2.5'>Upload Picture</Label>
                    {!previewUrl ? (
                        <label htmlFor='uploadImage'>
                            <div className='border border-dashed border-[#CBD5E1] rounded-lg px-6 py-8 w-full cursor-pointer'>
                                <input
                                    id='uploadImage'
                                    type='file'
                                    accept='image/*'
                                    onChange={(e) => updateChange('image', e.target.files?.[0] ?? null)}
                                    className='hidden'
                                />
                                <div className='flex flex-col items-center gap-2'>
                                    <Image src={uploadImg} height={40} width={40} alt="Upload" priority />
                                    <p className='text-[#636F85] text-center mt-1'>Drag and drop or <span className='text-[#2A66FF] underline'>browse</span></p>
                                </div>
                            </div>
                        </label>
                    ) : (
                        <div className="flex justify-center relative w-fit mx-auto group">
                            <div
                                onClick={() => {
                                    updateChange('image', null);
                                    setPreviewUrl(null);
                                }}
                                className="bg-[#bdbfc4]/60 rounded-full p-2 h-fit w-fit absolute z-20 top-2 right-2 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            >
                                <RxCross1 className="h-3 w-3" />
                            </div>

                            <Image
                                src={previewUrl}
                                height={200}
                                width={300}
                                alt="Image Preview"
                                className="w-full h-[200px] object-cover rounded-md"
                                priority
                            />
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className='flex justify-center items-center gap-4'>
                    <Button onClick={() => closeRef.current?.click()} type="button" className='font-medium text-[#636F85] border border-[#B8B8B8] rounded-xl hover:bg-[#B8B8B8] transition-all duration-500 cursor-pointer px-4 py-2.5'>Cancel</Button>

                    <Button
                        type='submit'
                        className='bg-[#1E3A8A] hover:bg-[#1E3A8A80] rounded-lg px-4 py-3 text-white font-bold flex justify-center items-center gap-2 transition-colors duration-500 cursor-pointer'
                    >
                        {isUpdating ? (
                            <div className="flex justify-center items-center gap-2">
                                Updating...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div>
                        ) : (
                            "Update Category"
                        )}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default UpdateBookCategoryModal;