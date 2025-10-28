"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TfiAngleLeft } from "react-icons/tfi";
import { Button } from "../ui/button";
import PdfReader from "../Student/Book/BookReader/PdfReader";

const PDF = () => {
    const route = useRouter();
    const fileUrl = useSearchParams().get("pdfurl");

    if (!fileUrl) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">PDF not found</div>
            </div>
        );
    }

    return (
        <div>
            <Button onClick={() => route.back()} className='mb-6 bg-white/80 text-black hover:text-white cursor-pointer'><TfiAngleLeft />Back</Button>

            <div className="w-full h-screen flex justify-center items-center">
                {fileUrl ? (
                    <PdfReader
                        bookId="default-book-id"
                        pdfUrl={fileUrl}
                        totalPages={1000000}
                        isButton={false}
                    />
                ) : (
                    <p>No PDF file found.</p>
                )}
            </div>
        </div>
    );
};

export default PDF;