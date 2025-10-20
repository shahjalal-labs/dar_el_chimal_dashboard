/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDeleteBookCategroyMutation } from "@/redux/api/bookCategory";
import { Eye, Search } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { PiSpinner } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SyncLoader } from "react-spinners";
import { toast } from "sonner";
import UpdateBookCategoryModal from "../Admin/BookCategories/UpdateBookCategoryModal";
import ViewBookCategoryModal from "../Admin/BookCategories/ViewBookCategoryModal";
import UpdateBookModal from "../Admin/Books/UpdateBookModal";
import UpdateSchoolModal from "../Admin/Schools/UpdateSchoolModal";
import ViewSchoolModal from "../Admin/Schools/ViewSchoolModal";
import UpdateTeacherModal from "../Admin/Teachers/UpdateTeacherModal";
import ViewTeacherModal from "../Admin/Teachers/ViewTeacherModal";
import ViewStudentDetailsModal from "../Teacher/ViewStudentDetailsModal";
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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const DataTable = ({
  title,
  data,
  isButton,
  isButtonTwo,
  buttonText,
  buttonTextTwo,
  currentPage,
  sort,
  icon,
  iconTwo,
  willSearch,
}: {
  title: string;
  data: any;
  isButton?: boolean;
  isButtonTwo?: boolean;
  buttonText?: string;
  buttonTextTwo?: string;
  currentPage?: number;
  sort?: React.ReactNode;
  icon?: React.ReactNode;
  iconTwo?: React.ReactNode;
  willSearch?: boolean;
}) => {
  const { id } = useParams();
  const pathname = usePathname();
  const [selectedId, setSelectedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [DeleteBookCategory, { isLoading: isBookCategoryDeleting }] =
    useDeleteBookCategroyMutation();

  const handleDelete = async (id: string) => {
    try {
      if (pathname === "/admin/book-categories") {
        const response = await DeleteBookCategory(id).unwrap();
        if (response.success) {
          toast.success(response.message);
        }
      }
    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    }
  };

  const filteredData = data?.filter((item: any) => {
    if (!searchQuery) return true;

    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="md:flex justify-between items-center mb-6">
        {/* Left - Title */}
        <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>

        {/* Right - Sort + Button */}
        <div className="md:flex items-center gap-3 ml-auto">
          {willSearch && (
            <div className="relative w-64 pb-2">
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8 bg-[#F9F9F9] border-none shadow-none"
              />
              <div className="absolute right-3 top-3 text-[#79767B] p-2 rounded-lg">
                <Search className="h-4 w-4" />
              </div>
            </div>
          )}
          <div className="mt-4 md:mt-0">{sort}</div>
          {isButton && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex justify-center items-center rounded-lg gap-1 px-4 py-2 transition-colors ease-in-out duration-500 cursor-pointer bg-[#1E3A8A] hover:bg-[#1E3A8A80] text-white">
                  {icon}
                  {buttonText}
                </button>
              </DialogTrigger>
            </Dialog>
          )}
          {isButtonTwo && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex justify-center items-center rounded-lg gap-1 px-4 py-2 transition-colors ease-in-out duration-500 cursor-pointer bg-[#1E3A8A] hover:bg-[#1E3A8A80] text-white mt-4 md:mt-0">
                  {iconTwo}
                  {buttonTextTwo}
                </button>
              </DialogTrigger>
            </Dialog>
          )}
        </div>
      </div>

      {!data ? (
        <div className="flex justify-center items-center gap-4">
          <span className="text-[#1E3A8A]">Table Data is Loading</span>
          <SyncLoader color="#1E3A8A" />
        </div>
      ) : !filteredData.length ? (
        <div className="text-center text-[#D00E11] my-10 w-full mx-auto">
          No match found!
        </div>
      ) : (
        <Table className="bg-white border border-[#F5F5F5] rounded-xl">
          <TableHeader>
            <TableRow className="bg-[#1E3A8A0D]">
              <TableHead className="text-[#4A4A4A] font-semibold text-sm">
                Sl/No
              </TableHead>
              {data?.length > 0 &&
                Object.keys(data[0])?.map((key, index) => (
                  <TableHead
                    key={index}
                    className="text-[#4A4A4A] font-semibold text-sm"
                  >
                    {key !== "Id" &&
                      key
                        .split("_")
                        .map((header, idx) => <span key={idx}>{header} </span>)}
                  </TableHead>
                ))}
              {pathname !== "/" && (
                <TableHead className="text-[#4A4A4A] font-semibold text-sm">
                  Action
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData?.map((singleData: any, index: number) => (
              <TableRow key={index} className="hover:bg-gray-50 text-[#5C5C5C]">
                <TableCell className="text-sm">
                  {index + 1 + ((currentPage ?? 1) - 1) * 10}
                </TableCell>
                {Object.entries(singleData).map(
                  ([key, value]: any, idx: number) => (
                    <TableCell key={idx} className="text-sm">
                      {key === "Id" ? <></> : <span>{value}</span>}
                    </TableCell>
                  )
                )}
                {pathname !== "/" && (
                  <TableCell className="flex items-center gap-2">
                    {/* VIEW  */}

                    {pathname === "/admin/books" && (
                      <Link href={`/admin/books/book-overview/${singleData?.Id}`}>
                        <Button className="bg-[#F4A64033] hover:bg-[#F4A64026] text-[#F4A640] transition-colors ease-in-out duration-200 cursor-pointer">
                          <span className="sr-only">View details</span>
                          <Eye className="h-6 w-6" />
                        </Button>
                      </Link>
                    )}

                    {pathname === `/teacher/classes/books/${id}` && (
                      <Link href={`/teacher/classes/books/${id}/${singleData?.Id}`}>
                        <Button className="bg-[#F4A64033] hover:bg-[#F4A64026] text-[#F4A640] transition-colors ease-in-out duration-200 cursor-pointer">
                          <span className="sr-only">View details</span>
                          <Eye className="h-6 w-6" />
                        </Button>
                      </Link>
                    )}

                    {pathname === "/student/books" && (
                      <Link
                        href={`/student/books/bookDetails/${singleData?.Id}`}
                      >
                        <Button className="bg-[#F4A64033] hover:bg-[#F4A64026] text-[#F4A640] transition-colors ease-in-out duration-200 cursor-pointer">
                          <span className="sr-only">View details</span>
                          <Eye className="h-6 w-6" />
                        </Button>
                      </Link>
                    )}

                    {(pathname !== "/admin/books" && pathname !== `/teacher/classes/books/${id}`) ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedId(singleData?.Id)}
                            className="bg-[#F4A64033] hover:bg-[#F4A64026] text-[#F4A640] transition-colors ease-in-out duration-200 cursor-pointer"
                          >
                            <span className="sr-only">View details</span>
                            <Eye className="h-6 w-6" />
                          </Button>
                        </DialogTrigger>
                        {selectedId === singleData?.Id && (
                          <>
                            {pathname === "/admin/book-categories" ? (
                              <ViewBookCategoryModal id={singleData?.Id} />
                            ) : pathname === "/admin/schools" ? (
                              <ViewSchoolModal id={singleData?.Id} />
                            ) : pathname === "/admin/teachers" ? (
                              <ViewTeacherModal id={singleData?.Id} />
                            ) : pathname ===
                              `/teacher/classes/${id}/students` ? (
                              <ViewStudentDetailsModal id={singleData?.Id} />
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </Dialog>
                    ) : (<></>)
                    }

                    {/* UPDATE & DELETE  */}
                    {(pathname === "/admin/book-categories" ||
                      pathname === "/admin/books" ||
                      pathname === "/admin/schools" ||
                      pathname === "/admin/teachers" ||
                      pathname === "/admin/students") && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => setSelectedId(singleData?.Id)}
                                className="bg-[#17A23533] hover:bg-[#17A23526] text-[#17A235] transition-colors ease-in-out duration-200 cursor-pointer"
                              >
                                <span className="sr-only">Update</span>
                                <BiEditAlt className="h-6 w-6" />
                              </Button>
                            </DialogTrigger>
                            {selectedId === singleData?.Id &&
                              (pathname === "/admin/book-categories" ? (
                                <UpdateBookCategoryModal id={singleData?.Id} />
                              ) : pathname === "/admin/books" ? (
                                <UpdateBookModal id={singleData?.Id} />
                              ) : pathname === "/admin/schools" ? (
                                <UpdateSchoolModal id={singleData?.Id} />
                              ) : pathname === "/admin/teachers" ? (
                                <UpdateTeacherModal id={singleData?.Id} />
                              ) : (
                                <></>
                              ))}
                          </Dialog>
                          {
                            // pathname !== '' &&
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button className="bg-[#FE4D4F33] hover:bg-[#FE4D4F26] text-[#FE4D4F] transition-colors ease-in-out duration-200 cursor-pointer">
                                  <span className="sr-only">Delete</span>
                                  {isBookCategoryDeleting &&
                                    selectedId === singleData?.Id ? (
                                    <div className="animate-spin">
                                      <PiSpinner className="h-4 w-4" />
                                    </div>
                                  ) : (
                                    <RiDeleteBin6Line className="w-6 h-6" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-[#30373D] text-3xl font-bold text-center">
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-[#636F85] text-center text-base mt-4">
                                    This action cannot be undone. This will
                                    permanently delete the{" "}
                                    {singleData?.name ?? "item"}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex justify-center items-center gap-4">
                                  <AlertDialogCancel className="flex-1 font-bold text-[#636F85] cursor-pointer transition-all duration-500 ease-in-out">
                                    No
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A80] flex-1 cursor-pointer transition-all duration-500 ease-in-out"
                                    onClick={() => {
                                      setSelectedId(singleData?.Id);
                                      handleDelete(singleData?.Id);
                                    }}
                                  >
                                    Yes
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          }
                        </>
                      )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default DataTable;
