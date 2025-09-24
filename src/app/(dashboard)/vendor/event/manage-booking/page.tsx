import React from 'react';
import ManageBooking from '@/components/Event/ManageBooking';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='VENDOR' category='EVENT'>
            <ManageBooking />
        </RoleGuard>
    );
};

export default Page;