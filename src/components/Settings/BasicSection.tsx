/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { ChevronDownIcon, Info } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import Image from 'next/image';
import { MdEdit } from 'react-icons/md';
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from '@/redux/api/settingsApi';
import user from '@/assets/User.png';
import { toast } from 'sonner';
import { ImageUploader } from '../ui/ImageUploader';
import { PiSpinner } from 'react-icons/pi';
import { SyncLoader } from 'react-spinners';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';

interface ProfileData {
    profileImage: string,
    fullName: string,
    email: string,
    phone: string,
    role: string,
    gender: string,
    DOB: string,
    userName: string,
    status: string,
}

const BasicSection = () => {
    const [open, setOpen] = React.useState(false)
    const [active, setActive] = React.useState(false)
    const [profile, setProfile] = useState<ProfileData>({
        profileImage: "",
        fullName: "",
        email: "",
        phone: "",
        role: "",
        gender: "",
        DOB: "",
        userName: "",
        status: "",
    })

    const { data, isLoading } = useGetMyProfileQuery(undefined);

    console.log(data?.result);

    useEffect(() => {
        if (data?.result) {
            setProfile({
                profileImage: data?.result?.profileImage || "",
                fullName: data?.result?.fullName || "",
                email: data?.result?.email || "",
                phone: data?.result?.phone || "",
                role: data?.result?.role || "",
                gender: data?.result?.gender || "",
                DOB: data?.result?.DOB || "",
                userName: data?.result?.loginUserName || "",
                status: data?.result?.status || "",
            })
        }
    }, [data])

    const [updateMyProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation();

    const handleProfileChange = (key: keyof ProfileData, value: string) => {
        setProfile((prev) => ({ ...prev, [key]: value }))
    }
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {

            const body = {
                fullName: profile?.fullName,
                phone: profile?.phone,
                // gender: profile?.gender,
                // DOB: profile?.DOB,
            }

            const response = await updateMyProfile(body).unwrap();
            if (response?.success) {
                toast.success(response?.message);
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="">
            <div className="flex items-center gap-2 border-b border-[#F6F6F6] pb-6 mb-6">
                <h1 className="text-lg font-medium text-[#30373D]">Profile Information</h1>
                <Tooltip>
                    <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Update your profile information</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            {
                isLoading ?
                    <div className="flex justify-center items-center gap-4">
                        <span className="text-[#1E3A8A]">Data is Loading</span>
                        <SyncLoader color='#1E3A8A' />
                    </div> :
                    <Card className='p-0'>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Photo Profile */}
                                <div className='flex items-center gap-10'>
                                    <div>
                                        <Label className="text-sm font-medium text-[#30373D] mb-3 block">Photo Profile</Label>
                                        <div className="relative w-24 h-24 border rounded-lg p-2">
                                            <Image
                                                src={profile.profileImage || user}
                                                height={500}
                                                width={500}
                                                alt={profile.userName}
                                                className='rounded-lg h-full w-full'
                                                priority
                                            />
                                            <button
                                                onClick={() => setActive(true)}
                                                className="absolute -bottom-0 -right-0 rounded-br-sm bg-black/20 p-1.5 hover:bg-gray-50 transition-colors shadow-sm">
                                                <MdEdit className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {active && <ImageUploader />}
                                </div>

                                {/* Full Name */}
                                <div>
                                    <Label htmlFor="full-name" className="text-sm font-medium text-[#30373D]">
                                        Full Name
                                    </Label>
                                    <Input
                                        id="full-name"
                                        type='text'
                                        value={profile.fullName}
                                        onChange={(e) => handleProfileChange("fullName", e.target.value)}
                                        className="mt-2 px-5 py-4"
                                    />
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div className='w-full'>
                                        <Label htmlFor="email" className="text-sm font-medium text-[#30373D]">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            defaultValue={profile.email}
                                            className="mt-2 px-5 py-4"
                                            readOnly
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className='w-full'>
                                        <Label htmlFor="phone" className="text-sm font-medium text-[#30373D]">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            type='tel'
                                            value={profile.phone}
                                            onChange={(e) => handleProfileChange("phone", e.target.value)}
                                            className="mt-2 px-5 py-4"
                                        />
                                    </div>
                                </div>

                                {/* Gender, Role, Date of Birth */}
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                                    <div className='w-full'>
                                        <Label htmlFor="gender" className="text-sm font-medium text-[#30373D]">
                                            Gender
                                        </Label>
                                        <Select
                                            value={profile.gender ? profile.gender : data?.result?.userInfo?.gender}
                                            onValueChange={(value) => handleProfileChange("gender", value)}
                                        >
                                            <SelectTrigger className="mt-2 px-5 py-4 w-full text-black">
                                                <SelectValue placeholder="Select gender..." />
                                                <ChevronDownIcon />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MALE">Male</SelectItem>
                                                <SelectItem value="FEMALE">Female</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className='w-full'>
                                        <Label htmlFor="role" className="text-sm font-medium text-[#30373D]">
                                            Role
                                        </Label>
                                        <Input
                                            id="role"
                                            type="text"
                                            defaultValue={profile.role}
                                            className="mt-2 px-5 py-4"
                                            readOnly
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <Label htmlFor="DOB" className="px-1 text-sm font-medium text-[#30373D]">
                                            Date of birth
                                        </Label>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    id="date"
                                                    className="px-5 py-4 w-full justify-between text-left font-normal"
                                                >
                                                    {profile.DOB ? (
                                                        format(new Date(profile.DOB), "PPP")
                                                    ) : (
                                                        <span>Select date</span>
                                                    )}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={profile.DOB ? new Date(profile.DOB) : undefined}
                                                    onSelect={(date) => {
                                                        handleProfileChange("DOB", date?.toISOString() || "");
                                                        setOpen(false);
                                                    }}
                                                    captionLayout="dropdown"
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                {/* User Name, status  */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    <div className='w-full'>
                                        <Label htmlFor="userName" className="text-sm font-medium text-[#30373D]">
                                            User Name
                                        </Label>
                                        <Input
                                            id="userName"
                                            type="text"
                                            defaultValue={profile.userName}
                                            className="mt-2 px-5 py-4"
                                            readOnly
                                        />
                                    </div>

                                    <div className='w-full'>
                                        <Label htmlFor="status" className="text-sm font-medium text-[#30373D]">
                                            Status
                                        </Label>
                                        <Input
                                            id="status"
                                            type="text"
                                            defaultValue={profile.status}
                                            className="mt-2 px-5 py-4"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8ACC]"
                                    >
                                        {
                                            isUpdating ?
                                                <div className="flex justify-center items-center gap-2">
                                                    Updating...
                                                    <div className="animate-spin">
                                                        <PiSpinner className="h-4 w-4" />
                                                    </div>
                                                </div> :
                                                <span>Update Profile</span>
                                        }
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
            }
        </div>
    );
};

export default BasicSection;