'use client';

import React from 'react';
import Select from 'react-select';
import Image from 'next/image';
import { useGetAllBookCategoriesQuery } from '@/redux/api/bookCategory';

export interface CategoryOption {
    readonly name: string;
    readonly categoryId: string;
    readonly image: string;
}

interface GetBookCategoryProps {
    onChange: (category: { name: string; categoryId: string, image: string }) => void;
}

export const GetBookCategory: React.FC<GetBookCategoryProps> = ({ onChange }) => {
    const { data } = useGetAllBookCategoriesQuery({ currentPage: 1, limit: 100 });

    const categoryOptions: readonly CategoryOption[] =
        data?.result?.result?.map((category: {
            id: string;
            name: string;
            image: string;
        }) => ({
            name: category.name,
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
                        name: selectedOption.name,
                        categoryId: selectedOption.categoryId,
                        image: selectedOption.image,
                    });
                }
            }}
            getOptionLabel={(option) => option.name}
            formatOptionLabel={(option) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image
                        src={option.image}
                        height={50}
                        width={50}
                        alt={option.name}
                        style={{ width: 24, height: 24, borderRadius: '50%' }}
                        priority
                    />
                    <span className='text-white'>{option.name}</span>
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
                menu: (base) => ({
                    ...base,
                    backgroundColor: '#1E3A8A',
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#3B82F6' : '#1E3A8A',
                    color: state.isFocused ? '#FFFFFF' : '#E2E8F0',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    transition: 'background-color 0.2s ease',
                }),
            }}
        />
    );
};

export default GetBookCategory;
