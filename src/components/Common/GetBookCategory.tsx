'use client';

import React from 'react';
import Select from 'react-select';
import Image from 'next/image';
import { useGetAllBookCategoriesQuery } from '@/redux/api/admin/bookCategory';

export interface CategoryOption {
    readonly categoryName: string;
    readonly categoryId: string;
    readonly image: string;
}

interface GetBookCategoryProps {
    onChange: (category: { categoryName: string; categoryId: string, categoryImage: string }) => void;
}

export const GetBookCategory: React.FC<GetBookCategoryProps> = ({ onChange }) => {
    const { data } = useGetAllBookCategoriesQuery({ currentPage: 1, limit: 100 });

    const categoryOptions: readonly CategoryOption[] =
        data?.result?.result?.map((category: {
            id: string;
            name: string;
            image: string;
        }) => ({
            categoryName: category.name,
            categoryId: category.id,
            image: category.image,
        })) ?? [];

    return (
        <Select
            placeholder=""
            options={categoryOptions}
            onChange={(selectedOption) => {
                if (selectedOption) {
                    onChange({
                        categoryName: selectedOption.categoryName,
                        categoryId: selectedOption.categoryId,
                        categoryImage: selectedOption.image,
                    });
                }
            }}
            getOptionLabel={(option) => option.categoryName}
            formatOptionLabel={(option) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image
                        src={option.image}
                        height={50}
                        width={50}
                        alt={option.categoryName}
                        style={{ width: 24, height: 24, borderRadius: '50%' }}
                        priority
                    />
                    <span className='text-white'>{option.categoryName}</span>
                </div>
            )}
            styles={{
                container: (base) => ({
                    ...base,
                    marginTop: '0.5rem',
                }),
                control: (base) => ({
                    ...base,
                    borderColor: '#CBD5E1',
                    borderRadius: '0.5rem',
                    boxShadow: 'none',
                    padding: '2px 4px',
                }),
                placeholder: (base) => ({
                    ...base,
                    color: '#909296',
                    fontSize: '0.875rem',
                }),
                input: (base) => ({
                    ...base,
                    outline: 'none',
                }),
            }}
        />
    );
};

export default GetBookCategory;
