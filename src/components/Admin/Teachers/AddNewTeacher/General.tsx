/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RootState } from '@/redux/store/store';
import Image from 'next/image';
import Link from 'next/link';
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import uploadImg from '@/assets/uploadImg.svg';
import { setActiveBookTab } from '@/redux/features/uiSlice';
import { setEmail, setPassword, setPreviewTeacherPhoto, setTeacherName, setTeacherPhoto, setUserName } from '@/redux/features/teacherSlice';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

const General = () => {
    const [showPassword, setShowPassword] = useState(false);
    const pathname = usePathname();
    const dispatch = useDispatch();
    const {
        teacherName,
        userName,
        password,
        email,
        previewTeacherPhoto
    } = useSelector((state: RootState) => state.teacher);

    const handleImageChange = (file: File | null) => {
        if (file) {
            const imgURL = URL.createObjectURL(file);
            dispatch(setPreviewTeacherPhoto(imgURL));
            dispatch(setTeacherPhoto(file));
        } else {
            dispatch(setPreviewTeacherPhoto(''));
            dispatch(setTeacherPhoto(null));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (pathname === '/admin/schools') {
            // const body =
            // {
            //     schoolData: {
            //         name: schoolName,
            //         location: address,
            //         teacherCount: Number(teacherCount),
            //         studentsCount: Number(studentCount),
            //         activeStudents: Number(activeStudents),
            //         activeTeachers: Number(activeTeachers),
            //     }
            // }

            // const formData = new FormData();
            // formData.append('bodyData', JSON.stringify(body))

            // if (schoolPhoto) {
            //     formData.append('schoolLogo', schoolPhoto)
            // }

            // try {
            //     const response = await UpdateSchool({ id, formData }).unwrap();
            //     if (response.success) {
            //         toast.success(response.message);
            //         dispatch(setSchoolName(''))
            //         dispatch(setAddress(''))
            //         dispatch(setTeacherCount(0))
            //         dispatch(setActiveTeachers(0))
            //         dispatch(setStudentCount(0))
            //         dispatch(setActiveStudents(0))
            //         dispatch(setPreviewSchoolPhoto(''))
            //         dispatch(setActiveBookTab("grade"));
            //     }
            // } catch (error) {
            //     toast.warning((error as any)?.data?.message || "Something went wrong");
            // }
        }
        else {
            dispatch(setActiveBookTab("grade"));
        }
    };

    const isButtonDisabled =
        !teacherName || !userName || !password || !email || !previewTeacherPhoto;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Teacher Name */}
            <div>
                <Label>Teacher Name</Label>
                <Input
                    type="text"
                    placeholder="Enter teacher name"
                    value={teacherName}
                    onChange={(e) => dispatch(setTeacherName(e.target.value))}
                    className=""
                    required
                />
            </div>

            {/* User Name & Password */}
            <div className="flex gap-6">
                <div className="flex-1">
                    <Label>User Name</Label>
                    <Input
                        type="text"
                        placeholder="Enter user name"
                        value={userName}
                        onChange={(e) => dispatch(setUserName(e.target.value))}
                        className=""
                        required
                    />
                </div>
                <div className="flex-1 relative">
                    <Label>Password</Label>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => dispatch(setPassword(e.target.value))}
                        className="pr-10" // gives space for the icon
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

            </div>

            {/* Email */}
            <div>
                <Label>Email</Label>
                <Input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                    className=""
                    required
                />
            </div>

            {/* Upload Teacher Photo */}
            <div className="flex-1">
                <Label className="font-medium mb-2.5">
                    Upload Teacher Photo<span className="text-red-600">*</span>
                </Label>

                {!previewTeacherPhoto ? (
                    <label htmlFor="teacherPhoto">
                        <div className="border border-dashed border-[#CBD5E1] rounded-lg px-6 py-8 w-full cursor-pointer">
                            <input
                                id="teacherPhoto"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                                className="hidden"
                            />
                            <div className="flex flex-col items-center gap-2">
                                <Image src={uploadImg} height={40} width={40} alt="Upload" />
                                <p className="text-[#636F85] text-center mt-1">
                                    Drag and drop or{" "}
                                    <span className="text-[#2A66FF] underline">browse</span>
                                </p>
                            </div>
                        </div>
                    </label>
                ) : (
                    <div className="flex justify-center relative w-fit mx-auto group">
                        <div
                            onClick={() => handleImageChange(null)}
                            className="bg-[#bdbfc4]/60 rounded-full p-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <RxCross1 className="h-3 w-3" />
                        </div>
                        <Image
                            src={previewTeacherPhoto}
                            height={200}
                            width={300}
                            alt="Preview"
                            className="w-full h-[200px] object-cover rounded-md"
                        />
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-3 pt-3">
                <Link href="/admin/teachers">
                    <Button
                        variant="outline"
                        className="px-6 border-[#636F85] text-[#636F85]"
                    >
                        Cancel
                    </Button>
                </Link>

                <Button
                    type="submit"
                    disabled={isButtonDisabled}
                    className={`px-6 text-white font-medium border border-[#1E3A8A] transition-all duration-300 ${isButtonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"
                        }`}
                >
                    Save & Continue
                </Button>
            </div>
        </form>
    );
};

export default General;