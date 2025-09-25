/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, useState } from 'react';
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { PiSpinner } from 'react-icons/pi';
import { useAddParentCategoryMutation } from '@/redux/api/admin/parentCategory';

interface FormState {
    name: string;
}

const AddParentCategory = () => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const [formData, setFormData] = useState<FormState>({
        name: "",
    });

    const [AddParentCategory, { isLoading }] = useAddParentCategoryMutation();

    const handleChange = (value: string, field: keyof FormState) => {
        setFormData((prev) => ({ ...prev, [field]: value as any }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.warning("Category name is required");
            return;
        }

        const categoryData = { name: formData.name };

        try {
            const response = await AddParentCategory(categoryData).unwrap();
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
                <DialogTitle className="text-xl font-bold">Add Parent Category</DialogTitle>
                <DialogDescription>Enter the name of the parent category.</DialogDescription>
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

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="w-fit bg-[#1E3A8A] hover:bg-[#1E3A8ACC]">
                        {
                            isLoading ?
                                <div className="flex justify-center items-center gap-2">
                                    Adding...
                                    <div className="animate-spin">
                                        <PiSpinner className="h-4 w-4" />
                                    </div>
                                </div> :
                                <span>Add Parent Category</span>
                        }
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default AddParentCategory;