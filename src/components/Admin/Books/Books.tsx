"use client";

import { useState } from "react";
import defaultImg from "@/assets/no-img.jpg";
import DataTable from "@/components/Common/DataTable";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import { useGetAllBooksQuery } from "@/redux/api/book";
import Image from "next/image";
import Link from "next/link";
import { FaAngleDown, FaPlus } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiLoader } from "react-icons/fi";
import { useGetAllBookCategoriesQuery } from "@/redux/api/bookCategory";

const Books = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookCategoryId, setBookCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: allBookCategories, isLoading } = useGetAllBookCategoriesQuery({ currentPage: 1, limit: 1000 });
  const { data, isLoading: isBookLoading } = useGetAllBooksQuery({ currentPage, bookCategoryId: bookCategoryId ? bookCategoryId : undefined, searchTerm });

  const formattedData = data?.result?.result?.map(
    (entry: {
      id: string;
      coverImg: string;
      bookName: string;
      description: string;
      file?: string;
      createdAt: string;
      updatedAt: string;
      category: { name: string };
    }) => ({
      Id: entry?.id,
      file: entry?.file,
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
      "Book Name": entry?.bookName,
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
        isLoading={isBookLoading}
        searchPlaceholder="Search by book name or description"
        willSearch={true}
        deleteItem="Book"
          setSearchTerm={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        sort={(
          <Select onValueChange={(value) => setBookCategoryId(value)}>
            <SelectTrigger className="w-fit border border-[#1E3A8A] text-[#1E3A8A] bg-transparent hover:bg-transparent cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md data-[placeholder]:text-[#1E3A8A]">
              <SelectValue placeholder="Select Category" />
              <FaAngleDown className='text-[#1E3A8A]' />
            </SelectTrigger>
            <SelectContent className='max-h-80'>
              {
                isLoading ?
                  <div className='flex justify-center items-center text-[#1E3A8A] animate-spin my-6'><FiLoader size={24} /></div> :
                  allBookCategories?.result?.result?.map((category: { id: string, name: string, image: string }, idx: number) =>
                    <SelectItem key={idx} value={category?.id}>
                      <Image
                        src={category.image ? category.image : defaultImg}
                        height={50}
                        width={50}
                        alt={category.name}
                        style={{ width: 24, height: 24, borderRadius: '50%' }}
                        priority
                      />
                      {category?.name}
                    </SelectItem>
                  )
              }
            </SelectContent>
          </Select>
        )}
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
