import React from 'react';
import ManageEvent from '@/components/Event/ManageEvent';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='VENDOR' category='EVENT'>
            <ManageEvent />
        </RoleGuard>
    );
};

export default Page;