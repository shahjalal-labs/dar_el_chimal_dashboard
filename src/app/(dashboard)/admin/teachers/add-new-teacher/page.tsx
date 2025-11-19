import React from 'react';
import AddNewTeacher from '@/components/Admin/Teachers/AddNewTeacher/AddNewTeacher';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <AddNewTeacher />
        </RoleGuard>
    );
};

export default Page;