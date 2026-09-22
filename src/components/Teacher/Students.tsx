/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import DataTable from '../Common/DataTable';
import defaultImg from '@/assets/no-img.jpg';
import {
    useGetAllStudentsByTeacherQuery,
    useGetTeacherOverviewQuery,
} from '@/redux/api/teacher/overviewApi';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { TfiAngleLeft } from 'react-icons/tfi';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const Students = () => {
    const route = useRouter();
    const { id } = useParams();

    const { data: teacherOverviewData } = useGetTeacherOverviewQuery(undefined);
    const teacherGrades = useMemo(
        () => teacherOverviewData?.result?.grades || [],
        [teacherOverviewData]
    );

    const [selectedGradeId, setSelectedGradeId] = useState<string>(
        id && id !== 'all' ? (id as string) : ''
    );

    useEffect(() => {
        if (id && id !== 'all') {
            setSelectedGradeId(id as string);
        } else if (!selectedGradeId && teacherGrades.length > 0) {
            setSelectedGradeId(teacherGrades[0].id);
        }
    }, [id, teacherGrades, selectedGradeId]);

    const { data, isLoading } = useGetAllStudentsByTeacherQuery(selectedGradeId, {
        skip: !selectedGradeId,
    });

    const handleGradeChange = (gradeId: string) => {
        setSelectedGradeId(gradeId);
        route.replace(`/teacher/classes/${gradeId}/students`);
    };

    const formattedData = data?.result?.students?.map((entry:
        {
            id: string,
            profileImage: string,
            fullName: string,
            email: string,
            phone: string,
            gender: string,
            DOB: string,
        }) => ({
            "Id": entry.id,
            "Picture": (
                <Image
                    src={entry.profileImage || defaultImg}
                    height={50}
                    width={50}
                    alt={entry.fullName || "Full Name"}
                    className="w-8 h-8 rounded-full object-cover"
                    priority
                />
            ),
            "Full Name": entry.fullName,
            "Email": entry.email,
            "Phone": entry.phone,
            "Gender": entry.gender,
            "Date of Birth": entry.DOB,
        }));

    const currentGrade = teacherGrades.find((g: any) => g.id === selectedGradeId);

    return (
        <div>
            <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6'>
                <Button onClick={() => route.back()} className='bg-white/80 text-black hover:text-white cursor-pointer w-fit h-10'>
                    <TfiAngleLeft />Back
                </Button>

                {teacherGrades.length > 0 && (
                    <div className='w-48 sm:w-56'>
                        <Select value={selectedGradeId} onValueChange={handleGradeChange}>
                            <SelectTrigger className='bg-white border-gray-300 text-sm font-medium shadow-sm h-10'>
                                <SelectValue placeholder='Select Class' />
                            </SelectTrigger>
                            <SelectContent className='bg-white z-50 shadow-md'>
                                {teacherGrades.map((g: any) => (
                                    <SelectItem key={g.id} value={g.id}>
                                        {g.grade}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <DataTable
                title={`Students in ${currentGrade?.grade || "Class"} (${formattedData?.length || 0})`}
                data={formattedData || []}
                isLoading={isLoading}
                willSearch={true}
            />
        </div>
    );
};

export default Students;