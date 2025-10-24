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
import { setAuthor, setBookName, setCategory, setDescription, setISBN, setPreviewImage, setPreviewPdf, setPreviewResourceFile, setResourceDescription, setResourceFile, setResourceLink, setResourceTitle, setResourceType, setSchoolGradeMappings, setUploadImage, setUploadPdf } from '@/redux/features/bookSlice';
import { RootState } from '@/redux/store/store';
import Image from 'next/image';
import { toast } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';
import { PiSpinner } from 'react-icons/pi';
import { useGetAllGradesQuery } from '@/redux/api/grade';
import { useCreateBookMutation, useGetSingleBookQuery, useUpdateBookMutation } from '@/redux/api/book';

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

const Grade = ({ id }: { id: string }) => {
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
        schoolGradeMappings
    } = useSelector((state: RootState) => state?.book);

    const { data } = useGetSingleBookQuery(id);
    const { data: gradesData, isLoading, isError } = useGetAllGradesQuery({ currentPage: 1, limit: 1000 });

    const [CreateBook, { isLoading: isBookLoading }] = useCreateBookMutation();
    const [UpdateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

    const [mappings, setMappings] = useState<Mapping[]>([{ id: Date?.now()?.toString(), school: null, grades: [] }]);

    // Prepare grade options from API
    const allGrades: GradeOption[] =
        gradesData?.result?.map((singleGrade: any) => ({
            id: singleGrade?.id,
            label: singleGrade?.grade,
            schoolId: singleGrade?.schoolId,
        })) ?? [];

    useEffect(() => {
        if (data?.result) {
            const payload = data?.result?.grades?.map((m: any) => ({
                schoolId: m?.schoolId,
                schoolName: m?.schoolName || '',
                image: m?.schoolLogo || '',
                grade: m?.gradesinthisSchool?.map((g: any) => g?.id),
            }));

            dispatch(setSchoolGradeMappings(payload));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    // 🧩 Preload existing Redux data into mappings
    useEffect(() => {
        if (gradesData && schoolGradeMappings && schoolGradeMappings?.length > 0) {
            const preloadedMappings: Mapping[] = schoolGradeMappings?.map(
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
                        id: Math?.random()?.toString(),
                        school,
                        grades,
                    };
                }
            );
            setMappings(preloadedMappings);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gradesData, schoolGradeMappings]);

    const handleAddMapping = () => {
        setMappings((prev) => [
            ...prev,
            { id: Date?.now()?.toString(), school: null, grades: [] },
        ]);
    };

    const handleRemoveMapping = (id: string) => {
        setMappings((prev) => prev?.filter((item) => item?.id !== id));
    };

    const handleSchoolChange = (id: string, school: SchoolOption) => {
        setMappings((prev) =>
            prev?.map((item) =>
                item?.id === id ? { ...item, school, grades: [] } : item
            )
        );
    };

    const handleGradeChange = (id: string, selectedGrades: readonly GradeOption[]) => {
        setMappings((prev) =>
            prev?.map((item) =>
                item?.id === id ? { ...item, grades: [...selectedGrades] } : item
            )
        );
    };

    const selectedSchoolIds = useMemo(
        () => mappings?.filter((m) => m?.school)?.map((m) => m?.school!.schoolId),
        [mappings]
    );

    const handleSave = async () => {
        const payload = mappings
            ?.filter((m) => m?.school)
            ?.map((m) => ({
                schoolId: m?.school!.schoolId,
                schoolName: m?.school!.schoolName,
                image: m?.school!.image,
                grade: m?.grades?.map((g) => g?.id),
            }));

        dispatch(setSchoolGradeMappings(payload));

        if (pathname === '/admin/books') {
            console?.log(schoolGradeMappings);
            const body = {
                NewGradesAssign: schoolGradeMappings?.map((mapping: { schoolId: string, grade: string[] }) => ({
                    schoolId: mapping?.schoolId,
                    grade: mapping?.grade,
                })),
            }

            const formData = new FormData();
            formData?.append('bodyData', JSON?.stringify(body))

            try {
                const response = await UpdateBook({ bookId: id, formData })?.unwrap();
                if (response?.success) {
                    toast?.success(response?.message);
                }
            } catch (error) {
                toast?.warning((error as any)?.data?.message || "Something went wrong");
            }
        }
        else {
            const body = {
                BookData: {
                    bookName: bookName,
                    author: author,
                    description: description,
                    ISBN: isbn,
                    categoryId: categoryId
                },
                Resources: [
                    {
                        title: resourceTitle,
                        description: resourceDescription,
                        file: previewResourceFile,
                        type: resourceType
                    }
                ],
                Grades: schoolGradeMappings?.map((mapping: { schoolId: string, grade: string[] }) => ({
                    schoolId: mapping?.schoolId,
                    grade: mapping?.grade,
                })),
            }

            const formData = new FormData();
            formData?.append('bodyData', JSON?.stringify(body))

            if (uploadImage) {
                formData?.append('coverImage', uploadImage)
            }

            if (uploadPdf) {
                formData?.append('bookPdf', uploadPdf)
            }

            try {
                const response = await CreateBook(formData)?.unwrap();
                if (response?.success) {
                    toast?.success(response?.message);
                    dispatch(setBookName(''))
                    dispatch(setDescription(''))
                    dispatch(setAuthor(''))
                    dispatch(setISBN(''))
                    dispatch(setCategory(''))
                    dispatch(setPreviewImage(''))
                    dispatch(setUploadImage(null))
                    dispatch(setPreviewPdf(''))
                    dispatch(setUploadPdf(null))
                    dispatch(setResourceType(''))
                    dispatch(setResourceTitle(''))
                    dispatch(setResourceDescription(''))
                    dispatch(setResourceFile(null))
                    dispatch(setPreviewResourceFile(''))
                    dispatch(setResourceLink(''))
                    route?.push('/admin/books');
                }
            } catch (error) {
                toast?.warning((error as any)?.data?.message || "Something went wrong");
            }
        }
    };

    if (isLoading) return <p>Loading grades...</p>;
    if (isError) return <p>Failed to load grades?</p>;

    return (
        <div>
            {mappings?.map((mapping) => {
                const { school, grades } = mapping;

                // Filter grades for the selected school
                const filteredGradeOptions = school
                    ? allGrades?.filter(
                        (g) => String(g?.schoolId) === String(school?.schoolId)
                    )
                    : [];

                return (
                    <div
                        key={mapping?.id}
                        className="flex flex-col md:flex-row items-start gap-6 mb-6 relative"
                    >
                        {/* School Name */}
                        <div className="flex-1 relative w-full">
                            <Label>School Name</Label>
                            <GetSchools
                                onChange={(selectedSchool) =>
                                    handleSchoolChange(mapping?.id, selectedSchool)
                                }
                                excludeIds={selectedSchoolIds}
                            />

                            {/* Display selected school */}
                            {school && (
                                <div className="flex items-center gap-2 mt-2 absolute top-[35%] left-4">
                                    {school?.image && (
                                        <Image
                                            src={school?.image}
                                            height={32}
                                            width={24}
                                            alt={school?.schoolName}
                                            className="rounded-xl"
                                        />
                                    )}
                                    <span>{school?.schoolName}</span>
                                </div>
                            )}
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
                    </div>
                );
            })}

            {/* Add More Button */}
            <Button
                onClick={handleAddMapping}
                className="font-semibold bg-[#1E3A8A1A] hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white rounded-xl px-6 py-2?.5 transition-all duration-500 ease-in-out cursor-pointer mt-4"
            >
                <FaPlus className="mr-2" /> Add More
            </Button>

            {/* Footer Buttons */}
            <div className="flex justify-center items-center gap-3 pt-6">
                <Link href="/admin/books">
                    <Button
                        variant="outline"
                        className="px-6 border-[#636F85] text-[#636F85] font-medium"
                    >
                        Cancel
                    </Button>
                </Link>

                <Button
                    onClick={handleSave}
                    className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A] text-white font-medium px-6"
                >
                    {
                        (isBookLoading || isUpdating) ?
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