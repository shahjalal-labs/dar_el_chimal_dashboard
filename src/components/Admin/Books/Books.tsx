"use client";

import { useState } from "react";
import defaultImg from "@/assets/no-img.jpg";
import DataTable from "@/components/Common/DataTable";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import { useGetAllBooksQuery } from "@/redux/api/book";
import Image from "next/image";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

const Books = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetAllBooksQuery(currentPage);

  const formattedData = data?.result?.result?.map(
    (entry: {
      id: string;
      coverImg: string;
      bookName: string;
      description: string;
      createdAt: string;
      updatedAt: string;
      category: { name: string };
    }) => ({
      Id: entry?.id,
      Picture: (
        <Image
          src={entry?.coverImg || defaultImg}
          height={50}
          width={50}
          alt={entry?.bookName || "Book Cover"}
          className="w-8 h-8 rounded-lg object-cover"
          priority
        />
      ),
      "Book Name": (entry?.bookName?.length > 30 ?
        entry?.bookName?.slice(0, 30) + "..." :
        entry?.bookName),
      "Description": (entry?.description.length > 30 ?
        entry?.description.slice(0, 30) + "..." :
        entry?.description),
      Category: entry?.category.name,
      "Created At": new Date(entry?.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      "Updated At": new Date(entry?.updatedAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    })
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold mb-3">Book List</h1>
          <p className="font-medium">
            <span className="text-[#72727299]">Book Management</span>
            <span className="text-[#72727299] px-2">/</span>Book List
          </p>
        </div>
        <Link href="/admin/books/add-new-book">
          <Button className="bg-transparent text-[#1E3A8A] border border-[#1E3A8A] hover:bg-transparent transition-all duration-500 ease-in-out cursor-pointer">
            <FaPlus />
            Add New Book
          </Button>
        </Link>
      </div>

      <DataTable
        title="Book List"
        data={formattedData}
        currentPage={currentPage}
        willSearch={true}
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
        <div className="text-base text-[#4A4A4A] flex items-center justify-start gap-2">
          <span>Show</span>
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-none bg-[#1E3A8A1A] text-[#1E3A8A] hover:bg-[#1E3A8A1A] transition-all duration-500 ease-in-out cursor-pointer"
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

export default Books;
