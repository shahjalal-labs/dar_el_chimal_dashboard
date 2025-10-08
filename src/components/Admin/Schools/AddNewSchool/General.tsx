"use client";

import React from 'react';
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

const General = () => {
    const dispatch = useDispatch();
    const {
        schoolName,
        address,
        teacherCount,
        activeTeachers,
        studentCount,
        activeStudents,
        previewSchoolPhoto
    } = useSelector((state: RootState) => state.school);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setActiveBookTab("grade"));
    };

    const isButtonDisabled =
        !schoolName || !address || !teacherCount || !activeTeachers || !studentCount || !activeStudents || !previewSchoolPhoto;

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
                    className=""
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
                    className=""
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
                        className=""
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
                        className=""
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
                        className=""
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
                        className=""
                        required
                    />
                </div>
            </div>

            {/* School Photo */}
            <div className="flex-1">
                <Label className="font-medium mb-2.5">
                    School Photo<span className="text-red-600">*</span>
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
                <Link href="/admin/books">
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