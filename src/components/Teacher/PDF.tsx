"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { SyncLoader } from "react-spinners";
import { TfiAngleLeft } from "react-icons/tfi";
import { useGetSingleBookQuery } from "@/redux/api/book";
import { Button } from "../ui/button";

const PDF = () => {
    const route = useRouter();
    const { id, bookId } = useParams();
    const pathname = window.location.pathname;
    const { data, isLoading } = useGetSingleBookQuery(pathname === `/teacher/classes/books/${id}/${bookId}` && bookId);

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
            <Button onClick={() => route.back()} className='mb-6 bg-white/80 text-black cursor-pointer'><TfiAngleLeft />Back</Button>

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