"use client";

import React from "react";
import { useParams } from "next/navigation";
import { SyncLoader } from "react-spinners";
import { TfiAngleLeft } from "react-icons/tfi";
import Link from "next/link";
import { useGetSingleBookQuery } from "@/redux/api/book";

const PDF = () => {
    const { id } = useParams();
    const { data, isLoading } = useGetSingleBookQuery(id);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 gap-3">
                <span className="text-[#1E3A8A] font-medium">Loading...</span>
                <SyncLoader color="#1E3A8A" />
            </div>
        );
    }

    const fileUrl = data?.result?.file;

    return (
        <div>
            <Link href={`/admin/books/book-overview/${id}`}>
                <button className="flex justify-center items-center gap-2 text-[#636F85] cursor-pointer mb-6"><TfiAngleLeft />Back</button>
            </Link>
            <div className="w-full h-screen flex justify-center items-center">
                {fileUrl ? (
                    <iframe
                        src={fileUrl}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                    />
                ) : (
                    <p>No PDF file found.</p>
                )}
            </div>
        </div>
    );
};

export default PDF;