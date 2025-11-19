import React from 'react';
import AddNewBook from '@/components/Admin/Books/AddNewBook/AddNewBook';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <AddNewBook />
        </RoleGuard>
    );
};

export default Page;