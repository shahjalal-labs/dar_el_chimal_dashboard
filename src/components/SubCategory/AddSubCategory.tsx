/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, useState } from 'react';
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { PiSpinner } from 'react-icons/pi';
import { useAddSubCategoryMutation } from '@/redux/api/admin/subCategory';

interface FormState {
    name: string;
    categoriesImage: File | null;
}

const AddSubCategory = ({ id }: { id: string }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const [formData, setFormData] = useState<FormState>({
        name: "",
        categoriesImage: null,
    });

    const [AddSubCategory, { isLoading }] = useAddSubCategoryMutation();

    const handleChange = (value: string, field: keyof FormState) => {
        setFormData((prev) => ({ ...prev, [field]: value as any }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, categoriesImage: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.warning("Subcategory name is required");
            return;
        }

        if (!formData.categoriesImage) {
            toast.warning("Subcategory image is required");
            return;
        }
        const bodyData = {
            name: formData.name,
            parentCategoryId: id
        };

        const categoryData = new FormData();
        categoryData.append("bodyData", JSON.stringify(bodyData));
        categoryData.append("categoriesImage", formData.categoriesImage);

        try {
            const response = await AddSubCategory(categoryData).unwrap();
            if (response.success) {
                toast.success(response.message || "Subcategory added successfully");
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
                <DialogTitle className="text-xl font-bold">Add Sub Category</DialogTitle>
                <DialogDescription>Enter the details of the sub-category.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Sub Category Name */}
                <div>
                    <Label>Sub Category Name</Label>
                    <Input
                        placeholder="Enter sub-category name"
                        value={formData.name}
                        onChange={(e) => handleChange(e.target.value, "name")}
                        required
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <Label>Sub Category Image</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="w-fit bg-[#1E3A8A] hover:bg-[#1E3A8ACC]">
                        {isLoading ? (
                            <div className="flex justify-center items-center gap-2">
                                Adding...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div>
                        ) : (
                            <span>Add Sub Category</span>
                        )}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default AddSubCategory;