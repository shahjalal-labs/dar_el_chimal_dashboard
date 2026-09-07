"use client";

import defaultImg from "@/assets/no-img.jpg";
import DataTable from "@/components/Common/DataTable";
import {
  useGetAllBooksForTeacherQuery,
} from "@/redux/api/teacher/overviewApi";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { TfiAngleLeft } from "react-icons/tfi";
import { useState } from "react";
import Pagination from "../ui/pagination";

const Books = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const route = useRouter();
  const { id } = useParams();

  const { data: allBooks, isLoading: isBookLoading } =
    useGetAllBooksForTeacherQuery({
      currentPage,
      limit: 10,
      gradeId: id && id !== "all" ? (id as string) : undefined,
    });


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
      Picture: (
        <Image
          src={entry.coverImg || "https://res.cloudinary.com/dddrm7ep8/image/upload/v1788255470/n2tfqinlzgwpdkittexh.jpg"}
          height={50}
          width={50}
          alt={entry.bookName}
          className="w-8 h-8 rounded-lg object-cover"
          priority
        />
      ),
      "Book Name": entry.bookName,
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
      <div className="mb-6 flex justify-between md:items-center">
        <h1 className="text-2xl font-bold mb-4">Book List</h1>
        <Button
          onClick={() => route.back()}
          className="mb-6 bg-white/80 text-black hover:text-white cursor-pointer"
        >
          <TfiAngleLeft />
          Back
        </Button>
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
