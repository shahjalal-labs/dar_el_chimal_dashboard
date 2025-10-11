import React from "react";
import { SyncLoader } from "react-spinners";
import Image from "next/image";
import { DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useGetSingleBookCategoryQuery } from "@/redux/api/bookCategory";

const ViewBookCategoryModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSingleBookCategoryQuery(id);
    const category = data?.result;

    if (isLoading) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-[#1E3A8A] font-medium">Data is Loading</span>
                    <SyncLoader color="#1E3A8A" />
                </div>
            </DialogContent>
        );
    }

    if (!category) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <p className="text-center text-gray-700">No data found!</p>
            </DialogContent>
        );
    }

    return (
        <DialogContent className="p-6 max-h-[80vh] overflow-y-auto" showCloseButton>
            {/* Category Info */}
            <div className="flex items-start gap-4">
                <Image
                    src={category.image}
                    alt={category.name}
                    height={500}
                    width={500}
                    className="w-28 h-28 rounded-lg object-cover border"
                    priority
                />
                <div>
                    <h2 className="text-lg font-semibold">{category.name}</h2>
                    <p className="text-sm text-gray-600">{category.description}</p>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(category.createdAt).toLocaleString()}
                </div>
                <div>
                    <span className="font-medium">Updated At:</span>{" "}
                    {new Date(category.updatedAt).toLocaleString()}
                </div>
            </div>
        </DialogContent>
    );
};

export default ViewBookCategoryModal;