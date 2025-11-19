import React from 'react';
import AddNewStudent from '@/components/Admin/Students/AddNewStudent/AddNewStudent';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <AddNewStudent />
        </RoleGuard>
    );
};

export default Page;