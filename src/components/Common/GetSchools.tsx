/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import Select from 'react-select';
import Image from 'next/image';
import { useGetAllSchoolsByAdminQuery } from '@/redux/api/admin';
import schoolImg from "@/assets/school.png";

export interface SchoolOption {
    readonly schoolId: string;
    readonly schoolName: string;
    readonly image: string;
}

export interface GetSchoolProps {
    onChange: (school: SchoolOption) => void;
    excludeIds?: string[];
    value?: SchoolOption | null;
    placeholder?: string;
    className?: string;
}

export const GetSchools: React.FC<GetSchoolProps> = ({
    onChange,
    excludeIds = [],
    value,
    placeholder = "Search and select school...",
    className,
}) => {
    const { data, isLoading } = useGetAllSchoolsByAdminQuery({ currentPage: 1, limit: 10000, searchTerm: "" });

    const schoolOptions: readonly SchoolOption[] = React.useMemo(() => {
        return (
            data?.result?.schools
                ?.map((school: { id: string; name: string; schoolLogo: string }) => ({
                    schoolId: school.id,
                    schoolName: school.name,
                    image: school.schoolLogo,
                }))
                ?.filter((school: any) => !excludeIds.includes(school.schoolId)) ?? []
        );
    }, [data, excludeIds]);

    const selectedOption = React.useMemo(() => {
        if (!value) return null;
        return schoolOptions.find((s) => s.schoolId === value.schoolId) || value;
    }, [value, schoolOptions]);

    return (
        <Select<SchoolOption, false>
            placeholder={placeholder}
            isSearchable={true}
            isLoading={isLoading}
            options={schoolOptions}
            value={selectedOption}
            onChange={(selectedOption) => {
                if (selectedOption) onChange(selectedOption as SchoolOption);
            }}
            getOptionLabel={(option) => option.schoolName}
            getOptionValue={(option) => option.schoolId}
            formatOptionLabel={(option) => (
                <div className="flex items-center gap-2">
                    <Image
                        src={option.image || schoolImg}
                        height={24}
                        width={24}
                        alt={option.schoolName}
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                        priority
                    />
                    <span className="text-sm text-gray-800 truncate">{option.schoolName}</span>
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
                    '&:hover': {
                        borderColor: '#94A3B8',
                    },
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                        ? '#1E3A8A'
                        : state.isFocused
                        ? '#EFF6FF'
                        : '#FFFFFF',
                    color: state.isSelected ? '#FFFFFF' : '#1F2937',
                    cursor: 'pointer',
                }),
                menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                }),
            }}
            className={className}
        />
    );
};

export default GetSchools;