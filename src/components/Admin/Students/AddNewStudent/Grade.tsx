/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { clearGradeOptions, setGradeOptions } from '@/redux/features/studentSlice';
import { RootState } from '@/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';

const Grade = () => {
    const dispatch = useDispatch();
    const selectedFromRedux = useSelector((state: RootState) => state.school.options);
    const [selectedOptions, setSelectedOptions] = useState(selectedFromRedux);

    console.log(selectedFromRedux);
    console.log(selectedOptions);

    const handleChange = (newValue: any) => {
        setSelectedOptions(newValue);
        dispatch(setGradeOptions(newValue));
    };

    const handleSave = () => {
        console.log('Saving these options:', selectedOptions);
    };

    const isButtonDisabled = !selectedOptions?.length;
    return (
        <div>
            <Label>Grade Section Mapping</Label>
            <CreatableSelect
                isMulti
                value={selectedFromRedux}
                onChange={handleChange}
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
                    option: (base) => ({
                        ...base,
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                    }),
                }}
            />

            {/* Buttons */}
            <div className="flex justify-center gap-3 pt-3 mt-6">
                <Button
                    variant="outline"
                    className="px-6 border-[#636F85] text-[#636F85]"
                    onClick={() => dispatch(clearGradeOptions())}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    onClick={handleSave}
                    disabled={isButtonDisabled}
                    className={`px-6 text-white font-medium border border-[#1E3A8A] transition-all duration-300 ${isButtonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"
                        }`}
                >
                    Save & Continue
                </Button>
            </div>
        </div>
    );
};

export default Grade;