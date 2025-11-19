import React from 'react';
import SchoolList from '@/components/Admin/Schools/SchoolList';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <SchoolList />
        </RoleGuard>
    );
};

export default Page;