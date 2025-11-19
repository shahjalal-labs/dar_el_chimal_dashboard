import React from 'react';
import TeacherList from '@/components/Admin/Teachers/TeacherList';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <TeacherList />
        </RoleGuard>
    );
};

export default Page;