"use client";

import React from 'react';
import Image from 'next/image';
import DataTable from '../Common/DataTable';
import defaultImg from '@/assets/no-img.jpg';
import { useGetAllStudentsByTeacherQuery } from '@/redux/api/teacher/overviewApi';
import { useParams } from 'next/navigation';

const Student = () => {
    const { id } = useParams();
    const { data } = useGetAllStudentsByTeacherQuery(id);

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

    return (
        <div>
            <DataTable title={`Students (${formattedData?.length})`} data={formattedData} willSearch={true} />
        </div>
    );
};

export default Student;