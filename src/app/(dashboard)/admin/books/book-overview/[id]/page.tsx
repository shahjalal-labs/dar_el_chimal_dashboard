import React from 'react';
import BookOverview from '@/components/Admin/Books/BookOverview';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <BookOverview />
        </RoleGuard>
    );
};
export default Page;