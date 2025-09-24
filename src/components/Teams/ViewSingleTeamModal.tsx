'use client';

import React from 'react';
import { useGetSingleTeamQuery } from '@/redux/api/eventOrganizer/team';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { SyncLoader } from 'react-spinners';
import Image from 'next/image';

const ViewSingleTeamModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSingleTeamQuery(id);

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
                <p className="text-center text-gray-700">No data found!</p>
            </DialogContent>
        );
    }

    const team = data.result;

    return (
        <DialogContent className="min-w-2xs md:min-w-xl lg:min-w-3xl overflow-y-auto max-h-[80vh] p-6" showCloseButton>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{team.name}</DialogTitle>
                <DialogDescription className="text-gray-600">
                    Created on{' '}
                    {new Date(team.createdAt).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </DialogDescription>
            </DialogHeader>

            {/* Team Logo */}
            <div className="w-full mt-4 flex justify-center">
                <Image
                    src={team.logoUrl}
                    alt={team.name}
                    width={200}
                    height={200}
                    className="rounded-full border p-2 object-cover"
                    priority
                />
            </div>

            {/* Team Info */}
            <div className="mt-6 space-y-2">
                    <span className="font-semibold">Team Name:</span> {team.name}
            </div>

            {/* Updated Info */}
            <div className="mt-6 border-t pt-4">
                <p>
                    <span className="font-semibold">Last Updated:</span>{' '}
                    {new Date(team.updatedAt).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
        </DialogContent>
    );
};

export default ViewSingleTeamModal;