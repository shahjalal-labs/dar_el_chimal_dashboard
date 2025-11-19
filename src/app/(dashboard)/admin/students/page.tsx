
import React from 'react';
import StudentList from '@/components/Admin/Students/StudentList';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <StudentList />
        </RoleGuard>
    );
};

export default Page;