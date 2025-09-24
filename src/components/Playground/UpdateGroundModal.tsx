/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from "react";
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { GrUpload } from "react-icons/gr";
import { useGetSingleGroundQuery, useUpdateGroundMutation } from "@/redux/api/playground/ground";
import { PiSpinner } from "react-icons/pi";
import { toast } from "sonner";
import { useGetMyProfileQuery } from "@/redux/api/settingsApi";
import { SyncLoader } from "react-spinners";
import { useGetAllSubCategoriesQuery } from "@/redux/api/admin/subCategory";

interface Equipment {
    itemName: string;
    pricePerMatch: string | number;
}

interface FormState {
    name: string;
    description: string;
    location: {
        type: string;
        address: string;
        coordinates: [string, string];
    };
    playgroundType: string;
    categoryId: string,
    pricePerHour: string | number;
    maxGroupMembers: string | number;
    startTime: string;
    endTime: string;
    equipmentRentals: Equipment[];
    images: File[];
}

const UpdateGroundModal = ({ id }: { id: string }) => {
    const closeRef = useRef<HTMLButtonElement>(null);

    const { data, isLoading } = useGetSingleGroundQuery(id);
    const { data: categoryData } = useGetAllSubCategoriesQuery(undefined);

    const categories = categoryData?.result?.map((category: any) => ({
        id: category.id,
        name: category.name,
    }));

    const [formData, setFormData] = useState<FormState>({
        name: "",
        description: "",
        location: {
            type: "Point",
            address: "",
            coordinates: ["", ""],
        },
        playgroundType: "OUTDOOR",
        categoryId: "",
        pricePerHour: "",
        maxGroupMembers: "",
        startTime: "",
        endTime: "",
        equipmentRentals: [{ itemName: "", pricePerMatch: "" }],
        images: [],
    });

    useEffect(() => {
        if (data?.result) {
            setFormData({
                name: data.result.name || "",
                description: data.result.description || "",
                location: {
                    type: "Point",
                    address: data.result.location?.address || "",
                    coordinates: [
                        data.result.location?.coordinates?.[0]?.toString() || "",
                        data.result.location?.coordinates?.[1]?.toString() || ""
                    ],
                },
                playgroundType: data.result.playgroundType || "",
                categoryId: data?.result?.categoryId || "",
                pricePerHour: data.result.pricePerHour?.toString() || "",
                maxGroupMembers: data.result.maxGroupMembers?.toString() || "",
                startTime: data.result.openingStartTime || "",
                endTime: data.result.openingEndTime || "",
                equipmentRentals: data.result.equipmentRentals?.length ? [...data.result.equipmentRentals] : [""],
                images: data.result.images?.length ? [...data.result.images] : [""],
            });
        }
    }, [data]);


    const { data: profileData } = useGetMyProfileQuery("");
    const [UpdateGround, { isLoading: isUpdating }] = useUpdateGroundMutation();

    const handleChange = (
        value: string,
        field: keyof FormState,
        nested?: "location"
    ) => {
        if (nested === "location") {
            setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, [field]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    // const handleCoordinateChange = (index: number, value: string) => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         location: {
    //             ...prev.location,
    //             coordinates: prev.location.coordinates.map((c, i) =>
    //                 i === index ? value : c
    //             ) as [string, string],
    //         },
    //     }));
    // };

    const handleEquipmentChange = (index: number, key: keyof Equipment, value: string) => {
        const updated = [...formData.equipmentRentals];
        updated[index][key] = value;
        setFormData({ ...formData, equipmentRentals: updated });
    };

    const removeEquipment = (index: number) => {
        const updated = formData.equipmentRentals.filter((_, i) => i !== index);
        setFormData({ ...formData, equipmentRentals: updated });
    };

    const addEquipment = () => {
        setFormData({
            ...formData,
            equipmentRentals: [...formData.equipmentRentals, { itemName: "", pricePerMatch: "" }],
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...Array.from(e.target.files!)]
            }));
        }
    };

    const removeImage = (index: number) =>
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            description: formData.description,
            location: {
                type: "Point",
                address: "123 Sunset Blvd, Dhaka, Bangladesh",
                coordinates: [
                    "90.4125",
                    "23.8103"
                ]
            },
            playgroundType: formData.playgroundType,
            pricePerHour: formData.pricePerHour,
            maxGroupMembers: formData.maxGroupMembers,
            categoryId: formData.categoryId,
            createdById: profileData?.result?.userInfo?.id,
            startTime: formData.startTime,
            endTime: formData.endTime,
            equipmentRentals: formData.equipmentRentals.map((item) => ({
                itemName: item.itemName,
                pricePerMatch: item.pricePerMatch,
            })),
            images: formData.images
        };

        const groundData = new FormData();
        groundData.append('bodyData', JSON.stringify(payload))

        formData.images.forEach((file) => {
            groundData.append('practiceGroundImage', file);
        });

        try {
            const response = await UpdateGround({ id, groundData }).unwrap();
            if (response.success) {
                toast.success(response.message)
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
                <DialogTitle className="text-xl font-bold">Update New Playground</DialogTitle>
                <DialogDescription>
                    Fill out the form below to update the playground.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Name */}
                <div>
                    <Label>Name</Label>
                    <Input
                        placeholder="Enter ground name"
                        value={formData.name}
                        onChange={(e) => handleChange(e.target.value, "name")}
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <Textarea
                        placeholder="Enter description here..."
                        value={formData.description}
                        onChange={(e) => handleChange(e.target.value, "description")}
                        required
                    />
                </div>

                <Separator />

                {/* Address */}
                {/* <div>
                    <Label>Address</Label>
                    <Input
                        placeholder="Enter ground's address"
                        value={formData.location.address}
                        onChange={(e) => handleChange(e.target.value, "address", "location")}
                        required
                    />
                </div> */}

                {/* Coordinates */}
                {/* <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label>Longitude</Label>
                        <Input
                            value={formData.location.coordinates[0]}
                            onChange={(e) => handleCoordinateChange(0, e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label>Latitude</Label>
                        <Input
                            value={formData.location.coordinates[1]}
                            onChange={(e) => handleCoordinateChange(1, e.target.value)}
                            required
                        />
                    </div>
                </div> */}

                {/* Playground Type */}
                <div>
                    <Label>Playground Type</Label>
                    <select
                        value={formData.playgroundType}
                        onChange={(e) => handleChange(e.target.value, "playgroundType")}
                        className="border border-[#d9d0d0] bg-white rounded-lg px-4 py-2.5 w-full mt-2"
                        required
                    >
                        <option value="INDOOR">Indoor</option>
                        <option value="OUTDOOR">Outdoor</option>
                    </select>
                </div>

                {/* Category */}
                <div>
                    <Label>Select Category</Label>
                    <select
                        value={formData.categoryId}
                        onChange={(e) => handleChange(e.target.value, "categoryId")}
                        className="border border-[#d9d0d0] bg-white rounded-lg px-4 py-2.5 w-full mt-2"
                        required
                    >
                        {
                            categories?.map((category: any, idx: number) => (
                                <option value={category?.id} key={idx}>{category?.name}</option>
                            ))
                        }
                    </select>
                </div>

                {/* Price & Members */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label>Price per hour ($)</Label>
                        <Input
                            type="number"
                            min={1}
                            step={1}
                            placeholder="00"
                            value={formData.pricePerHour}
                            onChange={(e) => handleChange(e.target.value, "pricePerHour")}
                            required
                        />
                    </div>
                    <div>
                        <Label>Max Group Members</Label>
                        <Input
                            type="number"
                            min={1}
                            step={1}
                            placeholder="00"
                            value={formData.maxGroupMembers}
                            onChange={(e) => handleChange(e.target.value, "maxGroupMembers")}
                            required
                        />
                    </div>
                </div>

                {/* Opening Hours */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label>Start Time</Label>
                        <div className="mt-2">
                            <TimePicker
                                format="HH:mm"
                                value={formData.startTime ? dayjs(formData.startTime, "HH:mm") : null}
                                onChange={(time) => handleChange(time ? time.format("HH:mm") : "", "startTime")}
                                className="w-full mt-2 h-10 rounded-lg"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>End Time</Label>
                        <div className="mt-2">
                            <TimePicker
                                format="HH:mm"
                                value={formData.endTime ? dayjs(formData.endTime, "HH:mm") : null}
                                onChange={(time) => handleChange(time ? time.format("HH:mm") : "", "endTime")}
                                className="w-full mt-2 h-10 rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Equipment Rentals */}
                <div>
                    <Label>Equipment Rentals</Label>
                    {formData.equipmentRentals.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                            <Input
                                placeholder="Item Name"
                                value={item.itemName}
                                onChange={(e) => handleEquipmentChange(idx, "itemName", e.target.value)}
                                required
                            />
                            <Input
                                type="number"
                                min={1}
                                step={1}
                                placeholder="Price per match"
                                value={item.pricePerMatch}
                                onChange={(e) => handleEquipmentChange(idx, "pricePerMatch", e.target.value)}
                                required
                            />
                            {formData.equipmentRentals.length > 1 && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeEquipment(idx)}
                                    className="mt-2"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="secondary" onClick={addEquipment}>
                        Add Equipment
                    </Button>
                </div>

                <Separator />

                {/* Images */}
                <div>
                    <Label>Ground Images</Label>
                    <label>
                        <div className="border border-dashed rounded-lg p-10 mt-2 flex flex-col items-center gap-2">
                            <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <GrUpload className="h-8 w-8 m-auto text-gray-400" />
                            <span className="text-center text-gray-400">Upload image</span>
                        </div>
                    </label>
                    {formData.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {formData.images.map((file, idx) => (
                                <div key={idx} className="relative">
                                    <Image
                                        src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                        height={100}
                                        width={100}
                                        alt={`preview-${idx}`}
                                        className="w-full h-full object-cover rounded"
                                        priority
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-1 right-1 text-xs px-2 py-1"
                                        onClick={() => removeImage(idx)}
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
                    <Button
                        type="submit"
                        className="w-full bg-[#FF6B00] hover:bg-[#FF6B00CC]"
                    >
                        {
                            isUpdating ?
                                <div className="flex justify-center items-center gap-2">
                                    Updating...
                                    <div className="animate-spin">
                                        <PiSpinner className="h-4 w-4" />
                                    </div>
                                </div> :
                                <span>Update Playground</span>
                        }
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default UpdateGroundModal;