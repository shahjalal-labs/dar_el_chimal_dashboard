import React from 'react';
import RoleGuard from '@/components/RoleGaurd';
import ManageVendor from '@/components/Admin/ManageVendor';

const Page = () => {
    return (
        <RoleGuard role='ADMIN' category={null}>
            <ManageVendor />
        </RoleGuard>
    );
};

export default Page;