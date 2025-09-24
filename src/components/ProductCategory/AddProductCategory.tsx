/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, useState } from 'react';
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { PiSpinner } from 'react-icons/pi';
import { useAddProductCategoryMutation } from '@/redux/api/ecommerce/productCategory';

interface FormState {
    name: string;
    productCategoriesImage: File | null;
}

const AddProductCategory = () => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const [formData, setFormData] = useState<FormState>({
        name: "",
        productCategoriesImage: null,
    });

    const [AddCategory, { isLoading }] = useAddProductCategoryMutation();

    const handleChange = (value: string, field: keyof FormState) => {
        setFormData((prev) => ({ ...prev, [field]: value as any }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, productCategoriesImage: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.warning("Subcategory name is required");
            return;
        }

        if (!formData.productCategoriesImage) {
            toast.warning("Subcategory image is required");
            return;
        }
        const bodyData = {
            name: formData.name,
        };

        const categoryData = new FormData();
        categoryData.append("bodyData", JSON.stringify(bodyData));
        categoryData.append("productCategoriesImage", formData.productCategoriesImage);

        try {
            const response = await AddCategory(categoryData).unwrap();
            if (response.success) {
                toast.success(response.message || "Category added successfully");
                closeRef.current?.click();
            }
        } catch (err) {
            toast.warning((err as any)?.data?.message || "Something went wrong");
        }
    };

    return (
        <DialogContent className="min-w-2xs md:min-w-md max-h-[80vh] overflow-y-auto p-6" showCloseButton>
            <DialogClose ref={closeRef} className="hidden" />
            <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add Category</DialogTitle>
                <DialogDescription>Enter the details of the category.</DialogDescription>
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

                {/* Image Upload */}
                <div>
                    <Label>Category Image</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="w-fit bg-[#FF6B00] hover:bg-[#FF6B00CC]">
                        {isLoading ? (
                            <div className="flex justify-center items-center gap-2">
                                Adding...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div>
                        ) : (
                            <span>Add Category</span>
                        )}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default AddProductCategory;