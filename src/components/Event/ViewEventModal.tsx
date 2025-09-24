'use client';

import React from 'react';
import { useGetSingleEventQuery } from '@/redux/api/eventOrganizer/event';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { SyncLoader } from 'react-spinners';
import Image from 'next/image';

const ViewEventModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSingleEventQuery(id);

    if (isLoading) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-[#FF6B00] font-medium">Data is Loading</span>
                    <SyncLoader color='#FF6B00' />
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

    const event = data.result;

    return (
        <DialogContent className="min-w-2xs md:min-w-xl lg:min-w-3xl overflow-y-auto max-h-[80vh] p-6" showCloseButton>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
                <DialogDescription className="text-gray-600">
                    {new Date(event.date).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </DialogDescription>
            </DialogHeader>

            {/* Event Banner */}
            <div className="w-full mt-4 rounded-lg overflow-hidden">
                <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover"
                    priority
                />
            </div>

            {/* Teams Info */}
            <div className="flex justify-between items-center mt-6">
                {/* Home Team */}
                <div className="flex flex-col items-center">
                    <Image
                        src={event.eventsAsHome.logoUrl}
                        alt={event.eventsAsHome.name}
                        width={80}
                        height={80}
                        className="rounded-full border p-1"
                        priority
                    />
                    <span className="mt-2 font-semibold">{event.eventsAsHome.name}</span>
                </div>

                <span className="text-lg font-bold text-gray-500">VS</span>

                {/* Away Team */}
                <div className="flex flex-col items-center">
                    <Image
                        src={event.eventsAsAway.logoUrl}
                        alt={event.eventsAsAway.name}
                        width={80}
                        height={80}
                        className="rounded-full border p-1"
                    />
                    <span className="mt-2 font-semibold">{event.eventsAsAway.name}</span>
                </div>
            </div>

            {/* Event Details */}
            <div className="mt-6 space-y-2">
                <p className="text-gray-800">{event.description}</p>
                <p><span className="font-semibold">Category:</span> {event.category.name}</p>
                <p><span className="font-semibold">Economy Ticket Price:</span> ${event.economyTicketsPrice}</p>
                <p><span className="font-semibold">VIP Ticket Price:</span> ${event.vipTicketsPrice}</p>
                <p><span className="font-semibold">VIP Tickets Sold:</span> {event.vipTicketsSold}</p>
            </div>

            {/* Organizer Info */}
            <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-2">Organizer Information</h3>
                <p><span className="font-semibold">Name:</span> {event.createdBy.username}</p>
                <p><span className="font-semibold">Phone:</span> {event.createdBy.phoneNumber}</p>
            </div>
        </DialogContent>
    );
};

export default ViewEventModal;
