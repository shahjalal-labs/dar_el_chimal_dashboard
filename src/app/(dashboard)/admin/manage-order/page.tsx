import React from 'react';
import RoleGuard from '@/components/RoleGaurd';
import ManageOrder from '@/components/Admin/ManageOrder';

const Page = () => {
    return (
        <RoleGuard role='ADMIN' category={null}>
            <ManageOrder />
        </RoleGuard>
    );
};

export default Page;