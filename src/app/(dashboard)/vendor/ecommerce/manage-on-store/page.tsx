import React from 'react';
import ManageOnStore from '@/components/Ecommerce/ManageOnStore';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='VENDOR' category='E_COMMERCE'>
            <ManageOnStore />
        </RoleGuard>
    );
};

export default Page;