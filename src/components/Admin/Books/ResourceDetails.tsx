"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetSingleResourceQuery } from "@/redux/api/admin/resource";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash, FaFilePdf, FaFileAlt } from "react-icons/fa";

const ResourceDetails: React.FC = () => {
    const { resourceId } = useParams();
    const { data, isLoading, isError } = useGetSingleResourceQuery(resourceId);

    if (isLoading) {
        return <p className="text-center mt-10 text-gray-500">Loading resource...</p>;
    }

    if (isError || !data?.result) {
        return <p className="text-center mt-10 text-red-500">Failed to load resource.</p>;
    }

    const resource = data.result;
    const { id, title, description, Type, file, uploderName, createdAt } = resource;

    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="bg-white rounded-xl p-6">
            {/* Title and Description */}
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-[#636F85] mb-6">{description}</p>

            {/* Resource Info */}
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 mb-6">
                <p className="mb-1">
                    <span className="font-semibold">Type:</span>{" "}
                    {Type === "Pdf" ? (
                        <span className="inline-flex items-center gap-1">
                            <FaFilePdf className="text-red-500" /> PDF
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1">
                            <FaFileAlt className="text-blue-500" /> <span className="text-[#4C4C4C]">{Type}</span>
                        </span>
                    )}
                </p>
                <p className="mb-1">
                    <span className="font-semibold">Uploaded on:</span> <span className="text-[#4C4C4C]">{formattedDate}</span>
                </p>
                <p>
                    <span className="font-semibold">Uploaded by:</span> <span className="text-[#4C4C4C]">{uploderName || "Unknown"}</span>
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
                <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 text-[#1E3A8A] bg-[#F7F9FF] cursor-pointer"
                    onClick={() => console.log("Edit resource", id)}
                >
                    <FaEdit /> Edit
                </Button>

                <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 text-[#1E3A8A] bg-[#F7F9FF] cursor-pointer"
                    onClick={() => window.open(file, "_blank")}
                >
                    <FaFilePdf /> Open {Type === "Pdf" ? 'PDF' : Type === "Video" ? 'Video' : 'Audio'}
                </Button>

                <Button
                    variant="destructive"
                    className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                    onClick={() => console.log("Remove resource", id)}
                >
                    <FaTrash /> Remove
                </Button>
            </div>
        </div>
    );
};

export default ResourceDetails;
