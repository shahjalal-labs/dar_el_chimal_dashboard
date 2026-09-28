/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import DataTable from "@/components/Common/DataTable";
import { Button } from "@/components/ui/button";
import { FaAngleDown, FaPlus } from "react-icons/fa";
import Image from "next/image";
import defaultImg from "@/assets/no-img.jpg";
import {
  useGetAllSchoolsByAdminQuery,
  useGetAllTeachersByAdminQuery,
} from "@/redux/api/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import CreateTeacherModal from "./AddNewTeacher/CreateTeacherModal";
import SchoolFilterDropdown from "@/components/Common/SchoolFilterDropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import schoolImg from "@/assets/school.png";
import { FiLoader } from "react-icons/fi";
import { PiExport } from "react-icons/pi";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  limit?: number;
}

const TeacherList = () => {
  const route = useRouter();
  const [open, setOpen] = useState(false);
  const [schoolId, setSchoolId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading: isTeacherLoading } = useGetAllTeachersByAdminQuery({
    schoolId: schoolId && schoolId !== "all" ? schoolId : undefined,
    searchTerm: searchTerm.trim() || undefined,
  });
  const { data: allSchools, isLoading } = useGetAllSchoolsByAdminQuery({
    currentPage: 1,
    limit: 10000,
    searchTerm: "",
  });

  const filteredTeachers = React.useMemo(() => {
    let list: any[] = data?.result?.meta?.result || [];
    if (schoolId && schoolId !== "all") {
      list = list.filter((t: any) =>
        t?.Teacher?.some(
          (g: any) =>
            g?.grade?.school?.id === schoolId || g?.grade?.schoolId === schoolId
        )
      );
    }
    if (searchTerm.trim().length > 0) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter((t: any) =>
        t?.fullName?.toLowerCase().includes(term) ||
        t?.loginUserName?.toLowerCase().includes(term) ||
        t?.Teacher?.some((g: any) =>
          g?.grade?.school?.name?.toLowerCase().includes(term) ||
          g?.grade?.grade?.toLowerCase().includes(term)
        )
      );
    }
    return list;
  }, [data, schoolId, searchTerm]);

  const schoolsList = React.useMemo(() => {
    return (
      allSchools?.result?.schools ||
      (Array.isArray(allSchools?.result) ? allSchools?.result : []) ||
      []
    );
  }, [allSchools]);

  const formattedData = filteredTeachers
    ?.slice((currentPage - 1) * limit, currentPage * limit)
    .map((entry: any) => {
      const schoolName = entry?.Teacher?.[0]?.grade?.school?.name || "N/A";
      return {
        Id: entry.id,
        Picture: (
          <Image
            src={entry.profileImage || defaultImg}
            height={50}
            width={50}
            alt={entry.fullName || "Full Name"}
            className="w-8 h-8 rounded-full object-cover"
            priority
          />
        ),
        "Full Name": entry?.fullName || "N/A",
        School: schoolName,
        "User Name": entry?.loginUserName || "N/A",
        Password: entry?.password || "N/A",
        Status: entry?.status,
        "Joined At": new Date(entry.joinedAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

  const handleRoute = (value: string) => {
    if (value === "manual") {
      route.push("/admin/teachers/add-new-teacher");
    } else {
      setOpen(true);
    }
  };

  const handleExportToGoogleSheets = () => {
    if (!filteredTeachers || filteredTeachers.length === 0) {
      alert("No data available to export!");
      return;
    }

    const headers = ["Sl/No", "Teacher Name", "School", "User Name", "Password"];
    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const csvRows = [
      headers.join(","),
      ...filteredTeachers.map((t: any, i: number) => {
        const schoolName = t.Teacher?.[0]?.grade?.school?.name || "N/A";
        return [
          String(i + 1).padStart(2, "0"),
          escapeCsv(t.fullName),
          escapeCsv(schoolName),
          escapeCsv(t.loginUserName),
          escapeCsv(t.password || ""),
        ].join(",");
      }),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "teacher_list.csv";
    a.click();

    setTimeout(() => {
      window.open("https://sheets.google.com", "_blank");
      URL.revokeObjectURL(url);
    }, 500);
  };

  return (
    <div>
      <div className="md:flex justify-between items-center mb-10">
        <div className="mb-6 md:mb-0">
          <h1 className="text-2xl font-bold mb-3">Teachers</h1>
          <p className="font-medium">
            <span className="text-[#72727299]">Library</span>
            <span className="text-[#72727299] px-2">/</span>Teacher List
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-fit border border-[#1E3A8A] text-[#1E3A8A] bg-transparent hover:bg-[#1E3A8A]/5 cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium outline-none transition-colors"
            >
              <FaPlus className="text-[#1E3A8A]" />
              <span>Create New Teacher</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border border-gray-100 rounded-md p-1">
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-100 rounded px-2.5 py-1.5 text-sm text-[#4A4A4A]"
              onSelect={() => handleRoute("manual")}
            >
              Manually Create
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-100 rounded px-2.5 py-1.5 text-sm text-[#4A4A4A]"
              onSelect={() => handleRoute("automatic")}
            >
              Automatically Create
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={open} onOpenChange={setOpen}>
          <CreateTeacherModal />
        </Dialog>
      </div>

      <DataTable
        title="Teacher List"
        data={formattedData}
        currentPage={currentPage}
        searchPlaceholder="Search by fullName, user name or school name"
        setSearchTerm={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        isLoading={isTeacherLoading}
        sortThree={
          <SchoolFilterDropdown
            value={schoolId}
            onChange={(selectedId) => {
              setSchoolId(selectedId);
              setCurrentPage(1);
            }}
            schools={schoolsList}
            isLoading={isLoading}
          />
        }
        sortFour={
          <Button
            onClick={handleExportToGoogleSheets}
            className="bg-transparent text-[#1E3A8A] border border-[#1E3A8A] hover:bg-transparent"
          >
            Export <PiExport />
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
        <div className="text-base text-[#4A4A4A] flex items-center justify-start gap-2">
          <span>Show</span>
          <Select
            value={String(limit)}
            onValueChange={(val) => {
              setLimit(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 min-w-[3.5rem] w-fit px-2 rounded-md bg-[#1E3A8A1A] text-[#1E3A8A] font-semibold border-none hover:bg-[#1E3A8A26] cursor-pointer flex items-center gap-1 focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-[4rem]">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>from {filteredTeachers?.length || 0}</span>
        </div>
        <Pagination
          totalPage={filteredTeachers?.length || 0}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          limit={limit}
        />
      </div>
    </div>
  );
};

export default TeacherList;

const Pagination = ({
  totalPage,
  setCurrentPage,
  currentPage,
  limit = 10,
}: PaginationProps) => {
  const totalPagesCount = Math.max(1, Math.ceil(totalPage / limit));
  return (
    <div className="flex justify-end items-center">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage <= 1}
          className="h-8 w-8 bg-[#1E3A8A33] text-[#1E3A8A]"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {Array.from({ length: totalPagesCount }, (_, i) => i + 1)
          .filter(
            (page) =>
              page === 1 ||
              page === totalPagesCount ||
              (page >= currentPage - 1 && page <= currentPage + 1),
          )
          .map((page, index, array) => (
            <React.Fragment key={index}>
              {index > 0 && array[index - 1] !== page - 1 && (
                <span key={`ellipsis-${page}`} className="px-2">
                  ...
                </span>
              )}
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="icon"
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-md hover:bg-[#1E3A8A33] hover:text-[#1E3A8A] ${
                  currentPage === page ? "bg-[#1E3A8A] text-white" : ""
                }`}
              >
                {page}
              </Button>
            </React.Fragment>
          ))}

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPagesCount))
          }
          disabled={currentPage >= totalPagesCount}
          className="h-8 w-8 bg-[#1E3A8A33] text-[#1E3A8A]"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
