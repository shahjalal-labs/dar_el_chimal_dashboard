/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGetSingleEventQuery, useUpdateEventMutation } from '@/redux/api/eventOrganizer/event';
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { GrUpload } from 'react-icons/gr';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { Separator } from '../ui/separator';
import { PiSpinner } from 'react-icons/pi';
import { toast } from 'sonner';
import { SyncLoader } from 'react-spinners';
import { useGetAllSubCategoriesQuery } from '@/redux/api/admin/subCategory';
import { useGetAllTeamsQuery } from '@/redux/api/eventOrganizer/team';
import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';

interface FormState {
    title: string;
    description: string;
    date: Date | undefined;
    location: {
        type: string;
        address: string;
        coordinates: [string, string];
    };
    categoryId: string,
    homeTeamId: string,
    awayTeamId: string,
    vipTicketsPrice: string | number;
    vipTicketsSold: string | number;
    economyTicketsPrice: string | number;
    economyTicketsSold: string | number;
    totalTicketsSold: string | number;
    countryCode: string;
    eventImages: File[];
    matchImages: File[];
}

type CountryType = {
    code: string;
    name: string;
    flag: string;
};

const countryOptions = [
    { code: "BH", name: "Bahrain", flag: "https://flagcdn.com/w40/bh.png" },
    { code: "QA", name: "Qatar", flag: "https://flagcdn.com/w40/qa.png" },
    { code: "SA", name: "Saudi Arabia", flag: "https://flagcdn.com/w40/sa.png" },
    { code: "KW", name: "Kuwait", flag: "https://flagcdn.com/w40/kw.png" },
    { code: "AE", name: "United Arab Emirates", flag: "https://flagcdn.com/w40/ae.png" },
    { code: "OM", name: "Oman", flag: "https://flagcdn.com/w40/om.png" },
    { code: "TR", name: "Turkey", flag: "https://flagcdn.com/w40/tr.png" },
    { code: "TN", name: "Tunisia", flag: "https://flagcdn.com/w40/tn.png" },
    { code: "MA", name: "Morocco", flag: "https://flagcdn.com/w40/ma.png" },
    { code: "BD", name: "Bangladesh", flag: "https://flagcdn.com/w40/bd.png" },
    { code: "GB", name: "United Kingdom", flag: "https://flagcdn.com/w40/gb.png" },
    { code: "US", name: "United States", flag: "https://flagcdn.com/w40/us.png" },
];

const findCountry = (code?: string): CountryType =>
    countryOptions.find(c => c.code === code) ?? countryOptions[0];

const UpdateEventModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSingleEventQuery(id);
    const closeRef = useRef<HTMLButtonElement>(null);
    const [selected, setSelected] = useState<CountryType>(countryOptions[0]);
    const [formData, setFormData] = useState<FormState>({
        title: "",
        description: "",
        date: undefined,
        location: {
            type: "Point",
            address: "",
            coordinates: ["", ""],
        },
        categoryId: "",
        homeTeamId: "",
        awayTeamId: "",
        vipTicketsPrice: "",
        vipTicketsSold: "",
        economyTicketsPrice: "",
        economyTicketsSold: "",
        totalTicketsSold: "",
        countryCode: "",
        eventImages: [],
        matchImages: [],
    });

    useEffect(() => {
        if (data?.result) {
            const countryObj = findCountry(data.result.countryCode);
            setFormData({
                title: data.result.title || "",
                description: data.result.description || "",
                date: data.result.date || undefined,
                location: {
                    type: "Point",
                    address: "",
                    coordinates: ["", ""],
                },
                categoryId: data?.result?.category?.id || "",
                homeTeamId: data?.result?.eventsAsHome?.id || "",
                awayTeamId: data?.result?.eventsAsAway?.id || "",
                vipTicketsPrice: data.result.vipTicketsPrice?.toString() || "",
                vipTicketsSold: data.result.vipTicketsSold?.toString() || "",
                economyTicketsPrice: data.result.economyTicketsPrice?.toString() || "",
                economyTicketsSold: "",
                totalTicketsSold: "",
                countryCode: countryObj.code,
                eventImages: data.result.imageUrl ? [data.result.imageUrl] : [],
                matchImages: [
                    data.result.eventsAsHome?.logoUrl || "",
                    data.result.eventsAsAway?.logoUrl || "",
                ].filter(Boolean),
            });
        }
    }, [data]);

    const { data: categoryData } = useGetAllSubCategoriesQuery(undefined);
    const { data: teamsData } = useGetAllTeamsQuery(undefined);
    const [UpdateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

    const categories = categoryData?.result?.map((category: any) => ({
        id: category.id,
        name: category.name,
    }));

    const teams = teamsData?.result?.teams?.map((team: any) => ({
        id: team.id,
        name: team.name,
    }));

    const onChange: DatePickerProps<Dayjs>["onChange"] = (date) => {
        if (date) {
            const jsDate = date.hour(15).minute(0).second(0).millisecond(0).toDate();
            setFormData((prev) => ({ ...prev, date: jsDate }))
        }
    };

    const handleChange = (
        value: string | number | Date | undefined,
        field: keyof FormState,
        nested?: "location"
    ) => {
        if (nested === "location") {
            setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, [field]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value as any }));
        }
    };

    const handleEventImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData((prev) => ({
                ...prev,
                eventImages: [...prev.eventImages, ...Array.from(e.target.files!)]
            }));
        }
    };

    const handleMatchImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData((prev) => ({
                ...prev,
                matchImages: [...prev.matchImages, ...Array.from(e.target.files!)]
            }));
        }
    };

    const removeEventImage = (index: number) =>
        setFormData((prev) => ({
            ...prev,
            eventImages: prev.eventImages.filter((_, i) => i !== index),
        }));

    const removeMatchImage = (index: number) =>
        setFormData((prev) => ({
            ...prev,
            matchImages: prev.matchImages.filter((_, i) => i !== index),
        }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            location: {
                type: "Point",
                address: "123 Sunset Blvd, Dhaka, Bangladesh",
                coordinates: ["90.4125", "23.8103"]
            },
            vipTicketsPrice: Number(formData.vipTicketsPrice),
            vipTicketsSold: Number(formData.vipTicketsSold),
            economyTicketsPrice: Number(formData.economyTicketsPrice),
            economyTicketsSold: Number(formData.economyTicketsSold),
            totalTicketsSold: Number(formData.totalTicketsSold),
            categoryId: formData.categoryId,
            homeTeamId: formData.homeTeamId,
            awayTeamId: formData.awayTeamId,
            countryCode: formData.countryCode,
        };

        const eventData = new FormData();
        eventData.append('bodyData', JSON.stringify(payload));

        formData.eventImages.forEach((file) => {
            eventData.append('eventImage', file);
        });

        formData.matchImages.forEach((file) => {
            eventData.append('matchImage', file);
        });

        try {
            const response = await UpdateEvent({ id, eventData }).unwrap();
            if (response.success) {
                toast.success(response.message);
                closeRef.current?.click();
            }
        } catch (err) {
            toast.warning((err as any)?.data?.message || "Something went wrong");
        }
    };

    if (isLoading) {
        return (
            <DialogContent className="p-10" showCloseButton>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-[#FF6B00]">Data is Loading</span>
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

    return (
        <DialogContent className="min-w-2xs md:min-w-xl lg:min-w-3xl max-h-[80vh] overflow-y-auto p-6" showCloseButton>
            <DialogClose ref={closeRef} className="hidden" />
            <DialogHeader>
                <DialogTitle className="text-xl font-bold">Update Event</DialogTitle>
                <DialogDescription>Fill out the form below to update the event.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Event Name */}
                <div>
                    <Label>Event Name</Label>
                    <Input
                        placeholder="Enter event name"
                        value={formData.title}
                        onChange={(e) => handleChange(e.target.value, "title")}
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <Textarea
                        placeholder="Enter description here..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleChange(e.target.value, "description")}
                        required
                    />
                </div>

                {/* Event Images */}
                <div>
                    <Label>Event Images</Label>
                    <label>
                        <div className="border border-dashed rounded-lg p-10 mt-2 flex flex-col items-center gap-2 cursor-pointer">
                            <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleEventImageUpload}
                                className="hidden"
                            />
                            <GrUpload className="h-8 w-8 m-auto text-gray-400" />
                            <span className="text-center text-gray-400">Upload image</span>
                        </div>
                    </label>
                    {formData.eventImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {formData.eventImages.map((file, idx) => (
                                <div key={idx} className="relative">
                                    <Image
                                        src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                        height={100}
                                        width={100}
                                        alt={`event-${idx}`}
                                        className="w-full h-full object-cover rounded"
                                        priority
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-1 right-1 text-xs px-2 py-1"
                                        onClick={() => removeEventImage(idx)}
                                    >
                                        X
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-2">
                    {/* Event Date */}
                    <div>
                        <Label className="mb-2">Event Date</Label>
                        <DatePicker
                            onChange={onChange}
                            needConfirm
                            className="border border-[#d9d0d0] bg-white rounded-md px-4 py-2.5 h-10 w-full mt-2 text-sm text-black"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <Label>Select Category</Label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => handleChange(e.target.value, "categoryId")}
                            className="border border-[#d9d0d0] bg-white rounded-md px-4 py-2.5 w-full mt-2 text-sm"
                            required
                        >
                            {
                                categories?.map((category: any, idx: number) => (
                                    <option value={category?.id} key={idx}>{category?.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-2">
                    {/* Home Team */}
                    <div>
                        <Label>Select Home Team</Label>
                        <select
                            value={formData.homeTeamId}
                            onChange={(e) => handleChange(e.target.value, "homeTeamId")}
                            className="border border-[#d9d0d0] bg-white rounded-md px-4 py-2.5 w-full mt-2 text-sm"
                            required
                        >
                            {
                                teams?.map((team: any, idx: number) => (
                                    <option value={team?.id} key={idx}>{team?.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Away Team */}
                    <div>
                        <Label>Select Away Team</Label>
                        <select
                            value={formData.awayTeamId}
                            onChange={(e) => handleChange(e.target.value, "awayTeamId")}
                            className="border border-[#d9d0d0] bg-white rounded-md px-4 py-2.5 w-full mt-2 text-sm"
                            required
                        >
                            {
                                teams?.map((team: any, idx: number) => (
                                    <option value={team?.id} key={idx}>{team?.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                {/* Ticket Prices */}
                <div className="grid md:grid-cols-2 gap-2">
                    <div>
                        <Label>VIP Tickets Price ($)</Label>
                        <Input
                            type="number"
                            placeholder="00"
                            min={1}
                            value={formData.vipTicketsPrice}
                            onChange={(e) => handleChange(e.target.value, "vipTicketsPrice")}
                        />
                    </div>
                    <div>
                        <Label>VIP Tickets Sold</Label>
                        <Input
                            type="number"
                            placeholder="00"
                            min={0}
                            value={formData.vipTicketsSold}
                            onChange={(e) => handleChange(e.target.value, "vipTicketsSold")}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-2">
                    <div>
                        <Label>Economy Tickets Price ($)</Label>
                        <Input
                            type="number"
                            placeholder="00"
                            min={1}
                            value={formData.economyTicketsPrice}
                            onChange={(e) => handleChange(e.target.value, "economyTicketsPrice")}
                        />
                    </div>
                    <div>
                        <Label>Economy Tickets Sold</Label>
                        <Input
                            type="number"
                            placeholder="00"
                            min={0}
                            value={formData.economyTicketsSold}
                            onChange={(e) => handleChange(e.target.value, "economyTicketsSold")}
                        />
                    </div>
                </div>

                <div className="md:flex justify-between gap-4">
                    <div className="md:w-1/2">
                        <Label>Total Tickets Sold</Label>
                        <Input
                            type="number"
                            placeholder="00"
                            min={0}
                            value={formData.totalTicketsSold}
                            onChange={(e) => handleChange(e.target.value, "totalTicketsSold")}
                        />
                    </div>


                    {/* Country */}
                    <div className="md:w-1/2 mt-2 md:mt-0">
                        <Label>Country</Label>
                        <Select
                            value={formData.countryCode}
                            onValueChange={(code) => {
                                const country = findCountry(code);
                                setSelected(country);
                                handleChange(code, 'countryCode');
                            }}
                        >
                            <SelectTrigger className="mt-2 px-4 py-2.5">
                                <div className="flex justify-start items-center gap-2">
                                    <Image
                                        src={selected.flag}
                                        height={50}
                                        width={50}
                                        alt={selected.name}
                                        className="w-5 h-4"
                                        loading="lazy"
                                    />
                                    <span>{selected.name}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {countryOptions.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={country.flag}
                                                height={50}
                                                width={50}
                                                alt={country.name}
                                                className="w-5 h-4"
                                                loading="lazy"
                                            />
                                            <span>{country.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator />

                {/* Match Images */}
                <div>
                    <Label>Match Images</Label>
                    <label>
                        <div className="border border-dashed rounded-lg p-10 mt-2 flex flex-col items-center gap-2 cursor-pointer">
                            <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleMatchImageUpload}
                                className="hidden"
                            />
                            <GrUpload className="h-8 w-8 m-auto text-gray-400" />
                            <span className="text-center text-gray-400">Upload image</span>
                        </div>
                    </label>
                    {formData.matchImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {formData.matchImages.map((file, idx) => (
                                <div key={idx} className="relative">
                                    <Image
                                        src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                        height={100}
                                        width={100}
                                        alt={`match-${idx}`}
                                        className="w-full h-full object-cover rounded"
                                        priority
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-1 right-1 text-xs px-2 py-1"
                                        onClick={() => removeMatchImage(idx)}
                                    >
                                        X
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="pt-4">
                    <Button type="submit" className="w-full bg-[#FF6B00] hover:bg-[#FF6B00CC]">
                        {isUpdating ? (
                            <div className="flex justify-center items-center gap-2">
                                Updating...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div>
                        ) : (
                            <span>Update Event</span>
                        )}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default UpdateEventModal;