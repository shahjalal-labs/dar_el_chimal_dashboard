"use client";

import defaultImg from "@/assets/no-img.jpg";
import DataTable from "@/components/Common/DataTable";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import { useGetStudentDetailsQuery } from "@/redux/api/student/overviewApi";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const BookList = () => {
  const pathname = usePathname();
  const queryField = pathname.split("/").pop();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useGetStudentDetailsQuery(queryField);

  const formattedData = data?.result?.books?.map(
    (entry: {
      id: string;
      image: string;
      bookName: string;
      description: string;
      author: string;
    }) => ({
      Id: entry.id,
      Picture: (
        <Image
          src={entry.image || defaultImg}
          height={50}
          width={50}
          alt={entry.bookName}
          className="w-8 h-8 rounded-full object-cover"
          priority
        />
      ),
      "Category Name": entry.bookName,
      Description:
        entry.description.length > 30
          ? entry.description.slice(0, 30) + "..."
          : entry.description,
      author: entry.author,
    })
  );

  return (
    <div>
      <div className="md:flex justify-between items-center mb-10">
        <div className="mb-6 md:mb-0">
          <h1 className="text-2xl font-bold mb-3">Book List</h1>
        </div>
      </div>

      <DataTable
        title="Book List"
        data={formattedData}
        isLoading={isLoading}
        currentPage={currentPage}
        willSearch={true}
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
        <div className="text-base text-[#4A4A4A] flex items-center justify-start gap-2">
          <span>Show</span>
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-none bg-[#1E3A8A1A] text-[#1E3A8A] hover:bg-[#1E3A8A1A]"
          >
            {formattedData?.length}
          </Button>
          <span>from {data?.result?.meta?.total}</span>
        </div>
        <Pagination
          totalPage={data?.result?.meta?.totalPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default BookList;
