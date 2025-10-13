/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from '@/components/ui/label';
import CreatableSelect from 'react-select/creatable';
import { Button } from '@/components/ui/button';
import { RootState } from '@/redux/store/store';
import { clearGradeOptions, setActiveStudents, setActiveTeachers, setAddress, setGradeOptions, setPreviewSchoolPhoto, setSchoolName, setStudentCount, setTeacherCount } from '@/redux/features/schoolSlice';
import { toast } from 'sonner';
import { useCreateSchoolMutation, useGetSingleSchoolQuery, useUpdateSchoolMutation } from '@/redux/api/school';
import { PiSpinner } from 'react-icons/pi';
import { usePathname, useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Option {
    label: string;
    value: string;
    __isNew__?: boolean;
}

const Grade = ({ id }: { id: string }) => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const route = useRouter();
    const {
        schoolName,
        address,
        teacherCount,
        activeTeachers,
        studentCount,
        activeStudents,
        schoolPhoto
    } = useSelector((state: RootState) => state.school);
    const selectedFromRedux = useSelector((state: RootState) => state.school.options);
    const [selectedOptions, setSelectedOptions] = useState(selectedFromRedux);

    const [optionToRemove, setOptionToRemove] = useState<Option | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data } = useGetSingleSchoolQuery(id);
    const [CreateSchool, { isLoading: isCreating }] = useCreateSchoolMutation();
    const [UpdateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

    useEffect(() => {
        if (data?.result) {
            const grades = data?.result?.grades?.map((g: any) => ({
                label: g.grade,
                value: g.grade,
                __isNew__: true
            }));
            dispatch(setGradeOptions(grades));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const handleChange = (newValue: any) => {
        setSelectedOptions(newValue);
        dispatch(setGradeOptions(newValue));
    };

    const handleRemoveClick = (option: Option) => {
        setOptionToRemove(option);
        setIsModalOpen(true);
    };

    const confirmRemove = async () => {
        if (pathname === '/admin/schools') {
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
        }
        else {
            setSelectedOptions((prev) =>
                prev.filter((opt) => opt.value !== optionToRemove?.value)
            );
            setIsModalOpen(false);
            setOptionToRemove(null);
        }
    };

    const handleSave = async () => {
        if (pathname === '/admin/schools') {
            const body = {
                schoolData: {},
                grades: selectedFromRedux?.map((grade) => ({
                    gradeLevel: grade?.value
                }))
            }

            const formData = new FormData();
            formData.append('bodyData', JSON.stringify(body))

            try {
                const response = await UpdateSchool({ id, formData }).unwrap();
                if (response.success) {
                    toast.success(response.message);
                }
            } catch (error) {
                toast.warning((error as any)?.data?.message || "Something went wrong");
            }
        }
        else {
            const body = {
                name: schoolName,
                location: address,
                teacherCount: Number(teacherCount),
                studentsCount: Number(studentCount),
                activeStudents: Number(activeStudents),
                activeTeachers: Number(activeTeachers),
                grades: selectedFromRedux?.map((grade) => ({
                    gradeLevel: grade?.value
                }))
            }

            const formData = new FormData();
            formData.append('bodyData', JSON.stringify(body))

            if (schoolPhoto) {
                formData.append('schoolLogo', schoolPhoto)
            }

            try {
                const response = await CreateSchool(formData).unwrap();
                if (response.success) {
                    toast.success(response.message);
                    dispatch(setSchoolName(''))
                    dispatch(setAddress(''))
                    dispatch(setTeacherCount(0))
                    dispatch(setActiveTeachers(0))
                    dispatch(setStudentCount(0))
                    dispatch(setActiveStudents(0))
                    dispatch(setPreviewSchoolPhoto(''))
                    route.push('/admin/schools')
                }
            } catch (error) {
                toast.warning((error as any)?.data?.message || "Something went wrong");
            }
        }
    };

    const isButtonDisabled = !selectedOptions?.length;

    return (
        <div>
            <Label>Grade Section Mapping</Label>
            <CreatableSelect
                isMulti={true}
                value={selectedOptions}
                onChange={handleChange}
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
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-3 py-1 border rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmRemove}
                            className="px-3 py-1 bg-red-600 text-white rounded-md"
                        >
                            Remove
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Buttons */}
            <div className="flex justify-center gap-3 pt-3 mt-6">
                <Button
                    variant="outline"
                    className="px-6 border-[#636F85] text-[#636F85]"
                    onClick={() => dispatch(clearGradeOptions())}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    onClick={handleSave}
                    disabled={isButtonDisabled}
                    className={`px-6 text-white font-medium border border-[#1E3A8A] transition-all duration-300 ${isButtonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"
                        }`}
                >
                    {
                        (isCreating || isUpdating) ?
                            <div className="flex justify-center items-center gap-2">
                                Saving...
                                <div className="animate-spin">
                                    <PiSpinner className="h-4 w-4" />
                                </div>
                            </div> :
                            "Save & Continue"
                    }
                </Button>
            </div>
        </div>
    );
};

export default Grade;