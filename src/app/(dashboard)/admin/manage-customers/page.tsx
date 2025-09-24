import React from 'react';
import ManageCustomers from '@/components/Admin/ManageCustomers';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='ADMIN' category={null}>
            <ManageCustomers />
        </RoleGuard>
    );
};

export default Page;