/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import Select from 'react-select';
import Image from 'next/image';
import { useGetAllSchoolsByAdminQuery } from '@/redux/api/admin';

export interface SchoolOption {
    readonly schoolId: string;
    readonly schoolName: string;
    readonly image: string;
}

export interface GetSchoolProps {
    onChange: (school: SchoolOption) => void;
    excludeIds?: string[];
}

export const GetSchools: React.FC<GetSchoolProps> = ({ onChange, excludeIds = [] }) => {
    const { data } = useGetAllSchoolsByAdminQuery({ currentPage: 1, limit: 10000 });

    const schoolOptions: readonly SchoolOption[] =
        data?.result?.schools
            ?.map((school: { id: string; name: string; schoolLogo: string }) => ({
                schoolId: school.id,
                schoolName: school.name,
                image: school.schoolLogo,
            }))
            ?.filter((school: any) => !excludeIds.includes(school.schoolId)) ?? [];

    return (
        <Select
            placeholder=""
            options={schoolOptions}
            onChange={(selectedOption) => {
                if (selectedOption) onChange(selectedOption as SchoolOption);
            }}
            getOptionLabel={(option) => option.schoolName}
            formatOptionLabel={(option) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image
                        src={option.image}
                        height={50}
                        width={50}
                        alt={option.schoolName}
                        style={{ width: 24, height: 24, borderRadius: '50%' }}
                        priority
                    />
                    <span className='font-light'>{option.schoolName}</span>
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
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#2563EB' : '#1E3A8A',
                    color: '#FFFFFF',
                }),
            }}
        />
    );
};

export default GetSchools;