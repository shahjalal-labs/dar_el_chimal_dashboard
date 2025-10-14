import React from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { useGetTeacherDetailsQuery } from '@/redux/api/teacher';

const ViewTeacherModal = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetTeacherDetailsQuery(id);
    return (
        <DialogContent>

        </DialogContent>
    );
};

export default ViewTeacherModal;