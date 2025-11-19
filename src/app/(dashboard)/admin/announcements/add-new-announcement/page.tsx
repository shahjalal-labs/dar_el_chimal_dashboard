import React from 'react';
import AddNewAnnouncement from '@/components/Admin/Announcement/AddNewAnnouncement';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <AddNewAnnouncement />
        </RoleGuard>
    );
};

export default Page;