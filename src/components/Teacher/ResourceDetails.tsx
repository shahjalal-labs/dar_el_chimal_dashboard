/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash, FaFilePdf, FaFileAlt } from "react-icons/fa";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { PiSpinner } from "react-icons/pi";
import { useDeleteResourceMutation, useGetSingleResourceQuery } from "@/redux/api/resource";
import UpdateResource from "../Admin/Books/Resources/UpdateResource";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { TfiAngleLeft } from "react-icons/tfi";

const ResourceDetails: React.FC = () => {
    const route = useRouter();
    const { resourceId } = useParams();
    const { data, isLoading, isError } = useGetSingleResourceQuery(resourceId);
    const [DeleteResource, { isLoading: isDeleting }] = useDeleteResourceMutation();

    if (isLoading) {
        return <p className="text-center mt-10 text-gray-500">Loading resource...</p>;
    }

    if (isError || !data?.result) {
        return <p className="text-center mt-10 text-red-500">Failed to load resource.</p>;
    }

    const resource = data.result;
    const { title, description, Type, file, uploderName, createdAt } = resource;

    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleRemove = async () => {
        try {
            const response = await DeleteResource(resourceId).unwrap();
            if (response.success) {
                toast.success(response.message);
                route.back();
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    }

    return (
        <div>
            <Button onClick={() => route.back()} className='mb-6 bg-white/80 text-black hover:text-white cursor-pointer'><TfiAngleLeft />Back</Button>

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
                        ) : Type === "Image" ? (
                            <span className="inline-flex items-center gap-1">
                                <FaFileAlt className="text-purple-500" /> Image
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

                {/* Image Preview if resource is an image */}
                {Type === "Image" && file && (
                    <div className="mb-6 flex justify-center bg-gray-50 p-4 rounded-lg border">
                        <img
                            src={file}
                            alt={title}
                            className="max-h-[450px] w-auto object-contain rounded-md shadow-xs"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 border-gray-300 text-[#1E3A8A] bg-[#F7F9FF] cursor-pointer"
                            >
                                <FaEdit /> Edit
                            </Button>
                        </DialogTrigger>
                        <UpdateResource resourceId={String(resourceId)} />
                    </Dialog>

                    <Button
                        variant="outline"
                        className="flex items-center gap-2 border-gray-300 text-[#1E3A8A] bg-[#F7F9FF] cursor-pointer"
                        onClick={() => window.open(file, "_blank")}
                    >
                        <FaFilePdf /> Open {Type === "Pdf" ? 'PDF' : Type === "Video" ? 'Video' : Type === "Image" ? 'Image' : 'Resource'}
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                            >
                                {
                                    isDeleting ?
                                        <div className="flex justify-center items-center gap-2">
                                            Removing...
                                            <div className="animate-spin">
                                                <PiSpinner className="h-4 w-4" />
                                            </div>
                                        </div> :
                                        <div className="flex items-center gap-2">
                                            <FaTrash /> Remove
                                        </div>
                                }
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-[#30373D] text-3xl font-bold text-center">
                                    Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-[#636F85] text-center text-base mt-4">
                                    This action cannot be undone. This will
                                    permanently delete the{" "}
                                    {title ?? "item"}.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex justify-center items-center gap-4">
                                <AlertDialogCancel className="flex-1 font-bold text-[#636F85] cursor-pointer transition-all duration-500 ease-in-out">
                                    No
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A80] flex-1 cursor-pointer transition-all duration-500 ease-in-out"
                                    onClick={() => handleRemove()}
                                >
                                    Yes
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetails;
