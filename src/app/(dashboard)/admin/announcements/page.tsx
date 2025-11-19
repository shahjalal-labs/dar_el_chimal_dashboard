import React from 'react';
import AnnouncementList from '@/components/Admin/Announcement/AnnouncementList';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <AnnouncementList />
        </RoleGuard>
    );
};

export default Page;