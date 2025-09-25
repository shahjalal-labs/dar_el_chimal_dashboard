/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import preview from "@/assets/Previews.svg";
import logo from "@/assets/logo.svg";
import { Button } from "../ui/button";
import Link from "next/link";
import { RxCross1 } from "react-icons/rx";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { Label } from "../ui/label";
import { FaRegFilePdf } from "react-icons/fa";
import { toast } from "sonner";
import { useAddVendorsDocMutation } from "@/redux/api/authApi";
import { PiSpinner } from "react-icons/pi";
import { useRouter } from "next/navigation";

interface FormDataType {
    uploadDocs: File[];
}

export default function UploadMultipleFiles() {
    const [formData, setFormData] = useState<FormDataType>({ uploadDocs: [] });
    const route = useRouter();
    const [UploadDoc, { isLoading }] = useAddVendorsDocMutation();

    const handleFilesChange = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        setFormData((prev) => ({
            uploadDocs: [...prev.uploadDocs, ...newFiles],
        }));
    };

    const removeFile = (index: number) => {
        setFormData((prev) => ({
            uploadDocs: prev.uploadDocs.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.uploadDocs.length) {
            toast.warning("Please select at least one PDF file");
            return;
        }

        const body = new FormData();
        formData.uploadDocs.forEach((file) => {
            body.append("vendorDoc", file);
        });

        try {
            const response = await UploadDoc(body).unwrap();
            if (response.success) {
                toast.success(response.message);
                setFormData({ uploadDocs: [] }); // reset after success
                route.push('/login')
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Ocean Background */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <Image
                    src={preview}
                    alt="Fishing boat in blue ocean waters"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Right Side - Upload Form */}
            <div className="w-full lg:w-1/2 flex justify-center items-center bg-[#F9F9F9]">
                <div className="w-full max-w-sm">
                    {/* Logo */}
                    <div className="flex items-center justify-start mb-4 px-6 pt-6 xl:px-0">
                        <Image
                            src={logo}
                            height={200}
                            width={200}
                            alt="Logo"
                            className="w-44 h-44"
                            priority
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-semibold text-[#3F3D56]">
                            Upload Your Documents
                        </h2>
                        <p className="mt-1 text-[#7C8091]">
                            Upload multiple PDF documents for faster approval
                        </p>

                        <div>
                            <Label className="font-bold mb-2 mt-6">Upload Documents</Label>
                            <label htmlFor="uploadDocs">
                                <div className="border border-[#364352] rounded-lg px-6 py-8 w-full cursor-pointer">
                                    <input
                                        id="uploadDocs"
                                        type="file"
                                        accept="application/pdf"
                                        multiple
                                        onChange={(e) => handleFilesChange(e.target.files)}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <IoArrowUpCircleOutline className="h-6 w-6 text-[#00A8CC]" />
                                        <p className="text-[#8F909A]">Upload PDF Documents</p>
                                        <span className="text-[#8F909A] text-center text-xs">
                                            You can upload multiple PDF files.
                                        </span>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* File List */}
                        {formData.uploadDocs.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {formData.uploadDocs.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between border rounded-md p-2 bg-white shadow-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FaRegFilePdf className="text-red-500 h-5 w-5" />
                                            <div>
                                                <p className="text-sm font-medium">{file.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-gray-500 hover:text-red-600 transition"
                                        >
                                            <RxCross1 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A80] text-white font-bold rounded-lg transition-colors mt-4"
                        >
                            {isLoading ? (
                                <div className="flex justify-center items-center gap-2">
                                    Uploading...
                                    <div className="animate-spin">
                                        <PiSpinner className="h-4 w-4" />
                                    </div>
                                </div>
                            ) : (
                                <span>Upload</span>
                            )}
                        </Button>

                        <Link href="/login" className="hover:underline text-sm">
                            <p className="mt-8">Skip</p>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}