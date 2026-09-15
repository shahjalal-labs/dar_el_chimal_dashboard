/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import DataTable from "@/components/Common/DataTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaAngleDown, FaPlus } from "react-icons/fa";
import Image from "next/image";
import defaultImg from "@/assets/no-img.jpg";
import {
  useGetAllSchoolsByAdminQuery,
  useGetAllStudentsByAdminQuery,
} from "@/redux/api/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import CreateStudentModal from "./AddNewStudent/CreateStudentModal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import schoolImg from "@/assets/school.png";
import { FiLoader } from "react-icons/fi";
import { PiExport, PiSpinner } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useDeleteAllStudentsMutation } from "@/redux/api/student";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  limit?: number;
}

const StudentList = () => {
  const route = useRouter();
  const [open, setOpen] = useState(false);
  const [schoolId, setSchoolId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading: isStudentLoading } = useGetAllStudentsByAdminQuery({
    schoolId: schoolId && schoolId !== "all" ? schoolId : undefined,
    searchTerm: searchTerm.trim() || undefined,
  });
  const { data: allSchools, isLoading } = useGetAllSchoolsByAdminQuery({
    currentPage: 1,
    limit: 10000,
    searchTerm: "",
  });
  const [DeleteAllStudents, { isLoading: isStudentDeleting }] =
    useDeleteAllStudentsMutation();

  const filteredStudents = React.useMemo(() => {
    let list: any[] = data?.result?.meta?.result || [];
    if (schoolId && schoolId !== "all") {
      list = list.filter((s: any) =>
        s?.StudentGrades?.some(
          (g: any) =>
            g?.grade?.school?.id === schoolId || g?.grade?.schoolId === schoolId
        )
      );
    }
    if (searchTerm.trim().length > 0) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter((s: any) =>
        s?.fullName?.toLowerCase().includes(term) ||
        s?.loginUserName?.toLowerCase().includes(term) ||
        s?.email?.toLowerCase().includes(term) ||
        s?.StudentGrades?.some((g: any) =>
          g?.grade?.school?.name?.toLowerCase().includes(term) ||
          g?.grade?.grade?.toLowerCase().includes(term)
        )
      );
    }
    return list;
  }, [data, schoolId, searchTerm]);

  const formattedData = filteredStudents
    ?.slice((currentPage - 1) * limit, currentPage * limit)
    .map(
      (entry: {
        id: string;
        profileImage: string;
        fullName: string;
        loginUserName: string;
        email: string;
        phone: string;
        gender: string;
        DOB: string;
        status: string;
        joinedAt: string;
        updatedAt: string;
      }) => ({
        Id: entry?.id,
        Picture: (
          <Image
            src={entry?.profileImage || defaultImg}
            height={50}
            width={50}
            alt={entry?.fullName || "Full Name"}
            className="w-8 h-8 rounded-full object-cover"
            priority
          />
        ),
        "Full Name": entry?.fullName,
        "User Name": entry?.loginUserName,
        Email: entry?.email,
        Phone: entry?.phone,
        Gender: entry?.gender,
        "Date of Birth": entry?.DOB,
        Status: entry?.status,
        "Joined At": new Date(entry?.joinedAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        "Updated At": new Date(entry?.joinedAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }),
    );

  const handleRoute = (value: string) => {
    if (value === "manual")
      return route.push("/admin/students/add-new-student");
    else return setOpen(true);
  };

  const handleExportToGoogleSheets = () => {
    if (!filteredStudents || filteredStudents.length === 0) {
      alert("No data available to export!");
      return;
    }

    const headers = ["Sl/No", "Student Name", "School", "Grade", "User Name", "Password"];
    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const csvRows = [
      headers.join(","),
      ...filteredStudents.map((t: any, i: number) => {
        const schoolName = t.StudentGrades?.[0]?.grade?.school?.name || "N/A";
        const gradeName = t.StudentGrades?.[0]?.grade?.grade || "N/A";
        return [
          String(i + 1).padStart(2, "0"),
          escapeCsv(t.fullName),
          escapeCsv(schoolName),
          escapeCsv(gradeName),
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
    a.download = "student_list.csv";
    a.click();

    setTimeout(() => {
      window.open("https://sheets.google.com", "_blank");
      URL.revokeObjectURL(url);
    }, 500);
  };

  const handleDelete = async () => {
    try {
      const response = await DeleteAllStudents({}).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="md:flex justify-between items-center mb-10">
        <div className="mb-6 md:mb-0">
          <h1 className="text-2xl font-bold mb-3">Student</h1>
          <p className="font-medium">
            <span className="text-[#72727299]">Library</span>
            <span className="text-[#72727299] px-2">/</span>Student List
          </p>
        </div>
        <Select onValueChange={(value) => handleRoute(value)}>
          <SelectTrigger className="w-fit border border-[#1E3A8A] text-[#1E3A8A] bg-transparent hover:bg-transparent cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md data-[placeholder]:text-[#1E3A8A]">
            <FaPlus className="text-[#1E3A8A]" />
            <SelectValue placeholder="Create New Student" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">
              <Link href="/admin/students/add-new-student">
                Manually Create
              </Link>
            </SelectItem>
            <SelectItem value="automatic">Automatically Create</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={open} onOpenChange={setOpen}>
          <CreateStudentModal />
        </Dialog>
      </div>

      <DataTable
        title="Student List"
        data={formattedData}
        currentPage={currentPage}
        searchPlaceholder="Search by fullname, login name or school name"
        isLoading={isStudentLoading}
        deleteItem="Student"
        setSearchTerm={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        schoolId={schoolId}
        sortThree={
          <Select
            value={schoolId || "all"}
            onValueChange={(value) => {
              setSchoolId(value === "all" ? "" : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-fit border border-[#1E3A8A] text-[#1E3A8A] bg-transparent hover:bg-transparent cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md data-[placeholder]:text-[#1E3A8A]">
              <SelectValue placeholder="Select School" />
              <FaAngleDown className="text-[#1E3A8A]" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {isLoading ? (
                <div className="flex justify-center items-center text-[#1E3A8A] animate-spin my-6">
                  <FiLoader size={24} />
                </div>
              ) : (
                <>
                  <SelectItem value="all">All Schools</SelectItem>
                  {allSchools?.result?.schools?.map(
                    (
                      school: { id: string; name: string; schoolLogo: string },
                      idx: number,
                    ) => (
                      <SelectItem key={idx} value={school?.id}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={school.schoolLogo || schoolImg}
                            height={50}
                            width={50}
                            alt={school.name}
                            style={{ width: 24, height: 24, borderRadius: "50%" }}
                            priority
                          />
                          <span>{school?.name}</span>
                        </div>
                      </SelectItem>
                    ),
                  )}
                </>
              )}
            </SelectContent>
          </Select>
        }
        sortFour={
          <Button
            onClick={handleExportToGoogleSheets}
            className="bg-transparent text-[#1E3A8A] border border-[#1E3A8A] hover:bg-transparent"
          >
            Export <PiExport />
          </Button>
        }
        sortFive={
          <AlertDialog>
            <AlertDialogTrigger>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-transparent border border-red-700 hover:bg-transparent"
                  >
                    {isStudentDeleting ? (
                      <div className="animate-spin">
                        <PiSpinner className="h-4 w-4 text-red-700" />
                      </div>
                    ) : (
                      <RiDeleteBin6Line className="text-red-700" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete All Students</p>
                </TooltipContent>
              </Tooltip>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#30373D] text-3xl font-bold text-center">
                  Delete All Students?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[#636F85] text-center text-base mt-4">
                  Are you sure you want to permanently delete all the students?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex justify-center items-center gap-4">
                <AlertDialogCancel className="flex-1 font-bold text-[#636F85] cursor-pointer transition-all duration-500 ease-in-out">
                  No
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A80] flex-1 cursor-pointer transition-all duration-500 ease-in-out"
                  onClick={() => handleDelete()}
                >
                  Yes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
          <span>from {filteredStudents?.length || 0}</span>
        </div>
        <Pagination
          totalPage={filteredStudents?.length || 0}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          limit={limit}
        />
      </div>
    </div>
  );
};

export default StudentList;

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
