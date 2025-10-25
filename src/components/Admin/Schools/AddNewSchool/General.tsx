/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import uploadImg from '@/assets/uploadImg.svg';
import { RootState } from '@/redux/store/store';
import { setActiveStudents, setActiveTeachers, setAddress, setPreviewSchoolPhoto, setSchoolName, setSchoolPhoto, setStudentCount, setTeacherCount } from '@/redux/features/schoolSlice';
import { setActiveBookTab } from '@/redux/features/uiSlice';
import { useGetSingleSchoolQuery, useUpdateSchoolMutation } from '@/redux/api/school';
import { usePathname } from 'next/navigation';
import { PiSpinner } from 'react-icons/pi';
import { toast } from 'sonner';
import defaultImg from "@/assets/no-img.jpg";

async function importedToFile(importedSrc: string, fileName: string): Promise<File> {
    const response = await fetch(importedSrc);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
}

const General = ({ id }: { id: string }) => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const {
        schoolName,
        address,
        teacherCount,
        activeTeachers,
        studentCount,
        activeStudents,
        previewSchoolPhoto,
        schoolPhoto
    } = useSelector((state: RootState) => state.school);

    const { data } = useGetSingleSchoolQuery({ id });
    const [UpdateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

    useEffect(() => {
        if (pathname === '/admin/schools' && data?.result) {
            dispatch(setSchoolName(data?.result?.name));
            dispatch(setAddress(data?.result?.location));
            dispatch(setTeacherCount(data?.result?.teacherCount));
            dispatch(setActiveTeachers(data?.result?.activeTeachers));
            dispatch(setStudentCount(data?.result?.studentsCount));
            dispatch(setActiveStudents(data?.result?.activeStudents));
            dispatch(setPreviewSchoolPhoto(data?.result?.schoolLogo));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const handleImageChange = (file: File | null) => {
        if (file) {
            const imgURL = URL.createObjectURL(file);
            dispatch(setPreviewSchoolPhoto(imgURL));
            dispatch(setSchoolPhoto(file));
        } else {
            dispatch(setPreviewSchoolPhoto(''));
            dispatch(setSchoolPhoto(null));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (pathname === '/admin/schools') {
            const body =
            {
                schoolData: {
                    name: schoolName,
                    location: address,
                    teacherCount: Number(teacherCount),
                    studentsCount: Number(studentCount),
                    activeStudents: Number(activeStudents),
                    activeTeachers: Number(activeTeachers),
                }
            }

            const formData = new FormData();
            formData.append('bodyData', JSON.stringify(body))

            if (schoolPhoto) {
                formData.append('schoolLogo', schoolPhoto)
            }
            else {
                const file = await importedToFile(defaultImg.src, "no-img.jpg");
                formData.append('schoolLogo', file)
            }

            try {
                const response = await UpdateSchool({ id, formData }).unwrap();
                if (response.success) {
                    toast.success(response.message);
                    dispatch(setSchoolName(''))
                    dispatch(setAddress(''))
                    dispatch(setTeacherCount(0))
                    dispatch(setActiveTeachers(0))
                    dispatch(setStudentCount(0))
                    dispatch(setActiveStudents(0))
                    dispatch(setPreviewSchoolPhoto(''))
                    dispatch(setActiveBookTab("grade"));
                }
            } catch (error) {
                toast.warning((error as any)?.data?.message || "Something went wrong");
            }
        }
        else {
            dispatch(setActiveBookTab("grade"));
        }
    };

    const isButtonDisabled =
        !schoolName || !address || !teacherCount || !activeTeachers || !studentCount || !activeStudents;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* School Name */}
            <div>
                <Label>School Name</Label>
                <Input
                    type="text"
                    placeholder="Enter school name"
                    value={schoolName}
                    onChange={(e) => dispatch(setSchoolName(e.target.value))}
                    required
                />
            </div>

            {/* Address */}
            <div>
                <Label>Address</Label>
                <Input
                    type="text"
                    placeholder="Enter school address"
                    value={address}
                    onChange={(e) => dispatch(setAddress(e.target.value))}
                    required
                />
            </div>

            {/* Teacher Count & Active Teachers */}
            <div className="flex gap-6">
                <div className="flex-1">
                    <Label>Teacher Count</Label>
                    <Input
                        type="number"
                        step={1}
                        placeholder="00"
                        value={teacherCount}
                        onChange={(e) => dispatch(setTeacherCount(Number(e.target.value)))}
                        required
                    />
                </div>
                <div className="flex-1">
                    <Label>Active Teachers</Label>
                    <Input
                        type="number"
                        step={1}
                        placeholder="00"
                        value={activeTeachers}
                        onChange={(e) => dispatch(setActiveTeachers(Number(e.target.value)))}
                        required
                    />
                </div>
            </div>

            {/* Student Count & Active Students */}
            <div className="flex gap-6">
                <div className="flex-1">
                    <Label>Student Count</Label>
                    <Input
                        type="number"
                        step={1}
                        placeholder="00"
                        value={studentCount}
                        onChange={(e) => dispatch(setStudentCount(Number(e.target.value)))}
                        required
                    />
                </div>
                <div className="flex-1">
                    <Label>Active Students</Label>
                    <Input
                        type="number"
                        step={1}
                        placeholder="00"
                        value={activeStudents}
                        onChange={(e) => dispatch(setActiveStudents(Number(e.target.value)))}
                        required
                    />
                </div>
            </div>

            {/* School Photo */}
            <div className="flex-1">
                <Label className="font-medium mb-2.5">
                    School Photo
                </Label>

                {!previewSchoolPhoto ? (
                    <label htmlFor="schoolPhoto">
                        <div className="border border-dashed border-[#CBD5E1] rounded-lg px-6 py-8 w-full cursor-pointer">
                            <input
                                id="schoolPhoto"
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
                            src={previewSchoolPhoto}
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
                <Link href="/admin/schools" className={`${pathname === '/admin/schools' ? 'hidden' : ''}`}>
                    <Button
                        variant="outline"
                        className="border-[#636F85] text-[#636F85] transition-all ease-in-out duration-500 cursor-pointer px-6"
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
                            pathname === '/admin/schools' ? "Update and Continue" :
                                "Save and Continue"
                    }
                </Button>
            </div>
        </form>
    );
};

export default General;