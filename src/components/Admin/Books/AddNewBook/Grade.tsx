/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { FaPlus, FaTrash } from 'react-icons/fa';
import GetSchools, { SchoolOption } from '@/components/Common/GetSchools';
import { useDispatch, useSelector } from 'react-redux';
import {
    setAuthor,
    setBookName,
    setCategory,
    setDescription,
    setISBN,
    setPreviewImage,
    setPreviewPdf,
    setPreviewResourceFile,
    setResourceDescription,
    setResourceLink,
    setResourceTitle,
    setResourceType,
    setSchoolGradeMappings,
    setUploadImage,
    setUploadPdf,
} from '@/redux/features/bookSlice';
import { RootState } from '@/redux/store/store';
import { toast } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';
import { PiSpinner } from 'react-icons/pi';
import { useGetAllGradesQuery } from '@/redux/api/grade';
import {
    useCreateBookMutation,
    useGetSingleBookQuery,
    useUpdateBookMutation,
} from '@/redux/api/book';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { set } from 'date-fns';

interface GradeOption {
    id: string;
    label: string;
    schoolId: string;
}

interface Mapping {
    id: string;
    school: SchoolOption | null;
    grades: GradeOption[];
}

const Grade = ({ id, onClose }: { id: string, onClose?: () => void }) => {
    const route = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const {
        bookName,
        description,
        isbn,
        author,
        categoryId,
        uploadImage,
        uploadPdf,
        resourceTitle,
        resourceDescription,
        resourceType,
        previewResourceFile,
        resourceLink,
        schoolGradeMappings,
    } = useSelector((state: RootState) => state?.book);

    const [mappings, setMappings] = useState<Mapping[]>([{ id: Date.now().toString(), school: null, grades: [] }]);

    const [optionToRemove, setOptionToRemove] = useState<GradeOption | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data } = useGetSingleBookQuery(id);
    const { data: gradesData, isLoading, isError } = useGetAllGradesQuery({ currentPage: 1, limit: 1000 });

    const [CreateBook, { isLoading: isBookLoading }] = useCreateBookMutation();
    const [UpdateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

    const allGrades: GradeOption[] =
        gradesData?.result?.map((singleGrade: any) => ({
            id: singleGrade?.id,
            label: singleGrade?.grade,
            schoolId: singleGrade?.schoolId,
        })) ?? [];

    useEffect(() => {
        if (pathname === '/admin/books/add-new-book') {
            setMappings([{ id: Date.now().toString(), school: null, grades: [] }]);
            return;
        }
        if (pathname !== '/admin/books/add-new-book' && data?.result && Array.isArray(data?.result?.grades)) {
            const preloadedMappings: Mapping[] = data.result.grades.map(
                (entry: any) => {
                    const school: SchoolOption | null = {
                        schoolId: entry?.schoolId,
                        schoolName: entry?.schoolName || '',
                        image: entry?.schoolLogo || '',
                    };

                    const grades: GradeOption[] =
                        entry?.gradesinthisSchool
                            ?.map((grade: any) =>
                                allGrades?.find((g) => g?.id === grade?.id)
                            )
                            ?.filter(Boolean) as GradeOption[];

                    return {
                        id: Math.random().toString(),
                        school,
                        grades,
                    };
                }
            );
            setMappings(preloadedMappings ?? []);
            dispatch(
                setSchoolGradeMappings(
                    data.result.grades.map((m: any) => ({
                        schoolId: m?.schoolId,
                        schoolName: m?.schoolName || '',
                        image: m?.schoolLogo || '',
                        grade: m?.gradesinthisSchool?.map((g: any) => g?.id),
                    }))
                )
            );
        } else {
            setMappings([]);
        }
    }, [data]);

    useEffect(() => {
        if (
            pathname !== '/admin/books/add-new-book' &&
            Array.isArray(schoolGradeMappings) &&
            schoolGradeMappings.length > 0 &&
            gradesData
        ) {
            const preloadedMappings: Mapping[] = schoolGradeMappings.map(
                (entry: any) => {
                    const school: SchoolOption | null = entry?.school
                        ? entry?.school
                        : {
                            schoolId: entry?.schoolId,
                            schoolName: entry?.schoolName || '',
                            image: entry?.image || '',
                        };

                    const grades: GradeOption[] = entry?.grade
                        ?.map((gradeId: string) =>
                            allGrades?.find((g) => g?.id === gradeId)
                        )
                        ?.filter(Boolean) as GradeOption[];

                    return {
                        id: Math.random().toString(),
                        school,
                        grades,
                    };
                }
            );
            setMappings(preloadedMappings ?? []);
        }
    }, [gradesData, schoolGradeMappings]);

    const handleAddMapping = () => {
        setMappings((prev) => [
            ...(Array.isArray(prev) ? prev : []),
            { id: Date.now().toString(), school: null, grades: [] },
        ]);
    };

    const handleRemoveMapping = (id: string) => {
        setMappings((prev) =>
            Array.isArray(prev) ? prev.filter((item) => item?.id !== id) : []
        );
    };

    const handleSchoolChange = (id: string, school: SchoolOption) => {
        setMappings((prev) =>
            Array.isArray(prev)
                ? prev.map((item) =>
                    item?.id === id ? { ...item, school, grades: [] } : item
                )
                : []
        );
    };

    const handleGradeChange = (
        id: string,
        selectedGrades: readonly GradeOption[]
    ) => {
        setMappings((prev) =>
            Array.isArray(prev)
                ? prev.map((item) =>
                    item?.id === id ? { ...item, grades: [...selectedGrades] } : item
                )
                : []
        );
    };

    const handleRemoveClick = (option: GradeOption) => {
        setOptionToRemove(option);
        setIsModalOpen(true);
    };

    const confirmRemove = async () => {
        const deletedGrade = data?.result?.grades
            ?.find((g: any) => g?.schoolId === optionToRemove?.schoolId)
            ?.gradesinthisSchool?.find(
                (grade: any) => grade?.grade === optionToRemove?.label
            );

        const body = {
            BookData: {},
            NewGradesAssign: [],
            deletedGrades: [deletedGrade?.id],
        };

        const formData = new FormData();
        formData.append('bodyData', JSON.stringify(body));

        try {
            const response = await UpdateBook({ bookId: id, formData })?.unwrap();
            if (response.success) {
                toast.success(response.message);
                setIsModalOpen(false);
                setOptionToRemove(null);
            }
        } catch (error) {
            toast.warning((error as any)?.data?.message || 'Something went wrong');
        }
    };

    const selectedSchoolIds = useMemo(
        () => mappings?.filter((m) => m?.school)?.map((m) => m?.school!.schoolId),
        [mappings]
    );

    const handleSave = async () => {
        const formattedData = mappings.map(m => ({
            schoolId: m?.school?.schoolId,
            schoolName: m?.school?.schoolName,
            image: m?.school?.image,
            grade: m?.grades?.map(g => g?.id)
        }));
        dispatch(setSchoolGradeMappings(formattedData));

        if (pathname === '/admin/books') {
            const existingGradeMap = new Map();
            data?.result?.grades?.forEach((school: any) => {
                const gradeIds = school.gradesinthisSchool.map((g: any) => g.id);
                existingGradeMap.set(school.schoolId, gradeIds);
            });

            const newAssignedGrades = mappings
                .map((item: any) => {
                    const existingIds = existingGradeMap.get(item.school.schoolId) || [];
                    const newGrades =
                        item.grades
                            ?.map((g: any) => g.id)
                            ?.filter((id: any) => !existingIds.includes(id)) || [];

                    return newGrades.length > 0
                        ? { schoolId: item.school.schoolId, grade: newGrades }
                        : null;
                })
                .filter(Boolean);

            const body = {
                BookData: {},
                NewGradesAssign: newAssignedGrades,
                deletedGrades: []
            };

            const formData = new FormData();
            formData?.append('bodyData', JSON?.stringify(body));

            try {
                const response = await UpdateBook({ bookId: id, formData })?.unwrap();
                if (response?.success) {
                    toast?.success(response?.message);
                    onClose?.();
                }
            } catch (error) {
                toast?.warning(
                    (error as any)?.data?.message || 'Something went wrong'
                );
            }
        } else {
            const body = {
                BookData: {
                    bookName,
                    author,
                    description,
                    ISBN: isbn,
                    categoryId,
                },
                Resources: (!resourceTitle && !resourceDescription && !previewResourceFile && !resourceLink && !resourceType) ? [] : [
                    {
                        title: resourceTitle,
                        description: resourceDescription,
                        file: previewResourceFile ? previewResourceFile : resourceLink,
                        type: resourceType,
                    },
                ],
                Grades: mappings?.map((mapping: any) => ({
                    schoolId: mapping?.school?.schoolId,
                    grade: mapping?.grades?.map((g: any) => g?.id),
                })
                ),
            };

            const formData = new FormData();
            formData?.append('bodyData', JSON?.stringify(body));

            if (uploadImage) formData?.append('coverImage', uploadImage);
            if (uploadPdf) formData?.append('bookPdf', uploadPdf);

            try {
                const response = await CreateBook(formData)?.unwrap();
                if (response?.success) {
                    toast?.success(response?.message);
                    dispatch(setBookName(''));
                    dispatch(setDescription(''));
                    dispatch(setAuthor(''));
                    dispatch(setISBN(''));
                    dispatch(setCategory(''));
                    dispatch(setPreviewImage(''));
                    dispatch(setUploadImage(null));
                    dispatch(setPreviewPdf(''));
                    dispatch(setUploadPdf(null));
                    dispatch(setResourceType(''));
                    dispatch(setResourceTitle(''));
                    dispatch(setResourceDescription(''));
                    dispatch(setPreviewResourceFile(''));
                    dispatch(setResourceLink(''));
                    route?.push('/admin/books');
                }
            } catch (error) {
                if ((error as any)?.status === 400) {
                    toast.warning(((error as any)?.data?.errors.map((err: any) => err?.message + ". ")) || ((error as any)?.data?.errorMessages.map((err: any) => err?.message + ". ")) || "Something went wrong");
                }
            }
        }
    };

    if (isLoading)
        return (
            <div className="flex justify-center items-center gap-2 text-lg text-[#1E3A8A]">
                Grades are loading...
                <div className="animate-spin">
                    <PiSpinner className="h-6 w-6 text-[#1E3A8A]" />
                </div>
            </div>
        );

    if (isError)
        return <p className="text-center text-red-500">Failed to load grades?</p>;

    return (
        <div>
            {mappings?.map((mapping) => {
                const { school, grades } = mapping;
                const filteredGradeOptions = school ? allGrades?.filter((g) => String(g?.schoolId) === String(school?.schoolId)) : [];

                return (
                    <div
                        key={mapping?.id}
                        className={`flex items-start gap-6 mb-6 relative ${pathname === '/admin/books' ? 'flex-col' : 'flex-col md:flex-row'
                            }`}
                    >
                        {/* School Name */}
                        <div className="flex-1 w-full">
                            <Label>School Name</Label>
                            <GetSchools
                                value={school}
                                onChange={(selectedSchool) =>
                                    handleSchoolChange(mapping?.id, selectedSchool)
                                }
                                excludeIds={selectedSchoolIds}
                            />
                        </div>

                        {/* Grade Section Mapping */}
                        <div className="flex-1 w-full">
                            <Label>Grade Section Mapping</Label>
                            <Select<GradeOption, true>
                                isMulti
                                options={filteredGradeOptions}
                                className="basic-multi-select mt-2"
                                classNamePrefix="select"
                                getOptionLabel={(option) => option?.label}
                                getOptionValue={(option) => option?.id}
                                value={grades}
                                onChange={(selectedOptions) =>
                                    handleGradeChange(mapping?.id, selectedOptions)
                                }
                                components={{
                                    MultiValueRemove: (props) => (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                if (pathname === '/admin/books') {
                                                    handleRemoveClick(props.data as GradeOption);
                                                }
                                            }}
                                            className="px-1 cursor-pointer text-gray-500 hover:text-red-600"
                                        >
                                            ✕
                                        </div>
                                    ),
                                }}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: '#CBD5E1',
                                        borderRadius: '0.5rem',
                                        boxShadow: 'none',
                                        padding: '2px 4px',
                                    }),
                                }}
                            />
                        </div>

                        {/* Remove Button */}
                        {mappings?.length > 1 && (
                            <Button
                                variant="ghost"
                                className="absolute -top-2 right-0 text-red-500 hover:text-red-700 hover:bg-transparent cursor-pointer"
                                onClick={() => handleRemoveMapping(mapping?.id)}
                            >
                                <FaTrash />
                            </Button>
                        )}

                        {/* Modal */}
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogContent className="p-6">
                                <DialogHeader>
                                    <DialogTitle>Remove Grade</DialogTitle>
                                </DialogHeader>
                                <p className="text-gray-700">
                                    Are you sure you want to remove{' '}
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
                                        className="px-4 py-2 bg-red-600 hover:bg-red-300 text-white rounded-md transition-all ease-in-out duration-500 cursor-pointer"
                                    >
                                        {isUpdating ? (
                                            <div className="flex justify-center items-center gap-2">
                                                Removing...
                                                <div className="animate-spin">
                                                    <PiSpinner className="h-4 w-4" />
                                                </div>
                                            </div>
                                        ) : (
                                            'Remove'
                                        )}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                );
            })}

            {/* Add More Button */}
            <Button
                onClick={handleAddMapping}
                className="font-semibold bg-[#1E3A8A1A] hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white rounded-xl px-6 py-2 transition-all duration-500 ease-in-out cursor-pointer mt-4"
            >
                <FaPlus className="mr-2" /> Add More
            </Button>

            {/* Footer Buttons */}
            <div className="flex justify-center items-center gap-3 pt-6">
                <Link href="/admin/books">
                    {
                        pathname === '/admin/books' ?
                            <></> :
                            <Button
                                variant="outline"
                                className="px-6 border-[#636F85] text-[#636F85]"
                            >
                                Cancel
                            </Button>
                    }
                </Link>

                <Button
                    onClick={handleSave}
                    className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A] text-white font-medium px-6"
                >
                    {isBookLoading || isUpdating ? (
                        <div className="flex justify-center items-center gap-2">
                            {pathname === '/admin/books' ? 'Updating...' : 'Saving...'}
                            <div className="animate-spin">
                                <PiSpinner className="h-4 w-4" />
                            </div>
                        </div>
                    ) : pathname === '/admin/books' ? (
                        'Update Book'
                    ) : (
                        'Save & Continue'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default Grade;