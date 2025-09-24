/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../ui/dialog';
import { SyncLoader } from 'react-spinners';
import { useGetSingleVendorQuery, useUpdateVendorMutation } from '@/redux/api/admin/user';
import { FaRegFilePdf } from 'react-icons/fa';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { PiSpinner } from 'react-icons/pi';

const ViewVendorDetailsModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSingleVendorQuery(id);

    const [ApproveVendor, { isLoading: isApproving }] = useUpdateVendorMutation();

    const handleApprove = async () => {
        const body = {
            docStatus: "APPROVED"
        }
        try {
            const res = await ApproveVendor({ id, body }).unwrap();
            if (res.success) {
                toast.success(res.message || "Vendor approved successfully");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to approve vendor");
        }
    };

    if (isLoading) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-[#FF6B00] font-medium">Data is Loading</span>
                    <SyncLoader color="#FF6B00" />
                </div>
            </DialogContent>
        );
    }

    if (!data?.result) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <p className="text-center text-gray-700">No vendor data found!</p>
            </DialogContent>
        );
    }

    const vendor = data.result;

    return (
        <DialogContent className="min-w-2xs md:min-w-xl lg:min-w-3xl overflow-y-auto max-h-[80vh] p-6 flex flex-col gap-6" showCloseButton>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{vendor.username}</DialogTitle>
                <DialogDescription className="text-gray-600">
                    <div>Email: {vendor.email}</div>
                    <div>Phone: {vendor.phoneNumber}</div>
                    <div>Role: {vendor.role}</div>
                    <div>Country: {vendor.country}</div>
                    <div>
                        Created on{' '}
                        {new Date(vendor.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </div>
                </DialogDescription>
            </DialogHeader>

            {/* Vendor Business Info */}
            <div>
                <h3 className="font-semibold text-lg mb-4">Business Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-lg p-4 bg-gray-50">
                    <p>
                        <span className="font-medium">Business Category:</span>{' '}
                        {vendor.vendor.businessCategory}
                    </p>
                    <p>
                        <span className="font-medium">Document Status:</span>{' '}
                        {vendor.vendor.docStatus}
                    </p>
                </div>
            </div>

            {/* Vendor Docs */}
            <div>
                <h3 className="font-semibold text-lg mb-4">Uploaded Documents</h3>
                {vendor.vendor.docs && vendor.vendor.docs.length > 0 ? (
                    <div className="space-y-3">
                        {vendor.vendor.docs.map((doc: string, index: number) => (
                            <a
                                key={index}
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 border rounded-lg p-2 bg-white shadow-sm hover:bg-gray-50 transition"
                            >
                                <FaRegFilePdf className="text-red-500 h-5 w-5" />
                                <span className="truncate">{doc.split('/').pop()}</span>
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No documents uploaded.</p>
                )}
            </div>

            {/* Approve Button */}
            <div className="flex justify-end mt-6">
                <Button
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-500 ease-in-out hover:scale-105"
                >
                    {
                        isApproving ?
                            <div className="flex justify-center items-center gap-2">
                                Approving...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div> :
                            <span>Approve Vendor</span>
                    }
                </Button>
            </div>
        </DialogContent>
    );
};

export default ViewVendorDetailsModal;