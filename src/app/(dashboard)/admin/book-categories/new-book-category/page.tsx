import React from 'react';
import NewBookCategory from '@/components/Admin/BookCategories/NewBookCategory';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <NewBookCategory />
        </RoleGuard>
    );
};

export default Page;