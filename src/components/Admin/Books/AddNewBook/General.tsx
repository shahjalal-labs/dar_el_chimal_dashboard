/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { RxCross1 } from "react-icons/rx";
import uploadImg from "@/assets/uploadImg.svg";
import { setActiveBookTab } from "@/redux/features/uiSlice";
import { RootState } from "@/redux/store/store";
import { setAuthor, setBookName, setCategory, setDescription, setISBN, setPreviewImage, setPreviewPdf, setUploadImage, setUploadPdf } from "@/redux/features/bookSlice";
import GetBookCategory from "@/components/Common/GetBookCategory";
import { useGetSingleBookQuery, useUpdateBookMutation } from "@/redux/api/book";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { PiSpinner } from "react-icons/pi";

const General = ({ id }: { id: string }) => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const {
        bookName,
        description,
        isbn,
        author,
        categoryId,
        categoryName,
        categoryImage,
        previewImage,
        previewPdf,
        uploadImage,
        uploadPdf
    } = useSelector((state: RootState) => state.book);

    const { data } = useGetSingleBookQuery(id);
    const [UpdateBook, { isLoading }] = useUpdateBookMutation();

    useEffect(() => {
        if (pathname === '/admin/books' && data?.result) {
            dispatch(setBookName(data?.result?.bookName));
            dispatch(setDescription(data?.result?.description));
            dispatch(setISBN(data?.result?.ISBN));
            dispatch(setAuthor(data?.result?.author));
            dispatch(setCategory(data?.result?.category));
            dispatch(setPreviewImage(data?.result?.coverImg));
            dispatch(setPreviewPdf(data?.result?.file));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const handleImageChange = (file: File | null) => {
        if (file) {
            const imgURL = URL.createObjectURL(file);
            dispatch(setPreviewImage(imgURL));
            dispatch(setUploadImage(file));
        } else {
            dispatch(setPreviewImage(''));
            dispatch(setUploadImage(null));
        }
    };

    const handlePdfChange = (file: File | null) => {
        if (file) {
            dispatch(setPreviewPdf(URL.createObjectURL(file)));
            dispatch(setUploadPdf(file));
        } else {
            dispatch(setPreviewPdf(''));
            dispatch(setUploadPdf(null));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (pathname === '/admin/books') {
            const body = {
                BookData: {
                    bookName: bookName,
                    author: author,
                    description: description,
                    ISBN: isbn,
                    categoryId: categoryId
                },
            }

            const formData = new FormData();
            formData.append('bodyData', JSON.stringify(body))

            if (uploadImage) {
                formData.append('coverImage', uploadImage)
            }

            if (uploadPdf) {
                formData.append('bookPdf', uploadPdf)
            }

            try {
                const response = await UpdateBook({ bookId: id, formData }).unwrap();
                if (response.success) {
                    toast.success(response.message);
                    dispatch(setBookName(''))
                    dispatch(setDescription(''))
                    dispatch(setAuthor(''))
                    dispatch(setISBN(''))
                    dispatch(setCategory(''))
                    dispatch(setPreviewImage(''))
                    dispatch(setUploadImage(null))
                    dispatch(setPreviewPdf(''))
                    dispatch(setUploadPdf(null))
                    dispatch(setActiveBookTab("grade"));
                }
            } catch (error) {
                toast.warning((error as any)?.data?.message || "Something went wrong");
            }
        }
        else {
            dispatch(setActiveBookTab("resources"));
        }
    };

    const isButtonDisabled =
        !bookName || !description || !isbn || !author || !categoryName || !previewPdf;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Book Name */}
            <div>
                <Label>Book Name</Label>
                <Input
                    type="text"
                    placeholder="Enter book name"
                    value={bookName}
                    onChange={(e) => dispatch(setBookName(e.target.value))}
                    required
                />
            </div>

            {/* Description */}
            <div>
                <Label>Description</Label>
                <Input
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => dispatch(setDescription(e.target.value))}
                    required
                />
            </div>

            {/* ISBN & Author */}
            <div className="md:flex gap-6">
                <div className="flex-1">
                    <Label>ISBN</Label>
                    <Input
                        type="text"
                        placeholder="Enter ISBN"
                        value={isbn}
                        onChange={(e) => dispatch(setISBN(e.target.value))}
                        required
                    />
                </div>
                <div className="flex-1 mt-5 md:mt-0">
                    <Label>Author</Label>
                    <Input
                        type="text"
                        placeholder="Enter author name"
                        value={author}
                        onChange={(e) => dispatch(setAuthor(e.target.value))}
                        required
                    />
                </div>
            </div>

            {/* Category */}
            <div className="relative">
                <Label>Book Category</Label>
                <GetBookCategory
                    onChange={(category) => { dispatch(setCategory(category)) }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className='absolute z-10 top-[50%] left-[15px]'>
                    <Image
                        src={categoryImage}
                        height={50}
                        width={50}
                        alt={categoryName}
                        style={{ width: 24, height: 24, borderRadius: '50%' }}
                        priority
                    />
                    <span className=''>{categoryName}</span>
                </div>
            </div>

            {/* File Uploads */}
            <div className="md:flex gap-6">
                {/* Image Upload */}
                <div className="flex-1">
                    <Label className="font-medium mb-2.5">Book Cover</Label>

                    {!previewImage ? (
                        <label htmlFor="uploadImage">
                            <div className="border border-dashed border-[#CBD5E1] rounded-lg px-6 py-8 w-full cursor-pointer">
                                <input
                                    id="uploadImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                                    className="hidden"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <Image src={uploadImg} height={40} width={40} alt="Upload" />
                                    <p className="text-[#636F85] text-center mt-1">
                                        Drag and drop or{" "}
                                        <span className="text-[#2A66FF] underline">browse</span>
                                    </p>
                                </div>
                            </div>
                        </label>
                    ) : (
                        <div className="flex justify-center relative w-fit mx-auto group">
                            <div
                                onClick={() => handleImageChange(null)}
                                className="bg-[#bdbfc4]/60 rounded-full p-1 absolute top-2 right-2 opacity-100 transition-opacity cursor-pointer hover:bg-gray-400"
                            >
                                <RxCross1 className="h-3 w-3" />
                            </div>
                            <Image
                                src={previewImage}
                                height={200}
                                width={300}
                                alt="Preview"
                                className="w-full h-[200px] object-cover rounded-md"
                            />
                        </div>
                    )}
                </div>

                {/* PDF Upload */}
                <div className="flex-1 mt-5 md:mt-0">
                    <Label className="font-medium mb-2.5">PDF File<span className="text-red-600">*</span></Label>

                    {!previewPdf ? (
                        <label htmlFor="uploadPdf">
                            <div className="border border-dashed border-[#CBD5E1] rounded-lg px-6 py-8 w-full cursor-pointer">
                                <input
                                    id="uploadPdf"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => handlePdfChange(e.target.files?.[0] ?? null)}
                                    className="hidden"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <Image src={uploadImg} height={40} width={40} alt="Upload" />
                                    <p className="text-[#636F85] text-center mt-1">
                                        Drag and drop or{" "}
                                        <span className="text-[#2A66FF] underline">browse</span>
                                    </p>
                                </div>
                            </div>
                        </label>
                    ) : (
                        <div className="relative flex flex-col items-center p-6 border border-[#CBD5E1] rounded-lg bg-gray-50">
                            <Button
                                type="button"
                                onClick={() => handlePdfChange(null)}
                                className="absolute top-2 right-2 bg-gray-300 rounded-full p-1 hover:bg-gray-400"
                            >
                                <RxCross1 className="w-3 h-3" />
                            </Button>
                            <iframe
                                src={previewPdf}
                                title="PDF Preview"
                                className="w-full  border rounded-xl mt-2 shadow-lg"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-3 pt-3">
                <Link href="/admin/books">
                    <Button
                        variant="outline"
                        className="px-6 border-[#636F85] text-[#636F85]"
                    >
                        Cancel
                    </Button>
                </Link>

                <Button
                    type="submit"
                    disabled={isButtonDisabled}
                    className={`px-6 text-white font-medium transition-all duration-500 ease-in-out cursor-pointer ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A]"}`}
                >
                    {
                        (isLoading && pathname === '/admin/books') ?
                            <div className="flex justify-center items-center gap-2">
                                Saving...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div> :
                            "Save & Continue"
                    }
                </Button>
            </div>
        </form>
    );
};

export default General;