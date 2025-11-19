import React from 'react';
import BookCategoryList from '@/components/Admin/BookCategories/BookCategoryList';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <BookCategoryList />
        </RoleGuard>
    );
};

export default Page;