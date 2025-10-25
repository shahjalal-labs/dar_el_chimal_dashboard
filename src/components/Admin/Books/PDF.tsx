"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import PdfReader from "@/components/Student/Book/BookReader/PdfReader";

const PDF = () => {
    const fileUrl = useSearchParams().get("pdfurl");

    if (!fileUrl) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">PDF not found</div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            {fileUrl ? (
                <PdfReader
                    bookId="default-book-id"
                    pdfUrl={fileUrl}
                    totalPages={1000000}
                />
            ) : (
                <p>No PDF file found.</p>
            )}
        </div>
    );
};

export default PDF;