import React from 'react';
import GroundAvailability from '@/components/Playground/GroundAvailability';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='VENDOR' category='PLAYGROUND'>
            <GroundAvailability />
        </RoleGuard>
    );
};

export default Page;