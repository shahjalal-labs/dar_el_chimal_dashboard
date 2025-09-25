/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useGetSingleGroundQuery } from "@/redux/api/playground/ground";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { SyncLoader } from "react-spinners";

const ViewGroundModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSingleGroundQuery(id);

    if (isLoading) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-[#1E3A8A]">Data is Loading</span>
                    <SyncLoader color='#1E3A8A' />
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

    const ground = data.result;

    return (
        <DialogContent className="min-w-2xs md:min-w-xl lg:min-w-3xl overflow-y-auto max-h-[80vh] p-6" showCloseButton>
            <DialogHeader>
                <DialogTitle className="text-xl font-bold">{ground.name || "Ground Details"}</DialogTitle>
                <DialogDescription className="text-sm text-gray-500">{ground.description || "Details about the selected ground."}</DialogDescription>
            </DialogHeader>

            {/* Images */}
            <div className="grid grid-cols-2 gap-2 mt-4">
                {ground.images?.map((img: string, index: number) => (
                    <div key={index} className="relative w-full h-40 rounded-lg overflow-hidden">
                        <Image
                            src={img}
                            height={500}
                            width={500}
                            alt={`Ground image ${index + 1}`}
                            className="object-cover h-full w-full"
                            priority
                        />
                    </div>
                ))}
            </div>

            <Separator className="my-4" />

            {/* Location */}
            <div>
                <h3 className="font-semibold text-lg">Location</h3>
                <p>{ground.location?.address}</p>
                <p className="text-sm text-gray-500">
                    Coordinates: {ground.location.coordinates.join(", ")}
                </p>
            </div>

            <Separator className="my-4" />

            {/* Ground Info */}
            <div className="grid grid-cols-2 gap-4">
                <p>
                    <span className="font-semibold">Type:</span> {ground.playgroundType}
                </p>
                <p>
                    <span className="font-semibold">Price per hour:</span> ${ground.pricePerHour}
                </p>
                <p>
                    <span className="font-semibold">Max group members:</span> {ground.maxGroupMembers}
                </p>
                <p>
                    <span className="font-semibold">Opening hours:</span>{" "}
                    {ground.openingStartTime} - {ground.openingEndTime}
                </p>
            </div>

            <Separator className="my-4" />

            {/* Equipment Rentals */}
            <div>
                <h3 className="font-semibold text-lg">Equipment Rentals</h3>
                <ul className="list-disc pl-5">
                    {ground.equipmentRentals?.map((item: any, idx: number) => (
                        <li key={idx}>
                            {item.itemName} - ${item.pricePerMatch} per match
                        </li>
                    ))}
                </ul>
            </div>

            <Separator className="my-4" />

            {/* Opening Schedules */}
            <div>
                <h3 className="font-semibold text-lg">Opening Schedules</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {ground.openingSchedules?.map((slot: any, idx: number) => (
                        <div
                            key={idx}
                            className={`p-2 border rounded-md ${slot.isAvailable ? "bg-green-50" : "bg-red-50"
                                }`}
                        >
                            {slot.startTime} - {slot.endTime}{" "}
                            {slot.isAvailable ? "(Available)" : "(Unavailable)"}
                        </div>
                    ))}
                </div>
            </div>
        </DialogContent>
    );
};

export default ViewGroundModal;
