"use client";

import { setUser } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import LeftSide from "./LeftSide";

const SelectRole = () => {
  const route = useRouter();
  const dispatch = useDispatch();
  const [role, setRole] = useState("");

  const handleSelect = (value: string) => {
    setRole(value);
    dispatch(setUser(value));
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
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Who are you logging in as?</h1>
        <p className="text-[#4C4C4C] text-lg mb-6">Please select your role to proceed.</p>

        <div className="space-y-4 w-full max-w-md">
          {/* Student */}
          <label className={`flex items-start border rounded-lg p-4 cursor-pointer ${role === "Student" ? "border-[#1E3A8A] bg-[#DFE5F6]" : "border-[#D8D8D8] bg-[#F7F9FF]"}`}
          >
            <Input
              type="radio"
              name="role"
              value="Student"
              checked={role === "Student"}
              onChange={() => handleSelect("Student")}
              className="mt-2 mr-2 accent-[#1E3A8A] w-fit"
            />
            <div>
              <span className={`font-semibold ${role === "Admin" ? "text-[#1E3A8A]" : "text-black"}`}>I&apos;m a Student</span>
              <p className="text-[#636F85]">View lessons, complete activities, and track your progress.</p>
            </div>
          </label>

          {/* Teacher */}
          <label className={`flex items-start border rounded-lg p-4 cursor-pointer ${role === "Teacher" ? "border-[#1E3A8A] bg-[#DFE5F6]" : "border-[#D8D8D8] bg-[#F7F9FF]"}`}>
            <Input
              type="radio"
              name="role"
              value="Teacher"
              checked={role === "Teacher"}
              onChange={() => handleSelect("Teacher")}
              className="mt-2 mr-2 accent-[#1E3A8A] w-fit"
            />
            <div>
              <span className={`font-semibold ${role === "admin" ? "text-[#1E3A8A]" : "text-black"}`}>I&apos;m a Teacher</span>
              <p className="text-[#636F85]">Access your dashboard, manage classes, and share resources.</p>
            </div>
          </label>

          {/* Admin */}
          <label className={`flex items-start border rounded-lg p-4 cursor-pointer ${role === "Admin" ? "border-[#1E3A8A] bg-[#DFE5F6]" : "border-[#D8D8D8] bg-[#F7F9FF]"}`}>
            <Input
              type="radio"
              name="role"
              value="Admin"
              checked={role === "Admin"}
              onChange={() => handleSelect("Admin")}
              className="mt-2 mr-2 accent-[#1E3A8A] w-fit"
            />
            <div>
              <span className={`font-semibold ${role === "Admin" ? "text-[#1E3A8A]" : "text-black"}`}>I&apos;m an Admin</span>
              <p className="text-[#636F85]">Manage users, oversee platform activity, and configure system settings.</p>
            </div>
          </label>
        </div>

        <Button
          disabled={!role}
          onClick={handleNext}
          className="mt-6 bg-[#1E3A8A] text-white px-8 py-2 rounded-lg hover:bg-[#1E3A8A]/90 disabled:opacity-50 w-full max-w-md transition-all duration-500 ease-in-out cursor-pointer"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SelectRole;
