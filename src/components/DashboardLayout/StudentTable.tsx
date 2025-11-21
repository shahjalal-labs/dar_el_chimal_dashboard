'use client';

import React from 'react';
import DataTable from '../Common/DataTable';
import Image from 'next/image';
import defaultImg from '@/assets/no-img.jpg';
import { useGetAllStudentsByAdminQuery } from '@/redux/api/admin';

const StudentTable = () => {
    const { data: allStudents, isLoading } = useGetAllStudentsByAdminQuery({ schoolId: undefined });

    const adminFormattedData = allStudents?.result?.meta?.result?.slice(0, 5).map((entry:
        {
            id: string,
            profileImage: string,
            fullName: string,
            loginUserName: string,
            email: string,
            phone: string,
            gender: string,
            status: string,
            joinedAt: string,
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
            "User Name": entry.loginUserName,
            "Email": entry.email,
            "Phone": entry.phone,
            "Gender": entry.gender,
            "Status": entry.status,
            "Joined At": new Date(entry.joinedAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
        }));

    return (
        <>
            <DataTable title="Student List" data={adminFormattedData} isLoading={isLoading} currentPage={1} willSearch={false} />
        </>
    );
};

export default StudentTable;