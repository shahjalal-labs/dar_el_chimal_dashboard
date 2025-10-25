/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CgSoftwareUpload } from 'react-icons/cg';
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { setActiveBookTab } from '@/redux/features/uiSlice';
import { toast } from 'sonner';
import { PiSpinner } from 'react-icons/pi';
import { useCreateResourceMutation } from '@/redux/api/resource';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { setPreviewResourceFile, setResourceFile, setResourceLink } from '@/redux/features/schoolSlice';
import { useUploadSchoolResourceMutation } from '@/redux/api/school';

const Resource = ({ bookId }: { bookId: any }) => {
    const { id } = useParams();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const {
        previewResourceFile,
        resourceFile,
        resourceLink,
    } = useSelector((state: RootState) => state.school);

    const [UploadResource, { isLoading }] = useUploadSchoolResourceMutation();
    const [CreateResource, { isLoading: isResourceLoading }] = useCreateResourceMutation();

    const handleRemoveResourceFile = (fileName?: string) => {
        if (!fileName) {
            dispatch(setResourceFile(null));
            dispatch(setPreviewResourceFile([]));
        } else {
            const filesArray: File[] = Array.isArray(resourceFile) ? resourceFile : (resourceFile ? [resourceFile] : []);
            const updatedFiles = filesArray.filter((file: File) => file.name !== fileName);
            const updatedPreview = (previewResourceFile || []).filter((name: string) => name !== fileName);
            dispatch(setResourceFile(updatedFiles.length ? updatedFiles : null));
            dispatch(setPreviewResourceFile(updatedPreview));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length) {
            dispatch(setResourceFile(files));
            dispatch(setPreviewResourceFile(files.map(file => file.name)));
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const body = {};
        const formData = new FormData();

        if (pathname === '/admin/schools/add-new-school' && resourceFile) {
            const filesArray: File[] = Array.isArray(resourceFile) ? resourceFile : (resourceFile ? [resourceFile] : []);
            filesArray.forEach((file: File) => formData.append('files', file));
            try {
                const response = await UploadResource(formData).unwrap();
                if (response.success) {
                    toast.success(response.message);
                    dispatch(setPreviewResourceFile(response?.result?.map((f: any) => f.url)));
                    dispatch(setActiveBookTab("grade"));
                }
            } catch (error) {
                toast.warning((error as any)?.data?.message || "Something went wrong");
            }
        } else if (pathname === `/admin/books/book-overview/${id}`) {
            formData.append('bodyData', JSON.stringify(body));
            if (resourceFile) {
                const filesArray: File[] = Array.isArray(resourceFile) ? resourceFile : (resourceFile ? [resourceFile] : []);
                filesArray.forEach((file: File) => formData.append('file', file));
            }
            try {
                const response = await CreateResource({ bookId, formData }).unwrap();
                if (response.success) {
                    toast.success(response.message);
                }
            } catch (error) {
                toast.warning((error as any)?.data?.message || "Something went wrong");
            }
        } else {
            dispatch(setActiveBookTab("grade"));
        }
    };

    const isButtonDisabled = ((!previewResourceFile || previewResourceFile.length === 0) && !resourceLink);

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold">Upload New Resource</h2>

            {/* File Upload */}
            <div>
                <Label>File Upload or Link</Label>
                {!previewResourceFile || previewResourceFile.length === 0 ? (
                    <label htmlFor="resourceFile">
                        <div className="border border-dashed border-[#CBD5E1] rounded-lg px-6 py-8 w-full cursor-pointer mt-2">
                            <input
                                multiple
                                id="resourceFile"
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.svg,.mp3,.wav,.mp4,.mov"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="flex flex-col items-center gap-2">
                                <CgSoftwareUpload className="w-6 h-6" />
                                <p className="text-[#4C4C4C] font-medium text-center">
                                    Choose Files
                                    <br />
                                    <span className="text-sm font-normal text-[#636F85]">
                                        (Excel, Word, PDF, Images, Audio, Video)
                                    </span>
                                </p>
                            </div>
                        </div>
                    </label>
                ) : (
                    <div className="flex flex-col gap-2 mt-2">
                        {previewResourceFile?.map((fileName: string) => (
                            <div key={fileName} className="relative flex items-center p-4 border border-[#CBD5E1] rounded-lg bg-gray-50">
                                <Button
                                    onClick={() => handleRemoveResourceFile(fileName)}
                                    className="absolute top-2 right-2 bg-gray-300 rounded-full p-1 hover:bg-gray-400 transition"
                                >
                                    <RxCross1 className="w-3 h-3" />
                                </Button>
                                <p className="text-[#1E3A8A] font-medium break-all">{fileName}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                <Link href="/admin/schools">
                    <Button
                        variant="outline"
                        className="px-6 border-[#636F85] text-[#636F85]"
                    >
                        Cancel
                    </Button>
                </Link>

                <Button
                    type='submit'
                    disabled={isButtonDisabled}
                    className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A] text-white font-medium px-6"
                >
                    {(isLoading || isResourceLoading) ? (
                        <div className="flex justify-center items-center gap-2">
                            Uploading...
                            <div className="animate-spin">
                                <PiSpinner className="h-4 w-4" />
                            </div>
                        </div>
                    ) : "Upload Resource"}
                </Button>
            </div>
        </form>
    );
};

export default Resource;