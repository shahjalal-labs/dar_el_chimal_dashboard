/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setActiveBookTab } from "@/redux/features/uiSlice";
import uploadImg from "@/assets/uploadImg.svg";
import {
    setPreviewStudentPhoto,
    setStudentName,
    setStudentPassword,
    setStudentPhoto,
    setStudentUserName,
} from "@/redux/features/studentSlice";
import { useGetStudentDetailsQuery, useUpdateStudentMutation } from "@/redux/api/student";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { PiSpinner } from "react-icons/pi";

const General = ({ id }: { id: string }) => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const { studentName, studentUserName, studentPassword, previewStudentPhoto, studentPhoto } = useSelector((state: RootState) => state.student);

    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    const { data } = useGetStudentDetailsQuery(id);
    const [UpdateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

    useEffect(() => {
        if (pathname === '/admin/students' && data?.result) {
            dispatch(setStudentName(data?.result?.fullName));
            dispatch(setStudentUserName(data?.result?.loginUserName));
            dispatch(setPreviewStudentPhoto(data?.result?.profileImage));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const handleImageChange = (file: File | null) => {
        if (file) {
            const imgURL = URL.createObjectURL(file);
            setObjectUrl(imgURL);
            dispatch(setPreviewStudentPhoto(imgURL));
            dispatch(setStudentPhoto(file));
        } else {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            setObjectUrl(null);
            dispatch(setPreviewStudentPhoto(""));
            dispatch(setStudentPhoto(null));
        }
    };

    useEffect(() => {
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [objectUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pathname === '/admin/students') {
            const body = {
                userData:
                {
                    loginUserName: studentUserName,
                    fullName: studentName,
                },
                gradeData: {}
            }

            const formData = new FormData();
            formData.append('bodyData', JSON.stringify(body))
            if (studentPhoto) {
                formData.append('profileImage', studentPhoto)
            }

            try {
                const response = await UpdateStudent({ id, formData }).unwrap();
                if (response.success) {
                    toast.success(response.message);
                    dispatch(setStudentName(''))
                    dispatch(setStudentUserName(''))
                    dispatch(setActiveBookTab("grade"));
                }
            }
            catch (error) {
                toast.warning((error as any)?.data?.message || "Something went wrong");
            }
        }
        else {
            dispatch(setActiveBookTab("grade"));
        }
    };

    const isButtonDisabled =
        !studentName || !studentUserName || !studentPassword;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student Name & Email */}
            <div>
                <Label>Student Name</Label>
                <Input
                    type="text"
                    placeholder="Enter student name"
                    value={studentName}
                    onChange={(e) => dispatch(setStudentName(e.target.value))}
                    required
                />
            </div>

            {/* User Name & Password */}
            <div className="md:flex gap-6">
                <div className="flex-1">
                    <Label>User Name</Label>
                    <Input
                        type="text"
                        placeholder="Enter user name"
                        value={studentUserName}
                        onChange={(e) => dispatch(setStudentUserName(e.target.value))}
                        required
                    />
                </div>

                <div className="flex-1 relative mt-2 md:mt-0">
                    <Label>Password</Label>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={studentPassword}
                        onChange={(e) => dispatch(setStudentPassword(e.target.value))}
                        className="pr-10"
                        required
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[70%] -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                </div>
            </div>

            {/* Upload Student Photo */}
            <div className="flex-1">
                <Label className="font-medium mb-2.5">
                    Upload Student Photo<span className="text-red-600">*</span>
                </Label>

                {!previewStudentPhoto ? (
                    <label htmlFor="studentPhoto">
                        <div className="border border-dashed border-[#CBD5E1] rounded-lg px-6 py-8 w-full cursor-pointer">
                            <input
                                id="studentPhoto"
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
                    <div className="relative w-fit mx-auto group">
                        <button
                            type="button"
                            onClick={() => handleImageChange(null)}
                            className="absolute top-2 right-2 bg-[#bdbfc4]/70 hover:bg-[#a1a3a8] text-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove photo"
                        >
                            <RxCross1 className="h-3 w-3" />
                        </button>
                        <Image
                            src={previewStudentPhoto}
                            height={200}
                            width={300}
                            alt="Preview"
                            className="w-full h-[200px] object-cover rounded-md border"
                        />
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-3 pt-3">
                <Link href="/admin/students">
                    <Button
                        type="button"
                        variant="outline"
                        className="px-6 border-[#636F85] text-[#636F85]"
                    >
                        Cancel
                    </Button>
                </Link>

                <Button
                    type="submit"
                    disabled={isButtonDisabled}
                    className={`px-6 text-white font-medium transition-all ease-in-out duration-500 cursor-pointer ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A]"}`}
                >
                    {
                        isUpdating ?
                            <div className="flex justify-center items-center gap-2">
                                Updating...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div> :
                            pathname === '/admin/students' ? "Update & Continue" :
                                "Save & Continue"
                    }
                </Button>
            </div>
        </form>
    );
};

export default General;