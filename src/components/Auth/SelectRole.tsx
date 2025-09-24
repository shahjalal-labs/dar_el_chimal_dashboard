'use client';

import React, { useState } from 'react';
import LeftSide from './LeftSide';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const SelectRole = () => {
    const [role, setRole] = useState("");
    const route = useRouter();

    const handleSelect = (value: string) => {
        setRole(value);
    };

    const handleNext = () => {
        if (role) {
            route.push(`/login`);
        } else {
            toast.error("Please select a role before continuing.");
        }
    };

    return (
        <div className="min-h-screen flex">
            <LeftSide />

            {/* Right Side */}
            <div className="flex flex-col justify-center items-center flex-1 px-8">
                <h1 className="text-3xl font-bold mb-2">Who are you logging in as?</h1>
                <p className="text-[#4C4C4C] text-lg mb-6">Please select your role to proceed.</p>

                <div className="space-y-4 w-full max-w-md">
                    {/* Student */}
                    <label
                        className={`flex items-start border rounded-lg p-4 cursor-pointer ${role === "student" ? "border-[#1E3A8A] bg-[#DFE5F6]" : "border-[#D8D8D8] bg-[#F7F9FF]"}`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value="student"
                            checked={role === "student"}
                            onChange={() => handleSelect("student")}
                            className="mt-2 mr-2"
                        />
                        <div>
                            <span className={`font-semibold ${role === 'admin' ? "text-[#1E3A8A]" : "text-black"}`}>I&apos;m a Student</span>
                            <p className="text-[#636F85]">View lessons, complete activities, and track your progress.</p>
                        </div>
                    </label>

                    {/* Teacher */}
                    <label
                        className={`flex items-start border rounded-lg p-4 cursor-pointer ${role === "teacher" ? "border-[#1E3A8A] bg-[#DFE5F6]" : "border-[#D8D8D8] bg-[#F7F9FF]"}`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value="teacher"
                            checked={role === "teacher"}
                            onChange={() => handleSelect("teacher")}
                            className="mt-2 mr-2"
                        />
                        <div>
                            <span className={`font-semibold ${role === 'admin' ? "text-[#1E3A8A]" : "text-black"}`}>I&apos;m a Teacher</span>
                            <p className="text-[#636F85]">Access your dashboard, manage classes, and share resources.</p>
                        </div>
                    </label>

                    {/* Admin */}
                    <label
                        className={`flex items-start border rounded-lg p-4 cursor-pointer ${role === "admin" ? "border-[#1E3A8A] bg-[#DFE5F6]" : "border-[#D8D8D8] bg-[#F7F9FF]"
                            }`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={role === "admin"}
                            onChange={() => handleSelect("admin")}
                            className="mt-2 mr-2"
                        />
                        <div>
                            <span className={`font-semibold ${role === 'admin' ? "text-[#1E3A8A]" : "text-black"}`}>I&apos;m an Admin</span>
                            <p className="text-[#636F85]">Manage users, oversee platform activity, and configure system settings.</p>
                        </div>
                    </label>
                </div>

                <button
                    onClick={handleNext}
                    className="mt-6 bg-[#1E3A8A] text-white px-8 py-2 rounded-lg hover:bg-[#1E3A8A]/90 disabled:opacity-50 w-full max-w-md transition-all duration-500 ease-in-out cursor-pointer"
                    disabled={!role}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default SelectRole;