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
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { useGetSingleProductQuery, useUpdateProductMutation } from '@/redux/api/ecommerce/product';
import { SyncLoader } from 'react-spinners';
import { useGetAllSubCategoriesQuery } from '@/redux/api/admin/subCategory';
import { useGetAllStoresQuery } from '@/redux/api/ecommerce/store';
import { useGetAllProductCategoriesQuery } from '@/redux/api/ecommerce/productCategory';

interface FormState {
    name: string;
    description: string;
    categoryId: string;
    storesId: string;
    productCategoryId: string;
    price: string;
    gender: string;
    productImage: File | null;
}

const genderOptions = ["MALE", "FEMALE", "OTHER"];

const UpdateProductModal = ({ id }: { id: string }) => {
    const closeRef = useRef<HTMLButtonElement>(null);

    const { data, isLoading } = useGetSingleProductQuery(id);
    const { data: categoryData } = useGetAllSubCategoriesQuery(undefined);
    const { data: storeData } = useGetAllStoresQuery(undefined);
    const { data: productData } = useGetAllProductCategoriesQuery(undefined);

    const [formData, setFormData] = useState<FormState>({
        name: '',
        description: '',
        categoryId: '',
        storesId: '',
        productCategoryId: '',
        price: '',
        gender: '',
        productImage: null,
    });

    const [UpdateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const categories = categoryData?.result?.map((category: any) => ({
        id: category.id,
        name: category.name,
    }));

    const stores = storeData?.result?.stores?.map((store: any) => ({
        id: store.id,
        name: store.name,
    }));

    const productCategories = productData?.result?.categories?.map((productCategory: any) => ({
        id: productCategory.id,
        name: productCategory.name,
    }));

    useEffect(() => {
        if (data?.result) {
            setFormData({
                name: data.result.name,
                description: data.result.description,
                price: data.result.price,
                gender: data.result.gender,
                categoryId: data.result.categoryId,
                storesId: data.result.storesId,
                productCategoryId: data.result.productCategoryId,
                productImage: data.result.imageUrl,
            });
        }
    }, [data]);

    const handleChange = (value: string, field: keyof FormState) => {
        setFormData(prev => ({ ...prev, [field]: value as any }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData(prev => ({ ...prev, productImage: e.target.files![0] }));
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, productImage: null }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.warning('Product name is required');
            return;
        }

        const payload = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            gender: formData.gender,
            categoryId: formData.categoryId,
            storesId: formData.storesId,
            productCategoryId: formData.productCategoryId
        };

        const productData = new FormData();
        productData.append('bodyData', JSON.stringify(payload));

        if (formData.productImage) {
            productData.append('productImage', formData.productImage);
        }

        try {
            const response = await UpdateProduct({ id, productData }).unwrap();
            if (response.success) {
                toast.success(response.message);
                closeRef.current?.click();
            }
        } catch (err) {
            toast.warning((err as any)?.data?.message || 'Something went wrong');
        }
    };

    if (isLoading) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-[#FF6B00]">Data is Loading</span>
                    <SyncLoader color='#FF6B00' />
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
                <DialogTitle className="text-xl font-bold">Update Product</DialogTitle>
                <DialogDescription>Modify the fields below to update the product.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Product Name */}
                <div>
                    <Label>Product Name</Label>
                    <Input
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={e => handleChange(e.target.value, 'name')}
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <Input
                        placeholder="Enter product description"
                        value={formData.description}
                        onChange={e => handleChange(e.target.value, 'description')}
                        required
                    />
                </div>

                {/* Sports Category */}
                <div>
                    <Label>Select Sports Category</Label>
                    <select
                        value={formData.categoryId}
                        onChange={(e) => handleChange(e.target.value, "categoryId")}
                        className="border border-[#d9d0d0] bg-white rounded-lg px-4 py-2.5 w-full mt-2"
                        required
                    >
                        {
                            categories?.map((category: any, idx: number) => (
                                <option value={category?.id} key={idx}>{category?.name}</option>
                            ))
                        }
                    </select>
                </div>

                {/* Store */}
                <div>
                    <Label>Select Store</Label>
                    <select
                        value={formData.storesId}
                        onChange={(e) => handleChange(e.target.value, "storesId")}
                        className="border border-[#d9d0d0] bg-white rounded-lg px-4 py-2.5 w-full mt-2"
                        required
                    >
                        {
                            stores?.map((store: any, idx: number) => (
                                <option value={store?.id} key={idx}>{store?.name}</option>
                            ))
                        }
                    </select>
                </div>

                {/* Product Category */}
                <div>
                    <Label>Select Product Category</Label>
                    <select
                        value={formData.productCategoryId}
                        onChange={(e) => handleChange(e.target.value, "productCategoryId")}
                        className="border border-[#d9d0d0] bg-white rounded-lg px-4 py-2.5 w-full mt-2"
                        required
                    >
                        {
                            productCategories?.map((productCategory: any, idx: number) => (
                                <option value={productCategory?.id} key={idx}>{productCategory?.name}</option>
                            ))
                        }
                    </select>
                </div>

                {/* Price */}
                <div>
                    <Label>Price</Label>
                    <Input
                        type="number"
                        placeholder="Enter price"
                        value={formData.price}
                        onChange={e => handleChange(e.target.value, 'price')}
                        required
                    />
                </div>

                {/* Gender */}
                <div>
                    <Label>Gender</Label>
                    <Select
                        value={formData.gender}
                        onValueChange={(value) => handleChange(value, 'gender')}
                    >
                        <SelectTrigger className="mt-2 px-4 py-2.5">
                            <span>{formData.gender}</span>
                        </SelectTrigger>
                        <SelectContent>
                            {genderOptions.map((g) => (
                                <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Product Image */}
                <div>
                    <Label>Product Image</Label>
                    <label>
                        <div className="border border-dashed rounded-lg p-10 mt-2 flex flex-col items-center gap-2 cursor-pointer">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <GrUpload className="h-8 w-8 m-auto text-gray-400" />
                            <span className="text-center text-gray-400">Upload image</span>
                        </div>
                    </label>

                    {(formData.productImage) && (
                        <div className="relative mt-4">
                            <Image
                                src={
                                    typeof formData.productImage === 'string'
                                        ? formData.productImage
                                        : URL.createObjectURL(formData.productImage)
                                }
                                height={100}
                                width={100}
                                alt="product"
                                className="w-full h-full object-cover rounded"
                                priority
                            />
                            {formData.productImage && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-1 right-1 text-xs px-2 py-1"
                                    onClick={removeImage}
                                >
                                    X
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdating} className="w-fit bg-[#FF6B00] hover:bg-[#FF6B00CC]">
                        {isUpdating ? (
                            <div className="flex justify-center items-center gap-2">
                                Updating...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div>
                        ) : (
                            <span>Update Product</span>
                        )}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default UpdateProductModal;
