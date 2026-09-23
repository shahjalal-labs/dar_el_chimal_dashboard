/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from '@/components/ui/label';
import CreatableSelect from 'react-select/creatable';
import { Button } from '@/components/ui/button';
import { RootState } from '@/redux/store/store';
import { setGradeOptions } from '@/redux/features/schoolSlice';
import { toast } from 'sonner';
import { useGetSingleSchoolQuery, useUpdateSchoolMutation } from '@/redux/api/school';
import { PiSpinner } from 'react-icons/pi';

interface Option {
    label: string;
    value: string;
    __isNew__?: boolean;
}

export const STANDARD_GRADE_ORDER = [
    "Preschool",
    "KG1",
    "KG2",
    "KG3",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
];

const BASE_GRADE_OPTIONS: Option[] = STANDARD_GRADE_ORDER.map((g) => ({
    value: g,
    label: g,
}));

export const sortGrades = (options: Option[]): Option[] => {
    const getGradeRank = (val: string): number => {
        const str = String(val).trim();
        const stdIndex = STANDARD_GRADE_ORDER.findIndex(
            (g) => g.toLowerCase() === str.toLowerCase()
        );
        if (stdIndex !== -1) return stdIndex;

        const match = str.match(/\d+/);
        if (match) {
            const num = parseInt(match[0], 10);
            if (str.toLowerCase().startsWith("kg")) return 10 + num;
            if (str.toLowerCase().startsWith("grade")) return 100 + num;
            return 500 + num;
        }
        return 1000;
    };

    return [...options].sort((a, b) => {
        const rankA = getGradeRank(a.value);
        const rankB = getGradeRank(b.value);
        if (rankA !== rankB) return rankA - rankB;
        return a.value.localeCompare(b.value, undefined, { numeric: true, sensitivity: "base" });
    });
};

const UpdateGradeSection = ({ id }: { id: string }) => {
    const dispatch = useDispatch();
    const selectedFromRedux = useSelector((state: RootState) => state.school.options);

    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const [customOptions, setCustomOptions] = useState<Option[]>([]);

    const { data } = useGetSingleSchoolQuery({ id });
    const [UpdateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

    // Populate initial grades from server
    useEffect(() => {
        if (data?.result?.grades) {
            const serverGrades: Option[] = data.result.grades.map((g: any) => ({
                label: g.grade,
                value: g.grade,
            }));

            // Track any custom grades that are not in BASE_GRADE_OPTIONS
            const extraOptions = serverGrades.filter(
                (sg) => !BASE_GRADE_OPTIONS.some((bg) => bg.value.toLowerCase() === sg.value.toLowerCase())
            );
            if (extraOptions.length > 0) {
                setCustomOptions(extraOptions);
            }

            const sorted = sortGrades(serverGrades);
            setSelectedOptions(sorted);
            dispatch(setGradeOptions(sorted));
        }
    }, [data, dispatch]);

    // Combine base options + custom options
    const allAvailableOptions = useMemo(() => {
        const map = new Map<string, Option>();
        BASE_GRADE_OPTIONS.forEach((opt) => map.set(opt.value.toLowerCase(), opt));
        customOptions.forEach((opt) => map.set(opt.value.toLowerCase(), opt));
        return sortGrades(Array.from(map.values()));
    }, [customOptions]);

    // Dropdown options include dynamic "Select All" / "Unselect All" at top
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
        // If user clicked the "__SELECT_ALL__" option from dropdown
        if (actionMeta?.option?.value === "__SELECT_ALL__") {
            handleSelectAll();
            return;
        }

        // If user clicked the "__DESELECT_ALL__" option from dropdown
        if (actionMeta?.option?.value === "__DESELECT_ALL__") {
            handleUnselectAll();
            return;
        }

        // Filter out any accidental select-all tokens
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
        const initialGrades: Array<{ id: string; grade: string }> = data?.result?.grades || [];
        const currentGradeValues = selectedOptions.map((opt) => opt.value);

        // Grades to delete: were in initialGrades, but removed from current selection
        const deleteGradeIds = initialGrades
            .filter((ig) => !currentGradeValues.some((name) => name.toLowerCase() === ig.grade.toLowerCase()))
            .map((ig) => ig.id);

        // Grades to add: in current selection, but were not in initialGrades
        const newGradesToAdd = currentGradeValues
            .filter((name) => !initialGrades.some((ig) => ig.grade.toLowerCase() === name.toLowerCase()))
            .map((name) => ({ gradeLevel: name }));

        if (deleteGradeIds.length === 0 && newGradesToAdd.length === 0) {
            toast.info("No changes to update");
            return;
        }

        const body = {
            schoolData: {},
            DeleteGrades: deleteGradeIds,
            grades: newGradesToAdd,
        };

        const formData = new FormData();
        formData.append('bodyData', JSON.stringify(body));

        try {
            const response = await UpdateSchool({ id, formData }).unwrap();
            if (response.success) {
                toast.success(response.message || "School grades updated successfully");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message || "Failed to update school grades");
        }
    };

    return (
        <div>
            {/* Header with Title and Quick Action Buttons */}
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
                isMulti={true}
                options={dropdownOptions}
                value={selectedOptions}
                onChange={handleChange}
                onCreateOption={handleCreateOption}
                placeholder="Select or type grade section..."
                closeMenuOnSelect={false}
                isClearable={true}
                styles={{
                    container: (base) => ({
                        ...base,
                        marginTop: "0.25rem",
                    }),
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

            {/* Selected Count Indicator */}
            <div className="flex justify-between items-center text-xs text-gray-500 mt-1.5">
                <span>
                    {selectedOptions.length === 0
                        ? "No grades selected"
                        : `${selectedOptions.length} grade${selectedOptions.length > 1 ? "s" : ""} selected`}
                </span>
            </div>

            {/* Update & Continue Button */}
            <div className="flex justify-center pt-3 mt-6">
                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="px-8 py-2.5 text-white font-medium border border-[#1E3A8A] transition-all ease-in-out duration-300 cursor-pointer bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 rounded-md"
                >
                    {isUpdating ? (
                        <div className="flex justify-center items-center gap-2">
                            Updating...
                            <PiSpinner className="animate-spin h-4 w-4" />
                        </div>
                    ) : (
                        "Update & Continue"
                    )}
                </Button>
            </div>
        </div>
    );
};

export default UpdateGradeSection;