import React from 'react';
import RoleGuard from '@/components/RoleGaurd';
import ManageTransactions from '@/components/Admin/ManageTransactions';

const Page = () => {
    return (
        <RoleGuard role='ADMIN' category={null}>
            <ManageTransactions />
        </RoleGuard>
    );
};

export default Page;