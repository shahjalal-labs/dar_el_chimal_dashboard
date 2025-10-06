import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

const Grade = () => {
    return (
        <div>
            <div className="flex items-start gap-6">
                {/* School Name */}
                <div className="flex-1">
                    <Label>School Name</Label>
                    <Input />
                </div>
                {/* Grade Section Mapping */}
                <div className="flex-1">
                    <Label>Grade Section Mapping</Label>
                    <Input />
                    <div className="mt-6 flex items-center gap-4">
                        <Button className="font-semibold bg-[#1E3A8A1A] hover:bg-[#1E3A8A] text-black hover:text-white rounded-xl px-6 py-2.5 transition-all duration-500 ease-in-out cursor-pointer">All</Button>
                        <Button className="text-[#D00E11] font-semibold bg-[#D00E111A] hover:bg-[#D00E11] hover:text-white rounded-xl px-6 py-2.5 transition-all duration-500 ease-in-out cursor-pointer">Clear</Button>
                    </div>
                </div>
            </div>
            <Button className="font-semibold bg-[#1E3A8A1A] hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white rounded-xl px-6 py-2.5 transition-all duration-500 ease-in-out cursor-pointer"><FaPlus />Add More</Button>

            <div className="flex justify-center items-center gap-3 pt-3">
                <Link href="/admin/books">
                    <Button
                        variant="outline"
                        className="px-6 border-[#636F85] text-[#636F85] font-medium"
                    >
                        Cancel
                    </Button>
                </Link>

                <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A] text-white font-medium px-6">
                    Save & Continue
                </Button>
            </div>
        </div>
    );
};

export default Grade;