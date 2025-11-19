import React from 'react';
import AddNewSchool from '@/components/Admin/Schools/AddNewSchool/AddNewSchool';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <AddNewSchool />
        </RoleGuard>
    );
};

export default Page;