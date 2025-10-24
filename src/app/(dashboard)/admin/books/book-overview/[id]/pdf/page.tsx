import React from 'react';
import PDF from '@/components/Admin/Books/PDF';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <PDF />
        </RoleGuard>
    );
};

export default Page;