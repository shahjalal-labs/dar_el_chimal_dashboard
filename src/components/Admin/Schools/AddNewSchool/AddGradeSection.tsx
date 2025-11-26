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

const initialOptions = [
    { value: "All", label: "All" },
    { value: "Preschool", label: "Preschool" },
    { value: "KG1", label: "KG1" },
    { value: "KG2", label: "KG2" },
    { value: "KG3", label: "KG3" },
    { value: "Grade 1", label: "Grade 1" },
    { value: "Grade 2", label: "Grade 2" },
    { value: "Grade 3", label: "Grade 3" },
    { value: "Grade 4", label: "Grade 4" },
    { value: "Grade 5", label: "Grade 5" },
    { value: "Grade 6", label: "Grade 6" },
    { value: "Grade 7", label: "Grade 7" },
    { value: "Grade 8", label: "Grade 8" },
    { value: "Grade 9", label: "Grade 9" },
    { value: "Grade 10", label: "Grade 10" },
    { value: "Grade 11", label: "Grade 11" },
    { value: "Grade 12", label: "Grade 12" },
];

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
        previewResourceFile
    } = useSelector((state: RootState) => state.school);
    const selectedFromRedux = useSelector(
        (state: RootState) => state.school.options
    );

    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const [CreateSchool, { isLoading: isCreating }] = useCreateSchoolMutation();

    const handleChange = (
        newValue: readonly Option[],
    ) => {
        if (!newValue || newValue.length === 0) {
            setSelectedOptions([]);
            dispatch(setGradeOptions([]));
            return;
        }

        const selectedList = [...newValue]; // copy because it's readonly
        const selectedValues = selectedList.map((opt) => opt.value);
        const isAllSelected = selectedValues.includes("All");

        // If "All" selected → select all options
        if (isAllSelected) {
            const allOptions = [...initialOptions];
            setSelectedOptions(allOptions);
            dispatch(setGradeOptions(allOptions));
            return;
        }

        // Remove "All" if something else is changed
        const withoutAll = selectedList.filter((opt) => opt.value !== "All");

        setSelectedOptions(withoutAll);
        dispatch(setGradeOptions(withoutAll));
    };

    const handleCreateOption = (inputValue: string) => {
        if (!inputValue.trim()) return;

        const newOption: Option = {
            value: inputValue,
            label: inputValue,
            __isNew__: true,
        };

        // Add to initial options
        initialOptions.push(newOption);

        const isAllSelected = selectedOptions.some((opt) => opt.value === "All");

        const updatedSelection = isAllSelected
            ? [...initialOptions] // If All was selected → include new option automatically
            : [...selectedOptions, newOption];

        setSelectedOptions(updatedSelection);
        dispatch(setGradeOptions(updatedSelection));
    };

    const handleSave = async () => {
        const body = {
            name: schoolName,
            location: address,
            teacherCount: Number(teacherCount),
            studentsCount: Number(studentCount),
            activeStudents: Number(activeStudents),
            activeTeachers: Number(activeTeachers),
            grades: selectedFromRedux?.filter((opt) => opt.value !== "All")?.map((grade) => ({
                gradeLevel: grade?.value,
            })),
            schoolDocuments: previewResourceFile
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
            toast.warning(((error as any).data.errors.map((err: any) => err.message + ". ")) || "Something went wrong");
        }
    };

    return (
        <div>
            <Label>Grade Section Mapping</Label>
            <CreatableSelect
                isMulti
                options={initialOptions}
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
                    className={`px-6 text-white font-medium transition-all ease-in-out duration-500 cursor-pointer bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A]`}
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