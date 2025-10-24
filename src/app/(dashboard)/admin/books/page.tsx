import React from 'react';
import Books from '@/components/Admin/Books/Books';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <Books />
        </RoleGuard>
    );
};

export default Page;