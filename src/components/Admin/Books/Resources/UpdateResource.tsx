/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from 'react';
import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CgSoftwareUpload } from 'react-icons/cg';
import { RxCross1 } from 'react-icons/rx';
import { Button } from '@/components/ui/button';
import { PiSpinner } from 'react-icons/pi';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { setPreviewResourceFile, setResourceDescription, setResourceFile, setResourceLink, setResourceTitle, setResourceType } from '@/redux/features/bookSlice';
import { useGetSingleResourceQuery, useUpdateResourceMutation } from '@/redux/api/resource';

const UpdateResource = ({ resourceId }: { resourceId: string }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const dispatch = useDispatch();
    const {
        resourceType,
        resourceTitle,
        resourceDescription,
        previewResourceFile,
        resourceFile,
        resourceLink,
    } = useSelector((state: RootState) => state.book);

    const { data } = useGetSingleResourceQuery(resourceId);

    useEffect(() => {
        if (data) {
            dispatch(setResourceType(data?.result?.Type));
            dispatch(setResourceTitle(data?.result?.title));
            dispatch(setResourceDescription(data?.result?.description));
            dispatch(setResourceLink(data?.result?.file));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const [UpdateResource, { isLoading: isResourceLoading }] = useUpdateResourceMutation();

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
            const response = await UpdateResource({ resourceId, formData }).unwrap();
            if (response.success) {
                toast.success(response.message);
                closeRef.current?.click();
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    };

    return (
        <DialogContent className='overflow-y-auto max-h-[75%]'>
            <DialogClose ref={closeRef} className="hidden" />
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <h2 className="text-2xl font-bold">Update Resource</h2>

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

                <Label>Preview</Label>
                {
                    resourceType === 'Video' ?
                        <video
                            controls
                            className="w-full rounded-xl mt-2 shadow-lg"
                            style={{ maxHeight: "400px" }}
                        >
                            <source src={resourceLink} />
                            Your browser does not support the video tag.
                        </video> :
                        resourceType === 'Pdf' ?
                            <iframe
                                src={resourceLink}
                                title="PDF Preview"
                                className="w-full h-[600px] border rounded-xl mt-2 shadow-lg"
                            /> :
                            <iframe
                                src={resourceLink}
                                title="PDF Preview"
                                className="w-full h-[100px] border rounded-xl shadow-lg"
                            />
                }

                {/* Buttons */}
                <div className="flex justify-center items-center gap-3 pt-3">
                    <Button
                        variant="outline"
                        type='button'
                        className="px-6 border-[#636F85] text-[#636F85] font-medium"
                        onClick={() => closeRef.current?.click()}
                    >
                        Cancel
                    </Button>

                    <Button
                        type='submit'
                        className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A] text-white font-medium px-6"
                    // disabled={isButtonDisabled}
                    >
                        {
                            (isResourceLoading) ?
                                <div className="flex justify-center items-center gap-2">
                                    Updating...
                                    <div className="animate-spin">
                                        <PiSpinner className="h-4 w-4" />
                                    </div>
                                </div> :
                                "Update Resource"
                        }
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default UpdateResource;