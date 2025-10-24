/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "@/components/ui/label";
import CreatableSelect from "react-select/creatable";
import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store/store";
import {
    setActiveStudents,
    setActiveTeachers,
    setAddress,
    setGradeOptions,
    setPreviewSchoolPhoto,
    setSchoolName,
    setStudentCount,
    setTeacherCount,
} from "@/redux/features/schoolSlice";
import { toast } from "sonner";
import { useCreateSchoolMutation } from "@/redux/api/school";
import { PiSpinner } from "react-icons/pi";
import { useRouter } from "next/navigation";

interface Option {
    label: string;
    value: string;
    __isNew__?: boolean;
}

const AddGradeSection = () => {
    const route = useRouter();
    const dispatch = useDispatch();

    const {
        schoolName,
        address,
        teacherCount,
        activeTeachers,
        studentCount,
        activeStudents,
        schoolPhoto,
    } = useSelector((state: RootState) => state.school);
    const selectedFromRedux = useSelector(
        (state: RootState) => state.school.options
    );

    const [selectedOptions, setSelectedOptions] = useState<Option[]>(selectedFromRedux || []);
    const [CreateSchool, { isLoading: isCreating }] = useCreateSchoolMutation();

    const handleChange = (newValue: any) => {
        setSelectedOptions(newValue);
        dispatch(setGradeOptions(newValue));
    };

    const handleCreateOption = (inputValue: string) => {
        if (!inputValue.trim()) return;
        const newOption = { label: inputValue, value: inputValue, __isNew__: true };
        const newOptions = [...selectedOptions, newOption];
        setSelectedOptions(newOptions);
        dispatch(setGradeOptions(newOptions));
    };

    const handleSave = async () => {
        const body = {
            name: schoolName,
            location: address,
            teacherCount: Number(teacherCount),
            studentsCount: Number(studentCount),
            activeStudents: Number(activeStudents),
            activeTeachers: Number(activeTeachers),
            grades: selectedFromRedux?.map((grade) => ({
                gradeLevel: grade?.value,
            })),
        };

        const formData = new FormData();
        formData.append("bodyData", JSON.stringify(body));
        if (schoolPhoto) formData.append("schoolLogo", schoolPhoto);

        try {
            const response = await CreateSchool(formData).unwrap();
            if (response.success) {
                toast.success(response.message);
                dispatch(setSchoolName(""));
                dispatch(setAddress(""));
                dispatch(setTeacherCount(0));
                dispatch(setActiveTeachers(0));
                dispatch(setStudentCount(0));
                dispatch(setActiveStudents(0));
                dispatch(setPreviewSchoolPhoto(""));
                dispatch(setGradeOptions([]));
                route.push("/admin/schools");
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    };

    const isButtonDisabled = !selectedOptions?.length;

    return (
        <div>
            <Label>Grade Section Mapping</Label>
            <CreatableSelect
                isMulti
                value={selectedOptions}
                onChange={handleChange}
                onCreateOption={handleCreateOption}
                styles={{
                    container: (base) => ({ ...base, marginTop: "0.5rem" }),
                    control: (base) => ({
                        ...base,
                        borderColor: "#CBD5E1",
                        borderRadius: "0.5rem",
                        boxShadow: "none",
                        padding: "2px 4px",
                    }),
                }}
            />

            <div className="flex justify-center gap-3 pt-3 mt-6">
                <Button
                    variant="outline"
                    className="border-[#636F85] text-[#636F85] px-6"
                    onClick={() => route.push("/admin/schools")}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    onClick={handleSave}
                    disabled={isButtonDisabled}
                    className={`px-6 text-white font-medium transition-all ease-in-out duration-500 cursor-pointer ${isButtonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A]"
                        }`}
                >
                    {isCreating ? (
                        <div className="flex justify-center items-center gap-2">
                            Saving...
                            <PiSpinner className="animate-spin h-4 w-4" />
                        </div>
                    ) : (
                        "Save and Continue"
                    )}
                </Button>
            </div>
        </div>
    );
};

export default AddGradeSection;