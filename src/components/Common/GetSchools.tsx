'use client';

import React from 'react';
import Select from 'react-select';
import Image from 'next/image';
import { useGetAllSchoolsQuery } from '@/redux/api/admin/school';

export interface SchoolOption {
    readonly schoolName: string;
    readonly schoolId: string;
    readonly image: string;
}

interface GetSchoolProps {
    onChange: (school: { schoolName: string; schoolId: string, image: string }) => void;
}

export const GetSchools: React.FC<GetSchoolProps> = ({ onChange }) => {
    const { data } = useGetAllSchoolsQuery({ currentPage: 1, limit: 10000 });

    const schoolOptions: readonly SchoolOption[] =
        data?.result?.schools?.map((school: {
            id: string;
            name: string;
            schoolLogo: string;
        }) => ({
            schoolName: school.name,
            schoolId: school.id,
            image: school.schoolLogo,
        })) ?? [];

    return (
        <Select
            placeholder=""
            options={schoolOptions}
            onChange={(selectedOption) => {
                if (selectedOption) {
                    onChange({
                        schoolName: selectedOption.schoolName,
                        schoolId: selectedOption.schoolId,
                        image: selectedOption.image,
                    });
                }
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
                    <span className='text-white'>{option.schoolName}</span>
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

export default GetSchools;
