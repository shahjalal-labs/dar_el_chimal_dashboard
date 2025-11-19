import React from 'react';
import ViewAnnouncement from '@/components/Admin/Announcement/ViewAnnouncement';
import RoleGuard from '@/components/RoleGaurd';

const Page = () => {
    return (
        <RoleGuard role='Admin'>
            <ViewAnnouncement />
        </RoleGuard>
    );
};

export default Page;