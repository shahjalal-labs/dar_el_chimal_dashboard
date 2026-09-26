/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FaAngleDown, FaCheck } from "react-icons/fa";
import { Search, X } from "lucide-react";
import Image from "next/image";
import defaultSchoolImg from "@/assets/school.png";

interface SchoolFilterDropdownProps {
  value: string; // schoolId or ""
  onChange: (schoolId: string) => void;
  schools: Array<{ id: string; name: string; schoolLogo?: string }>;
  isLoading?: boolean;
  placeholder?: string;
}

export const SchoolFilterDropdown: React.FC<SchoolFilterDropdownProps> = ({
  value,
  onChange,
  schools = [],
  isLoading = false,
  placeholder = "Select School",
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedSchool = useMemo(() => {
    if (!value || value === "all") return null;
    return schools.find((s) => s.id === value) || null;
  }, [value, schools]);

  const filteredSchools = useMemo(() => {
    if (!searchTerm.trim()) return schools;
    const term = searchTerm.trim().toLowerCase();
    return schools.filter((s) => s.name?.toLowerCase().includes(term));
  }, [schools, searchTerm]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-fit border border-[#1E3A8A] text-[#1E3A8A] bg-white hover:bg-[#1E3A8A]/5 cursor-pointer flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm font-medium outline-none transition-colors min-w-[150px] max-w-[240px]"
        >
          <span className="truncate">
            {selectedSchool ? selectedSchool.name : placeholder}
          </span>
          <FaAngleDown
            className={`text-[#1E3A8A] shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-72 p-2 bg-white shadow-xl border border-gray-200 rounded-lg z-[9999]"
      >
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search school..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-colors"
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="max-h-60 overflow-y-auto space-y-0.5 text-sm">
          {/* All Schools Option */}
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
              setSearchTerm("");
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors text-left ${
              !value || value === "all"
                ? "bg-[#1E3A8A] text-white"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <span>All Schools</span>
            {(!value || value === "all") && (
              <FaCheck className="h-3 w-3 shrink-0" />
            )}
          </button>

          {isLoading ? (
            <div className="text-center py-4 text-xs text-gray-400">
              Loading schools...
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="text-center py-4 text-xs text-gray-400">
              No schools found
            </div>
          ) : (
            filteredSchools.map((school) => {
              const isSelected = value === school.id;
              return (
                <button
                  key={school.id}
                  type="button"
                  onClick={() => {
                    onChange(school.id);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors text-left ${
                    isSelected
                      ? "bg-[#1E3A8A] text-white"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Image
                      src={
                        school.schoolLogo &&
                        typeof school.schoolLogo === "string" &&
                        school.schoolLogo.trim() !== ""
                          ? school.schoolLogo
                          : defaultSchoolImg
                      }
                      alt={school.name || "school"}
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                    <span className="truncate">{school.name}</span>
                  </div>
                  {isSelected && <FaCheck className="h-3 w-3 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SchoolFilterDropdown;
