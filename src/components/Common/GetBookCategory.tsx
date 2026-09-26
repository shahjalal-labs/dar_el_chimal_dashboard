'use client';

import React from 'react';
import Select from 'react-select';
import Image from 'next/image';
import { useGetAllBookCategoriesQuery } from '@/redux/api/bookCategory';

import defaultImg from "@/assets/default.png";

export interface CategoryOption {
    readonly name: string;
    readonly categoryId: string;
    readonly image: string;
}

interface GetBookCategoryProps {
    value?: { name?: string; categoryId?: string; image?: string } | null;
    onChange: (category: { name: string; categoryId: string, image: string }) => void;
    placeholder?: string;
    className?: string;
}

export const GetBookCategory: React.FC<GetBookCategoryProps> = ({
    value,
    onChange,
    placeholder = "Search and select book category...",
    className,
}) => {
    const { data, isLoading } = useGetAllBookCategoriesQuery({ currentPage: 1, limit: 100 });

    const categoryOptions: readonly CategoryOption[] = React.useMemo(() => {
        return (
            data?.result?.result?.map((category: {
                id: string;
                name: string;
                image: string;
            }) => ({
                name: category.name,
                categoryId: category.id,
                image: category.image,
            })) ?? []
        );
    }, [data]);

    const selectedOption = React.useMemo(() => {
        if (!value || (!value.categoryId && !value.name)) return null;
        return (
            categoryOptions.find(
                (c) => (value.categoryId && c.categoryId === value.categoryId) || (value.name && c.name === value.name)
            ) || {
                name: value.name || '',
                categoryId: value.categoryId || '',
                image: value.image || '',
            }
        );
    }, [value, categoryOptions]);

    const hasSelectedCategory = Boolean(selectedOption && (selectedOption.categoryId || selectedOption.name));

    return (
        <Select<CategoryOption, false>
            placeholder={hasSelectedCategory ? "" : placeholder}
            isSearchable={true}
            isLoading={isLoading}
            options={categoryOptions}
            value={selectedOption}
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
            getOptionValue={(option) => option.categoryId}
            formatOptionLabel={(option, { context }) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image
                        src={option.image && typeof option.image === 'string' && option.image.trim() !== '' ? option.image : defaultImg}
                        height={24}
                        width={24}
                        alt={option.name || 'category'}
                        style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                        priority
                    />
                    <span className={context === 'menu' ? 'text-white' : 'text-gray-800'}>{option.name}</span>
                </div>
            )}
            styles={{
                container: (base) => ({
                    ...base,
                    marginTop: '0.5rem',
                }),
                control: (base, state) => ({
                    ...base,
                    borderColor: state.isFocused ? '#1E3A8A' : '#CBD5E1',
                    borderRadius: '0.5rem',
                    boxShadow: 'none',
                    padding: '2px 4px',
                    minHeight: '42px',
                    '&:hover': {
                        borderColor: '#94A3B8',
                    },
                }),
                placeholder: (base, state) => ({
                    ...base,
                    display: (state.hasValue || hasSelectedCategory) ? 'none' : 'block',
                    color: '#909296',
                    fontSize: '0.875rem',
                }),
                singleValue: (base) => ({
                    ...base,
                    display: 'flex',
                    alignItems: 'center',
                }),
                input: (base) => ({
                    ...base,
                    outline: 'none',
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: '#1E3A8A',
                    zIndex: 9999,
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
            className={className}
        />
    );
};

export default GetBookCategory;
