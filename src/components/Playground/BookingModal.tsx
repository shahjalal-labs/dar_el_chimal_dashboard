/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useGetSinglePlayGroundBookingQuery } from "@/redux/api/playground/booking";
import { DialogContent } from "../ui/dialog";
import { SyncLoader } from "react-spinners";
import { Separator } from "../ui/separator";
import Image from "next/image";

const BookingModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSinglePlayGroundBookingQuery(id);
    const booking = data?.result;

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

    if (!booking) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <p className="text-center text-gray-700">No data found!</p>
            </DialogContent>
        );
    }

    return (
        <DialogContent className="p-6 max-h-[80vh] overflow-y-auto" showCloseButton>
            {/* Ground Info */}
            <div className="flex items-start gap-4">
                <Image
                    src={booking.practiceGround?.images?.[0]}
                    alt={booking.practiceGround?.name}
                    height={500}
                    width={500}
                    className="w-28 h-28 rounded-lg object-cover border"
                    priority
                />
                <div>
                    <h2 className="text-lg font-semibold">{booking.practiceGround?.name}</h2>
                    <p className="text-sm text-gray-600">{booking.practiceGround?.location?.address}</p>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(booking.date).toLocaleDateString()}
                </div>
                <div>
                    <span className="font-medium">Time:</span>{" "}
                    {booking.startTime} - {booking.endTime}
                </div>
                <div>
                    <span className="font-medium">Group Size:</span> {booking.groupSize}
                </div>
                <div>
                    <span className="font-medium">Booking Type:</span> {booking.bookingType}
                </div>
                <div>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${booking.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {booking.status}
                    </span>
                </div>
            </div>

            <Separator className="my-4" />

            {/* User Info */}
            <div>
                <h3 className="font-medium mb-2">User</h3>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {booking.user.avatar ? (
                            <Image
                                src={booking.user.avatar}
                                alt={booking.user.username}
                                height={500}
                                width={500}
                                className="w-10 h-10 rounded-full object-cover"
                                priority
                            />
                        ) : (
                            <span className="text-gray-500 text-xs text-center">No Img</span>
                        )}
                    </div>
                    <div>
                        <p className="font-medium">{booking.user.username}</p>
                        <p className="text-xs text-gray-600">{booking.user.email}</p>
                    </div>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Equipment Rentals */}
            {booking.equipmentRental?.length > 0 && (
                <div>
                    <h3 className="font-medium mb-2">Equipment Rentals</h3>
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">Item</th>
                                <th className="p-2 text-center">Matches</th>
                                <th className="p-2 text-center">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {booking.equipmentRental.map((item: any, idx: number) => (
                                <tr key={idx} className="border-t">
                                    <td className="p-2">{item.itemName}</td>
                                    <td className="p-2 text-center">{item.match}</td>
                                    <td className="p-2 text-center">${item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Separator className="my-4" />

            {/* Pricing */}
            <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span>Ground Rent:</span>
                    <span>${booking.groundRentPrice}</span>
                </div>
                <div className="flex justify-between">
                    <span>Equipment Rent:</span>
                    <span>${booking.equipmentRentPrice}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${booking.totalAmount}</span>
                </div>
            </div>
        </DialogContent>
    );
};

export default BookingModal;