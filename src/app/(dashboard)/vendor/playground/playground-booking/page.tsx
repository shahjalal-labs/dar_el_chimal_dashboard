import React from 'react';
import PlaygroundBooking from '@/components/Playground/PlaygroundBooking';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='VENDOR' category='PLAYGROUND'>
            <PlaygroundBooking />
        </RoleGuard>
    );
};

export default Page;