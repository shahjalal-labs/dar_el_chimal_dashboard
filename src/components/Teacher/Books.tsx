"use client";

import defaultImg from "@/assets/no-img.jpg";
import DataTable from "@/components/Common/DataTable";
import { useGetAllBooksByTeacherQuery } from "@/redux/api/teacher/overviewApi";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const Books = () => {
    const { id } = useParams();
    const { data } = useGetAllBooksByTeacherQuery(id);

    const formattedData = data?.result?.books?.map(
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
            // Category: entry.category.name,
            PDF: (
                entry?.file
                    ? <Link
                        href={entry?.file}
                        target="_blank"
                        className="text-blue-600 underline"
                    >
                        View PDF
                    </Link>
                    : "N/A"
            ),
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
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Book List</h1>
            <DataTable
                title="Book List"
                data={formattedData}
                willSearch={true}
            />
        </div>
    );
};

export default Books;