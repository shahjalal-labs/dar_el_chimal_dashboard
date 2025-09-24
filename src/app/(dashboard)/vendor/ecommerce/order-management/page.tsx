import React from 'react';
import OrderManagement from '@/components/Ecommerce/OrderManagement';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='VENDOR' category='E_COMMERCE'>
            <OrderManagement />
        </RoleGuard>
    );
};

export default Page;