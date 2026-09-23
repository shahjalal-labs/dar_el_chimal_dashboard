/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
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
import { STANDARD_GRADE_ORDER, sortGrades } from "../UpdateGradeSection";

interface Option {
    label: string;
    value: string;
    __isNew__?: boolean;
}

const BASE_GRADE_OPTIONS: Option[] = STANDARD_GRADE_ORDER.map((g) => ({
    value: g,
    label: g,
}));

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
        previewResourceFile,
    } = useSelector((state: RootState) => state.school);

    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const [customOptions, setCustomOptions] = useState<Option[]>([]);
    const [CreateSchool, { isLoading: isCreating }] = useCreateSchoolMutation();

    const allAvailableOptions = useMemo(() => {
        const map = new Map<string, Option>();
        BASE_GRADE_OPTIONS.forEach((opt) => map.set(opt.value.toLowerCase(), opt));
        customOptions.forEach((opt) => map.set(opt.value.toLowerCase(), opt));
        return sortGrades(Array.from(map.values()));
    }, [customOptions]);

    const isAllSelected = selectedOptions.length > 0 && selectedOptions.length === allAvailableOptions.length;

    const dropdownOptions = useMemo(() => {
        const selectAllOption: Option = isAllSelected
            ? { value: "__DESELECT_ALL__", label: "✕ Unselect All Grades" }
            : { value: "__SELECT_ALL__", label: "✓ Select All Grades" };

        return [selectAllOption, ...allAvailableOptions];
    }, [isAllSelected, allAvailableOptions]);

    const handleSelectAll = () => {
        const sorted = sortGrades(allAvailableOptions);
        setSelectedOptions(sorted);
        dispatch(setGradeOptions(sorted));
    };

    const handleUnselectAll = () => {
        setSelectedOptions([]);
        dispatch(setGradeOptions([]));
    };

    const handleChange = (
        newValue: readonly Option[],
        actionMeta: any
    ) => {
        if (actionMeta?.option?.value === "__SELECT_ALL__") {
            handleSelectAll();
            return;
        }

        if (actionMeta?.option?.value === "__DESELECT_ALL__") {
            handleUnselectAll();
            return;
        }

        const filtered = newValue.filter(
            (opt) => opt.value !== "__SELECT_ALL__" && opt.value !== "__DESELECT_ALL__" && opt.value !== "All"
        );

        const sorted = sortGrades(filtered);
        setSelectedOptions(sorted);
        dispatch(setGradeOptions(sorted));
    };

    const handleCreateOption = (inputValue: string) => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        const newOption: Option = {
            value: trimmed,
            label: trimmed,
            __isNew__: true,
        };

        setCustomOptions((prev) => [...prev, newOption]);
        const updated = sortGrades([...selectedOptions, newOption]);
        setSelectedOptions(updated);
        dispatch(setGradeOptions(updated));
    };

    const handleSave = async () => {
        if (selectedOptions.length === 0) {
            toast.error("Please select at least one grade");
            return;
        }

        const body = {
            name: schoolName,
            location: address,
            teacherCount: Number(teacherCount) || 0,
            studentsCount: Number(studentCount) || 0,
            activeStudents: Number(activeStudents) || 0,
            activeTeachers: Number(activeTeachers) || 0,
            grades: selectedOptions.map((grade) => ({
                gradeLevel: grade.value,
            })),
            schoolDocuments: previewResourceFile || [],
        };

        const formData = new FormData();
        formData.append("bodyData", JSON.stringify(body));
        if (schoolPhoto) formData.append("schoolLogo", schoolPhoto);

        try {
            const response = await CreateSchool(formData).unwrap();
            if (response.success) {
                toast.success(response.message || "School created successfully");
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
        } catch (error: any) {
            const errorMsg =
                error?.data?.errors?.map((err: any) => err.message).join(". ") ||
                error?.data?.message ||
                error?.message ||
                "Something went wrong";
            toast.error(errorMsg);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold text-gray-700">Grade Section Mapping</Label>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                    >
                        Select All
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                        type="button"
                        onClick={handleUnselectAll}
                        className="text-xs font-semibold text-gray-500 hover:text-red-600 hover:underline cursor-pointer"
                    >
                        Unselect All
                    </button>
                </div>
            </div>

            <CreatableSelect
                isMulti
                options={dropdownOptions}
                value={selectedOptions}
                onChange={handleChange}
                onCreateOption={handleCreateOption}
                placeholder="Select or type grade section..."
                closeMenuOnSelect={false}
                isClearable={true}
                styles={{
                    container: (base) => ({ ...base, marginTop: "0.25rem" }),
                    control: (base) => ({
                        ...base,
                        borderColor: "#CBD5E1",
                        borderRadius: "0.5rem",
                        boxShadow: "none",
                        padding: "2px 4px",
                        minHeight: "44px",
                    }),
                    multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#F1F5F9",
                        borderRadius: "0.375rem",
                        border: "1px solid #E2E8F0",
                    }),
                    multiValueLabel: (base) => ({
                        ...base,
                        color: "#1E293B",
                        fontWeight: 500,
                        padding: "2px 6px",
                    }),
                    multiValueRemove: (base) => ({
                        ...base,
                        color: "#64748B",
                        cursor: "pointer",
                        ":hover": {
                            backgroundColor: "#FEE2E2",
                            color: "#EF4444",
                        },
                    }),
                    option: (base, state) => {
                        const isSelectAllOption = state.data.value === "__SELECT_ALL__" || state.data.value === "__DESELECT_ALL__";
                        return {
                            ...base,
                            backgroundColor: state.isFocused
                                ? isSelectAllOption ? "#EEF2FF" : "#F8FAFC"
                                : "#FFFFFF",
                            color: isSelectAllOption ? "#1E3A8A" : "#1E293B",
                            fontWeight: isSelectAllOption ? 600 : 400,
                            borderBottom: isSelectAllOption ? "1px solid #E2E8F0" : "none",
                            cursor: "pointer",
                        };
                    },
                }}
            />

            <div className="flex justify-between items-center text-xs text-gray-500 mt-1.5">
                <span>
                    {selectedOptions.length === 0
                        ? "No grades selected"
                        : `${selectedOptions.length} grade${selectedOptions.length > 1 ? "s" : ""} selected`}
                </span>
            </div>

            <div className="flex justify-center gap-3 pt-3 mt-6">
                <Button
                    variant="outline"
                    className="border-[#636F85] text-[#636F85] px-6"
                    onClick={() => route.push("/admin/schools")}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isCreating}
                    className="px-6 text-white font-medium transition-all ease-in-out duration-500 cursor-pointer bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A]"
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