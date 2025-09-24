'use client';

import React, { useEffect, useState } from 'react';
import { useGetBookingListQuery } from '@/redux/api/admin/stat';
import DataTable from '../Common/DataTable';
import { Button } from '../ui/button';
import Pagination from '../ui/pagination';
import Image from 'next/image';
import user from '@/assets/User.png';
import product from '@/assets/default.png';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

const ManageOrder = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [category, setCategory] = useState('PLAYGROUND');
    const [orderData, setOrderData] = useState([]);
    const { data } = useGetBookingListQuery({ currentPage, category })

    useEffect(() => {
        if (category === 'PLAYGROUND') {
            const formattedData = data?.result?.data?.map((entry: {
                id: string,
                date: string,
                startTime: string,
                endTime: string,
                groupSize: number,
                equipmentRental: { itemName: string, match: number, price: number }[],
                bookingType: string,
                status: string,
                groundRentPrice: number,
                equipmentRentPrice: number,
                totalAmount: number,
                createdAt: string,
                updatedAt: string,
                user: { username: string, email: string, avatar: string | null },
                practiceGround: { name: string, location: { address: string }, images: string[] }
            }) => ({
                "Id": entry.id,
                "User": (
                    <div className="flex items-center gap-2 w-[200px]">
                        <Image
                            src={entry.user?.avatar || user}
                            alt={entry.user.username}
                            height={100}
                            width={100}
                            className="w-8 h-8 rounded-full object-cover"
                            priority
                        />
                        <div>
                            <span>{entry.user.username}</span> <br />
                            <small>{entry.user.email}</small>
                        </div>
                    </div>
                ),
                "Ground": (
                    <div className="flex items-center gap-2 w-[250px]">
                        <Image
                            src={entry.practiceGround?.images?.[0] || product}
                            alt={entry.practiceGround?.name}
                            height={100}
                            width={100}
                            className="w-10 h-10 rounded-lg object-cover"
                            priority
                        />
                        <div>
                            <span>{entry.practiceGround?.name}</span> <br />
                            <small>{entry.practiceGround?.location?.address}</small>
                        </div>
                    </div>
                ),
                "Date": new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                "Time Slot": `${entry.startTime} - ${entry.endTime}`,
                "Group Size": entry.groupSize,
                "Equipment": entry.equipmentRental.length
                    ? entry.equipmentRental.map(eq => `${eq.itemName} (x${eq.match}) - $${eq.price}`).join(", ")
                    : "None",
                "Booking Type": entry.bookingType,
                "Ground Rent": `$${entry.groundRentPrice}`,
                "Equipments Rent": `$${entry.equipmentRentPrice}`,
                "Total Amount": `$${entry.totalAmount}`,
                "Booked At": new Date(entry.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                "Updated At": new Date(entry.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                "Status": (
                    <button
                        className={`${entry.status === 'ACTIVE'
                            ? 'bg-green-600'
                            : entry.status === 'PENDING'
                                ? 'bg-yellow-500'
                                : 'bg-gray-500'
                            } text-white px-3 py-1.5 rounded-2xl`}
                    >
                        {entry.status}
                    </button>
                ),
            }));
            setOrderData(formattedData)
        }
        if (category === 'EVENT') {
            const formattedData = data?.result?.data?.map((entry: {
                id: string,
                ticketType: string,
                ticketCount: number,
                totalAmount: number,
                status: string,
                createdAt: string,
                updatedAt: string,
                user: { username: string, email: string, avatar: string | null },
                event: { title: string, date: string }
            }) => ({
                "Id": entry.id,
                "User": (
                    <div className="flex items-center gap-2">
                        <Image
                            src={entry.user?.avatar || user}
                            alt={entry.user.username}
                            height={100}
                            width={100}
                            className="w-8 h-8 rounded-full object-cover"
                            priority
                        />
                        <div>
                            <span>{entry.user.username}</span> <br />
                            <small>{entry.user.email}</small>
                        </div>
                    </div>
                ),
                "Event": entry?.event?.title,
                "Event Date": new Date(entry?.event?.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                "Ticket Type": entry.ticketType,
                "Ticket Count": entry.ticketCount,
                "Total Amount": `$${entry.totalAmount}`,
                "Booked At": new Date(entry.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                "Updated At": new Date(entry.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                "Status": (
                    <button
                        className={`${entry.status === 'PENDING'
                            ? 'bg-yellow-500'
                            : entry.status === 'ACTIVE'
                                ? 'bg-green-600'
                                : 'bg-gray-500'
                            } text-white px-3 py-1.5 rounded-2xl`}
                    >
                        {entry.status}
                    </button>
                ),
            }));
            setOrderData(formattedData)
        }
        if (category === 'E_COMMERCE') {
            const formattedData = data?.result?.data?.map((entry: {
                id: string,
                productId: string,
                userId: string,
                quantity: number,
                totalAmount: number,
                deliveryType: string,
                paymentType: string,
                status: string,
                createdAt: string,
                updatedAt: string,
                product: { name: string, imageUrl: string, id: string },
                user: { id: string, avatar: string | null, username: string }
            }) => ({
                "Id": entry.id,
                "User": (
                    <div className="flex items-center gap-2">
                        <Image
                            src={entry.user?.avatar || user}
                            alt={entry.user.username}
                            height={100}
                            width={100}
                            className="w-8 h-8 rounded-full object-cover"
                            priority
                        />
                        <span>{entry.user.username}</span>
                    </div>
                ),
                "Product": (
                    <div className="flex items-center gap-2">
                        <Image
                            src={entry.product?.imageUrl || product}
                            alt={entry.product?.name}
                            height={100}
                            width={100}
                            className="w-10 h-10 rounded-lg object-cover"
                            priority
                        />
                        <span>{entry.product?.name}</span>
                    </div>
                ),
                "Quantity": entry.quantity,
                "Total Amount": `$${entry.totalAmount}`,
                "Delivery Type": entry?.deliveryType?.replace("_", " "),
                "Payment Type": entry?.paymentType?.replace("_", " "),
                "Booked At": new Date(entry.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                "Updated At": new Date(entry.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                "Status": (
                    <button
                        className={`${entry.status === 'ACTIVE'
                            ? 'bg-green-600'
                            : entry.status === 'PENDING'
                                ? 'bg-yellow-500'
                                : 'bg-gray-500'
                            } text-white px-3 py-1.5 rounded-2xl`}
                    >
                        {entry.status}
                    </button>
                ),
            }));
            setOrderData(formattedData)
        }
    }, [data, category])


    return (
        <div className=''>
            <DataTable
                title="All Orders"
                data={orderData}
                isButton={false}
                currentPage={currentPage}
                sort={
                    <Select
                        value={category}
                        onValueChange={(value) => setCategory(value)}
                    >
                        <SelectTrigger
                            className="flex justify-center items-center rounded-lg gap-1 px-4 py-2 transition-colors ease-in-out duration-500 cursor-pointer bg-[#cdc7c31A] text-black/70 border-none"
                        >{category}</SelectTrigger>
                        <SelectContent>
                            <SelectItem value='PLAYGROUND'>Playground Vendor</SelectItem>
                            <SelectItem value='EVENT'>Event Organizer</SelectItem>
                            <SelectItem value='E_COMMERCE'>E-commerce Vendor</SelectItem>
                        </SelectContent>
                    </Select>
                }
            />

            <div className='flex flex-col md:flex-row justify-between items-center gap-6 mt-8'>
                <div className='text-base text-[#4A4A4A] flex items-center justify-start gap-2'>
                    <span>Show</span>
                    <Button
                        variant="default"
                        size="icon"
                        className="h-8 w-8 rounded-none bg-[#FF6B001A] text-[#FF6B00] hover:bg-[#FF6B001A]"
                    >
                        {orderData?.length}
                    </Button>
                    <span>from {data?.result?.meta?.total}</span>
                </div>
                <Pagination totalPage={data?.result?.meta?.totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
            </div>
        </div>
    );
};

export default ManageOrder;