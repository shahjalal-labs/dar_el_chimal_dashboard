/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CgSoftwareUpload } from 'react-icons/cg';
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { setPreviewResourceFile, setResourceDescription, setResourceFile, setResourceLink, setResourceTitle, setResourceType } from "@/redux/features/bookSlice";
import { RootState } from '@/redux/store/store';
import { toast } from 'sonner';
import { PiSpinner } from 'react-icons/pi';
import { useCreateResourceMutation } from '@/redux/api/resource';

const Resource = ({ bookId, setIsAddResource }: { bookId: any, setIsAddResource: (value: boolean) => void }) => {
    const dispatch = useDispatch();
    const {
        resourceType,
        resourceTitle,
        resourceDescription,
        previewResourceFile,
        resourceFile,
        resourceLink,
    } = useSelector((state: RootState) => state.book);

    const [CreateResource, { isLoading: isResourceLoading }] = useCreateResourceMutation();

    const handleRemoveResourceFile = () => {
        dispatch(setResourceFile(null));
        dispatch(setPreviewResourceFile(''));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const body = {
            title: resourceTitle,
            description: resourceDescription,
            Type: resourceType
        }

        const formData = new FormData();
        formData.append('bodyData', JSON.stringify(body));
        if (resourceFile) {
            formData.append('file', resourceFile)
        }
        try {
            const response = await CreateResource({ bookId, formData }).unwrap();
            if (response.success) {
                toast.success(response.message);
                window.location.reload();
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    };

    const isButtonDisabled =
        !resourceType || !resourceTitle || !resourceDescription || !previewResourceFile || !resourceLink;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className='md:flex justify-between items-center mb-6'>
                <h2 className="text-2xl font-bold">Upload New Resource</h2>
                <Button
                    onClick={() => setIsAddResource(false)}
                    className="bg-red-500 hover:bg-red-400/80 text-white font-medium px-6 mt-6 md:mt-0">
                    Cancel
                </Button>
            </div>

            {/* Resource Type */}
            <div>
                <Label className="block text-lg font-medium mb-4">Resource Type</Label>
                <div className="flex gap-6">
                    {["Audio", "Video", "Pdf"].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={resourceType === type}
                                onChange={() => dispatch(setResourceType(type))}
                                className="h-4 w-4 accent-[#1E3A8A] stroke-[#D8D8D8]"
                            // required
                            />
                            <span className="capitalize text-[#4C4C4C]">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Title */}
            <div>
                <Label>Title</Label>
                <Input
                    placeholder="Enter your resource title"
                    value={resourceTitle}
                    onChange={(e) => dispatch(setResourceTitle(e.target.value))}
                    required
                />
            </div>

            {/* Description */}
            <div>
                <Label>Description</Label>
                <textarea
                    placeholder="Enter your resource description"
                    className="border border-[#CBD5E1] rounded-md p-2 w-full h-24 mt-2"
                    value={resourceDescription}
                    onChange={(e) => dispatch(setResourceDescription(e.target.value))}
                />
            </div>

            {/* File Upload */}
            <div>
                <Label>File Upload or Link</Label>
                {!previewResourceFile ? (
                    <label htmlFor="resourceFile">
                        <div className="border border-dashed border-[#CBD5E1] rounded-lg px-6 py-8 w-full cursor-pointer mt-2">
                            <input
                                id="resourceFile"
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.mp4,.mp3"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    if (file) {
                                        dispatch(setResourceFile(file));
                                        dispatch(setPreviewResourceFile(file.name));
                                    }
                                }}
                                className="hidden"
                            />
                            <div className="flex flex-col items-center gap-2">
                                <CgSoftwareUpload className="w-6 h-6" />
                                <p className="text-[#4C4C4C] font-medium text-center">
                                    Choose File
                                    <br />
                                    <span className="text-sm font-normal text-[#636F85]">
                                        (Excel, words, pdf, images, links)
                                    </span>
                                </p>
                            </div>
                        </div>
                    </label>
                ) : (
                    <div className="relative flex flex-col items-center p-6 border border-[#CBD5E1] rounded-lg bg-gray-50 mt-2">
                        <button
                            onClick={handleRemoveResourceFile}
                            className="absolute top-2 right-2 bg-gray-300 rounded-full p-1 hover:bg-gray-400 transition"
                        >
                            <RxCross1 className="w-3 h-3" />
                        </button>
                        <p className="text-[#1E3A8A] font-medium text-center break-all">
                            {previewResourceFile}
                        </p>
                    </div>
                )}
            </div>

            {/* OR Link */}
            <div className="text-center text-[#D8D8D8]">────────── <span className="text-[#4C4C4C]">Or</span> ──────────</div>

            <div>
                <Input
                    type='url'
                    placeholder="Paste your link"
                    value={resourceLink}
                    onChange={(e) => dispatch(setResourceLink(e.target.value))}
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-center items-center gap-3 pt-3">
                <Button
                    variant="outline"
                    className="px-6 border-[#636F85] text-[#636F85] font-medium"
                    onClick={() => {
                        dispatch(setResourceType(''))
                        dispatch(setResourceTitle(''))
                        dispatch(setResourceDescription(''))
                        dispatch(setResourceFile(null))
                        dispatch(setPreviewResourceFile(''))
                        dispatch(setResourceLink(''))
                    }}
                >
                    Clear
                </Button>

                <Button
                    type='submit'
                    className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A] text-white font-medium px-6"
                    disabled={isButtonDisabled}
                >
                    {
                        (isResourceLoading) ?
                            <div className="flex justify-center items-center gap-2">
                                Uploading...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div> :
                            "Upload Resource"
                    }
                </Button>
            </div>
        </form>
    );
};

export default Resource;