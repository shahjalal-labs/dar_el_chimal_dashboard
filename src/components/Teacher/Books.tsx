"use client";

import defaultImg from "@/assets/no-img.jpg";
import DataTable from "@/components/Common/DataTable";
import { useGetAllBooksByTeacherQuery, useGetAllBooksForTeacherQuery } from "@/redux/api/teacher/overviewApi";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { TfiAngleLeft } from "react-icons/tfi";
import { useState } from "react";
import Pagination from "../ui/pagination";

const Books = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const route = useRouter();
    const { id } = useParams();
    const pathname = usePathname();
    const { data, isLoading } = useGetAllBooksByTeacherQuery(id);
    const { data: allBooks, isLoading: isBookLoading } = useGetAllBooksForTeacherQuery(currentPage);

    const formattedData = pathname === '/teacher/classes/books/undefined' ? (
        allBooks?.result?.data?.map(
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
                        src={entry.coverImg || defaultImg}
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
                // PDF: (
                //     entry?.file
                //         ? <Link
                //             href={`/teacher/classes/books/undefined/6926a3b1e6049634938dfb96/pdf?pdfurl=https://fra1.digitaloceanspaces.com/dac/niveau-1-to-view.pdf`}
                //             target="_blank"
                //             className="text-blue-600 underline"
                //         >
                //             View PDF
                //         </Link>
                //         : "N/A"
                // ),
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
            })
        )) : (
        data?.result?.books?.map(
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
                        src={entry.coverImg || defaultImg}
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
                // PDF: (
                //     entry?.file
                //         ? <Link
                //             href={entry?.file}
                //             target="_blank"
                //             className="text-blue-600 underline"
                //         >
                //             View PDF
                //         </Link>
                //         : "N/A"
                // ),
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
            })
        ))

    return (
        <div>
            <div className='mb-6 flex justify-between md:items-center'>
                <h1 className="text-2xl font-bold mb-4">Book List</h1>
                <Button onClick={() => route.back()} className='mb-6 bg-white/80 text-black hover:text-white cursor-pointer'><TfiAngleLeft />Back</Button>
            </div>

            <DataTable
                title="Book List"
                data={formattedData}
                isLoading={isLoading || isBookLoading}
                willSearch={true}
            />

            {
                pathname === '/teacher/classes/books/undefined' && (
                    <div className="mt-6">
                        <Pagination
                            totalPage={allBooks?.result?.meta?.total / 10}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                        />
                    </div>
                )
            }
        </div>
    );
};

export default Books;