import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';
import { RxCross1 } from 'react-icons/rx';
import uploadImg from "@/assets/uploadImg.svg";

interface FormDataType {
    categoryName: string;
    description: string;
    uploadImage: File | null;
    uploadPdf: File | null;
}

const General = () => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [pdfName, setPdfName] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormDataType>({
        categoryName: "",
        description: "",
        uploadImage: null,
        uploadPdf: null,
    });

    const updateChange = (field: keyof FormDataType, value: string | File | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (field === "uploadImage" && value instanceof File) {
            const imageUrl = URL.createObjectURL(value);
            setPreviewUrl(imageUrl);
        }

        if (field === "uploadPdf" && value instanceof File) {
            setPdfName(value.name);
        }
    };

    const handleRemoveImage = () => {
        setPreviewUrl(null);
        updateChange("uploadImage", null);
    };

    const handleRemovePdf = () => {
        setPdfName(null);
        updateChange("uploadPdf", null);
    };

    return (
        <div className="space-y-5">
            <div>
                <Label>Book Name</Label>
                <Input 
                type='text'
                />
            </div>

            <div>
                <Label>Description</Label>
                <Input />
            </div>

            <div className="flex gap-6">
                <div className="flex-1">
                    <Label>ISBN</Label>
                    <Input />
                </div>
                <div className="flex-1">
                    <Label>Author</Label>
                    <Input />
                </div>
            </div>

            <div>
                <Label>Book Category</Label>
                <Input />
            </div>

            <div className="flex gap-6">
                <div className="flex-1">
                    <Label className="text-[#30373D] font-medium mb-2.5">
                        Book Cover<span className="text-red-600">*</span>
                    </Label>

                    {!previewUrl ? (
                        <label htmlFor="uploadImage">
                            <div className="border border-dashed border-[#CBD5E1] rounded-lg px-6 py-8 w-full cursor-pointer">
                                <input
                                    id="uploadImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        updateChange("uploadImage", file);
                                    }}
                                    className="hidden"
                                    required
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <Image
                                        src={uploadImg}
                                        height={40}
                                        width={40}
                                        alt="Upload"
                                        className="w-10 mx-auto"
                                        priority
                                    />
                                    <p className="text-[#636F85] text-center mt-1">
                                        Drag and drop or{" "}
                                        <span className="text-[#2A66FF] underline">
                                            browse
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </label>
                    ) : (
                        <div className="flex justify-center relative w-fit mx-auto group">
                            <div
                                onClick={handleRemoveImage}
                                className="bg-[#bdbfc4]/60 rounded-full p-2 absolute z-20 top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
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

                <div className="flex-1">
                    <Label className="text-[#30373D] font-medium mb-2.5">
                        PDF File<span className="text-red-600">*</span>
                    </Label>

                    {!pdfName ? (
                        <label htmlFor="uploadPdf">
                            <div className="border border-dashed border-[#CBD5E1] rounded-lg px-6 py-8 w-full cursor-pointer">
                                <input
                                    id="uploadPdf"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        updateChange("uploadPdf", file);
                                    }}
                                    className="hidden"
                                    required
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <Image
                                        src={uploadImg}
                                        height={40}
                                        width={40}
                                        alt="Upload PDF"
                                        className="w-10 mx-auto"
                                        priority
                                    />
                                    <p className="text-[#636F85] text-center mt-1">
                                        Drag and drop or{" "}
                                        <span className="text-[#2A66FF] underline">
                                            browse
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </label>
                    ) : (
                        <div className="relative flex flex-col items-center p-6 border border-[#CBD5E1] rounded-lg bg-gray-50">
                            <button
                                onClick={handleRemovePdf}
                                className="absolute top-2 right-2 bg-gray-300 rounded-full p-1 hover:bg-gray-400 transition"
                            >
                                <RxCross1 className="w-3 h-3" />
                            </button>
                            <p className="text-[#1E3A8A] font-medium text-center break-all">
                                {pdfName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">(PDF File)</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center items-center gap-3 pt-3">
                <Link href="/admin/books">
                    <Button
                        variant="outline"
                        className="px-6 border-[#636F85] text-[#636F85] font-medium transition-all duration-500 ease-in-out cursor-pointer"
                    >
                        Cancel
                    </Button>
                </Link>

                <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A] text-white font-medium transition-all duration-500 ease-in-out cursor-pointer px-6">
                    Save & Continue
                </Button>
            </div>
        </div>
    );
};

export default General;