import React from 'react';
import BankInfo from '@/components/Common/BankInfo';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='VENDOR' category={null}>
            <BankInfo />
        </RoleGuard>
    );
};

export default Page;