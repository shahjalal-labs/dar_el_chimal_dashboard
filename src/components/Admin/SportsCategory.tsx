'use client';

import React from 'react';
import DataTable from '../Common/DataTable';
import { useGetAllParentCategoriesQuery } from '@/redux/api/admin/parentCategory';
import { FaPlus } from 'react-icons/fa';

const SportsCategory = () => {
    const { data } = useGetAllParentCategoriesQuery(undefined);

    const formattedData = data?.result?.map((entry:
        { id: string, name: string, createdAt: string, updatedAt: string, categories: { id: string, length: number } }
    ) => ({
        "Id": entry?.id,
        "Parent Category Name": entry?.name,
        "Total Sub-categories": entry?.categories?.length,
        "Created At": new Date(entry?.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
        "Updated At": new Date(entry?.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
    }));

    return (
        <DataTable
            title="All Parent Categories"
            data={formattedData}
            isButton={true}
            buttonText='Add Parent Category'
            icon={<FaPlus />}
            currentPage={1}
        />
    );
};

export default SportsCategory;