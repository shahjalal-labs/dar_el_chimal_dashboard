/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import uploadImg from '@/assets/uploadImg.svg';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { RxCross1 } from 'react-icons/rx';
import { PiSpinner } from 'react-icons/pi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateBookCategoryMutation } from '@/redux/api/bookCategory';
import { Button } from '@/components/ui/button';

interface FormDataType {
    categoryName: string;
    description: string;
    uploadImage: File | null;
}

const NewBookCategory = () => {
    const route = useRouter();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormDataType>({
        categoryName: '',
        description: '',
        uploadImage: null,
    });

    const [CreateCategory, { isLoading }] = useCreateBookCategoryMutation();

    useEffect(() => {
        if (formData.uploadImage) {
            const url = URL.createObjectURL(formData.uploadImage);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl(null);
    }, [formData.uploadImage]);

    const updateChange = (field: keyof FormDataType, value: string | File | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formData.categoryName,
            description: formData.description,
        };

        const body = new FormData();
        body.append('bodyData', JSON.stringify(payload));
        if (formData.uploadImage) {
            body.append('file', formData.uploadImage);
        }

        try {
            const response = await CreateCategory(body).unwrap();
            if (response.success) {
                toast.success(response.message);
                route.push('/admin/book-categories');
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    };

    return (
        <div>
            {/* Header */}
            <div className='mb-10'>
                <h1 className='text-2xl font-bold mb-3'>New Book Category</h1>
                <p className='font-medium'>
                    <span className='text-[#72727299]'>Book Management</span>
                    <span className='text-[#72727299] px-2'>/</span>
                    <span className='text-[#72727299]'>Book Categories</span>
                    <span className='text-[#72727299] px-2'>/</span>
                    New Book Category</p>
            </div>

            {/* Form */}
            <div className='text-[#F9FAFB] bg-white rounded-xl p-6'>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Book Category Name */}
                    <div>
                        <Label className='text-[#30373D] font-medium mb-2.5'>Book Category Name</Label>
                        <Input
                            id='categoryName'
                            type='text'
                            placeholder=''
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
                            placeholder=''
                            value={formData.description}
                            onChange={(e) => updateChange('description', e.target.value)}
                            className='border border-[#CBD5E1] text-black mb-4'
                            required
                        />
                    </div>

                    {/* Upload Image */}
                    <div>
                        <Label className='text-[#30373D] font-medium mb-2.5'>Upload Picture<span className='text-red-600'>*</span></Label>
                        {!previewUrl ? (
                            <label htmlFor='uploadImage'>
                                <div className='border border-dashed border-[#CBD5E1] rounded-lg px-6 py-8 w-full cursor-pointer'>
                                    <input
                                        id='uploadImage'
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            updateChange('uploadImage', file);
                                        }}
                                        className='hidden'
                                        required
                                    />
                                    <div className='flex flex-col items-center gap-2'>
                                        <Image src={uploadImg} height={40} width={40} alt="Upload" className="w-10 mx-auto" priority />
                                        <p className='text-[#636F85] text-center mt-1'>Drag and drop or <span className='text-[#2A66FF] underline'>browse</span></p>
                                    </div>
                                </div>
                            </label>
                        ) : (
                            <div className="flex justify-center relative w-fit mx-auto group">
                                {/* Delete icon */}
                                <div onClick={() => updateChange('uploadImage', null)} className="bg-[#bdbfc4]/60 rounded-full p-2 h-fit w-fit absolute z-20 top-2 right-2 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                                    <RxCross1 className="h-3 w-3" />
                                </div>

                                {/* Preview image */}
                                <Image
                                    src={previewUrl || '/placeholder.svg'}
                                    height={200}
                                    width={300}
                                    alt="Image Preview"
                                    className="w-full h-[200px] object-cover rounded-md"
                                    priority
                                />
                            </div>
                        )}
                    </div>

                    <div className='flex justify-center items-center gap-4'>
                        <Link href='/admin/book-categories'>
                            <Button className='font-medium text-[#636F85] border border-[#B8B8B8] rounded-xl hover:bg-[#B8B8B8] transition-all ease-in-out duration-500 cursor-pointer px-4 py-2.5'>Cancel</Button>
                        </Link>

                        {/* Submit Button */}
                        <Button
                            type='submit'
                            className='bg-[#1E3A8A] hover:bg-[#1E3A8A80] rounded-lg px-4 py-3 text-white font-bold flex justify-center items-center gap-2 transition-colors duration-500 cursor-pointer'
                        >
                            {
                                isLoading ?
                                    <div className="flex justify-center items-center gap-2">
                                        Saving...
                                        <div className="animate-spin">
                                            <PiSpinner className="h-4 w-4" />
                                        </div>
                                    </div> :
                                    "Save Category"
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewBookCategory;