"use client";

import React from 'react';
import Image from 'next/image';
import DataTable from '../Common/DataTable';
import defaultImg from '@/assets/no-img.jpg';
import { useGetAllStudentsByTeacherQuery } from '@/redux/api/teacher/overviewApi';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { TfiAngleLeft } from 'react-icons/tfi';

const Students = () => {
    const route = useRouter();
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
            <Button onClick={() => route.back()} className='mb-6 bg-white/80 text-black cursor-pointer'><TfiAngleLeft />Back</Button>
            <DataTable title={`Students (${formattedData?.length})`} data={formattedData} willSearch={true} />
        </div>
    );
};

export default Students;