import React from 'react';
import ManageProduct from '@/components/Ecommerce/ManageProduct';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='VENDOR' category='E_COMMERCE'>
            <ManageProduct />
        </RoleGuard>
    );
};

export default Page;