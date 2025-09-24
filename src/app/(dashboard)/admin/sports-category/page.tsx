import React from 'react';
import RoleGuard from '@/components/RoleGaurd';
import SportsCategory from '@/components/Admin/SportsCategory';

const Page = () => {
    return (
        <RoleGuard role='ADMIN' category={null}>
            <SportsCategory />
        </RoleGuard>
    );
};

export default Page;