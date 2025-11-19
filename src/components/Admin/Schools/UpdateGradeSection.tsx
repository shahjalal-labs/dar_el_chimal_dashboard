/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from '@/components/ui/label';
import CreatableSelect from 'react-select/creatable';
import { Button } from '@/components/ui/button';
import { RootState } from '@/redux/store/store';
import { setActiveStudents, setActiveTeachers, setAddress, setGradeOptions, setPreviewSchoolPhoto, setSchoolName, setStudentCount, setTeacherCount } from '@/redux/features/schoolSlice';
import { toast } from 'sonner';
import { useGetSingleSchoolQuery, useUpdateSchoolMutation } from '@/redux/api/school';
import { PiSpinner } from 'react-icons/pi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

const UpdateGradeSection = ({ id }: { id: string }) => {
    const dispatch = useDispatch();
    const selectedFromRedux = useSelector((state: RootState) => state.school.options);
    const [selectedOptions, setSelectedOptions] = useState(selectedFromRedux);

    const [optionToRemove, setOptionToRemove] = useState<Option | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data } = useGetSingleSchoolQuery({ id });
    const [UpdateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

    useEffect(() => {
        if (data?.result) {
            const grades = data?.result?.grades?.map((g: any) => ({
                label: g.grade,
                value: g.grade,
                __isNew__: true
            }));
            dispatch(setGradeOptions(grades));
            setSelectedOptions(grades);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    console.log(data?.result?.grades);

    const handleChange = (
        newValue: readonly Option[],
    ) => {
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

    const handleRemoveClick = (option: Option) => {
        setOptionToRemove(option);
        setIsModalOpen(true);
    };

    const confirmRemove = async () => {
        const deletedGrade = data?.result?.grades?.find((g: any) => g?.grade === optionToRemove?.value);
        const body = {
            schoolData: {},
            DeleteGrades: [
                deletedGrade?.id
            ],
        }

        const formData = new FormData();
        formData.append('bodyData', JSON.stringify(body))

        try {
            const response = await UpdateSchool({ id, formData }).unwrap();
            if (response.success) {
                toast.success(response.message);
                setSelectedOptions((prev) =>
                    prev.filter((opt) => opt.value !== optionToRemove?.value)
                );
                setIsModalOpen(false);
                setOptionToRemove(null);
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    };

    const handleSave = async () => {
        let newAssignedGrades = [""];

        const prevGrades = data?.result?.grades?.map((g: any) => String(g.grade));
        newAssignedGrades = selectedFromRedux?.filter((sg: any) => !prevGrades.includes(sg?.value))?.map((sg: any) => sg?.value);

        const body = {
            schoolData: {},
            grades: newAssignedGrades?.filter((grade: any) => grade !== 'All')?.map((grade: any) => ({ gradeLevel: grade }))
        }

        const formData = new FormData();
        formData.append('bodyData', JSON.stringify(body))

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
                dispatch(setGradeOptions([]));
                window.location.reload();
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || "Something went wrong");
        }
    };

    return (
        <div>
            <Label>Grade Section Mapping</Label>
            <CreatableSelect
                isMulti={true}
                options={initialOptions}
                value={selectedOptions}
                onChange={handleChange}
                onCreateOption={handleCreateOption}
                components={{
                    MultiValueRemove: (props) => (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleRemoveClick(props.data as Option);
                            }}
                            className="px-1 cursor-pointer text-gray-500 hover:text-red-600"
                        >
                            ✕
                        </div>
                    ),
                }}
                styles={{
                    container: (base) => ({
                        ...base,
                        marginTop: "0.5rem",
                    }),
                    control: (base) => ({
                        ...base,
                        borderColor: "#CBD5E1",
                        borderRadius: "0.5rem",
                        boxShadow: "none",
                        padding: "2px 4px",
                    }),
                    option: (base) => ({
                        ...base,
                        backgroundColor: "#FFFFFF",
                        color: "#000000",
                    }),
                }}
            />

            {/* Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="p-6">
                    <DialogHeader>
                        <DialogTitle>Remove Grade</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-700">
                        Are you sure you want to remove{" "}
                        <span className="font-semibold">{optionToRemove?.label}</span>?
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="default"
                            onClick={() => setIsModalOpen(false)}
                            className='px-4 py-2 border rounded-md bg-white text-black hover:text-white'
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmRemove}
                            className='px-4 py-2 bg-red-600 hover:bg-red-300 text-white rounded-md transition-all ease-in-out duration-500 cursor-pointer'
                        >
                            {
                                (isUpdating) ?
                                    <div className="flex justify-center items-center gap-2">
                                        Removing...
                                        <div className="animate-spin">
                                            <PiSpinner className="h-4 w-4" />
                                        </div>
                                    </div> :
                                    "Remove"
                            }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Buttons */}
            <div className="flex justify-center pt-3 mt-6">
                <Button
                    type="submit"
                    onClick={handleSave}
                    className={`px-6 text-white font-medium border border-[#1E3A8A] transition-all ease-in-out duration-500 cursor-pointer bg-[#1E3A8A] hover:bg-[#1E3A8A]/80`}
                >
                    {
                        (isUpdating && !isModalOpen) ?
                            <div className="flex justify-center items-center gap-2">
                                Updating...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div> :
                            "Update & Continue"
                    }
                </Button>
            </div>
        </div>
    );
};

export default UpdateGradeSection;