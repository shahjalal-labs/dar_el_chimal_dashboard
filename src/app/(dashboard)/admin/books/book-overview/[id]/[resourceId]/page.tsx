import React from 'react';
import ResourceDetails from '@/components/Admin/Books/Resources/ResourceDetails';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <ResourceDetails />
        </RoleGuard>
    );
};

export default Page;