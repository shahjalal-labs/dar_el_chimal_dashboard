"use client";

import DataTable from "@/components/Common/DataTable";
import {
  useGetAllBooksForTeacherQuery,
  useGetTeacherOverviewQuery,
} from "@/redux/api/teacher/overviewApi";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { TfiAngleLeft } from "react-icons/tfi";
import { useState, useEffect } from "react";
import Pagination from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Books = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const route = useRouter();
  const { id } = useParams();

  // Selected grade state - defaults to the grade from route params, or "all"
  const [selectedGradeId, setSelectedGradeId] = useState<string>(
    id && id !== "all" ? (id as string) : "all"
  );

  // Sync selectedGradeId if route param changes
  useEffect(() => {
    if (id) {
      setSelectedGradeId(id === "all" ? "all" : (id as string));
      setCurrentPage(1);
    }
  }, [id]);

  // Fetch teacher's assigned grades for the filter dropdown
  const { data: teacherOverviewData } = useGetTeacherOverviewQuery(undefined);
  const teacherGrades = teacherOverviewData?.result?.grades || [];

  const { data: allBooks, isLoading: isBookLoading } =
    useGetAllBooksForTeacherQuery({
      currentPage,
      limit: 10,
      gradeId: selectedGradeId && selectedGradeId !== "all" ? selectedGradeId : undefined,
    });

  const handleGradeChange = (gradeId: string) => {
    setSelectedGradeId(gradeId);
    setCurrentPage(1);
    route.replace(`/teacher/classes/books/${gradeId}`);
  };

  const formattedData = allBooks?.result?.data?.map(
    (entry: {
      id: string;
      coverImg: string;
      bookName: string;
      description: string;
      author: string;
      ISBN: string;
      file: string;
      createdAt: string;
      updatedAt: string;
      category: { name: string };
    }) => ({
      Id: entry.id,
      file: entry.file,
      Picture: (
        <Image
          src={
            entry.coverImg ||
            "https://res.cloudinary.com/dddrm7ep8/image/upload/v1788255470/n2tfqinlzgwpdkittexh.jpg"
          }
          height={50}
          width={50}
          alt={entry.bookName}
          className="w-8 h-8 rounded-lg object-cover"
          priority
        />
      ),
      "Book Name": entry.bookName,
      Category: entry.category?.name || "General",
      Description: entry.description,
      Author: entry.author,
      ISBN: entry.ISBN,
      "Created At": new Date(entry.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      "Updated At": new Date(entry.updatedAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }),
  );

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Book List</h1>
          <p className="text-sm text-gray-500 mt-1">
            {selectedGradeId === "all"
              ? "Showing all books across your assigned classes"
              : `Showing books for ${
                  teacherGrades.find(
                    (g: { id: string; grade: string }) => g.id === selectedGradeId
                  )?.grade || "selected class"
                }`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {teacherGrades.length > 0 && (
            <div className="w-48 sm:w-56">
              <Select value={selectedGradeId} onValueChange={handleGradeChange}>
                <SelectTrigger className="bg-white border-gray-300 text-sm font-medium shadow-sm h-10">
                  <SelectValue placeholder="Filter by Grade" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 shadow-md">
                  <SelectItem value="all">
                    All Grades (
                    {teacherOverviewData?.result?.assignBooks ??
                      allBooks?.result?.meta?.total ??
                      ""}
                    )
                  </SelectItem>
                  {teacherGrades.map(
                    (g: { id: string; grade: string; totalBooks?: number }) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.grade}
                        {typeof g.totalBooks === "number"
                          ? ` (${g.totalBooks})`
                          : ""}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={() => route.back()}
            className="bg-white/80 text-black hover:text-white cursor-pointer h-10"
          >
            <TfiAngleLeft />
            Back
          </Button>
        </div>
      </div>

      <DataTable
        title="Book List"
        data={formattedData}
        isLoading={isBookLoading}
        willSearch={true}
      />

      <div className="mt-6">
        <Pagination
          totalPage={Math.ceil((allBooks?.result?.meta?.total ?? 0) / 10)}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default Books;
