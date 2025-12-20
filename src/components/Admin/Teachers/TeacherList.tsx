/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import DataTable from '@/components/Common/DataTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaAngleDown, FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import defaultImg from '@/assets/no-img.jpg';
import { useGetAllSchoolsByAdminQuery, useGetAllTeachersByAdminQuery, useGetSearchedTeachersQuery } from '@/redux/api/admin';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { Dialog } from '@/components/ui/dialog';
import CreateTeacherModal from './AddNewTeacher/CreateTeacherModal';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import schoolImg from "@/assets/school.png";
import { FiLoader } from 'react-icons/fi';
import { PiExport, PiSpinner } from 'react-icons/pi';
import { Input } from '@/components/ui/input';

interface PaginationProps {
    totalPage: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const TeacherList = () => {
    const route = useRouter();
    const [open, setOpen] = useState(false);
    const [schoolId, setSchoolId] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [fullName, setFullName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [teacherData, setTeacherData] = useState([]);

    const { data, isLoading: isTeacherLoading } = useGetAllTeachersByAdminQuery({ schoolId: schoolId ? schoolId : undefined });
    const { data: searchedTeachers, isLoading: isSearchedTeacherLoading } = useGetSearchedTeachersQuery({ schoolName, fullName });
    const { data: allSchools, isLoading } = useGetAllSchoolsByAdminQuery({ currentPage: 1, limit: 10000 });

    useEffect(() => {
        if (schoolName.length > 0) {
            setSearchTerm(schoolName);
        }
        if (fullName.length > 0) {
            setSearchTerm(fullName);
        }
    }, [schoolName, fullName]);

    useEffect(() => {
        if (searchTerm.length > 0) {
            setTeacherData(searchedTeachers?.result?.meta?.result);
        }
        else if (data?.result) {
            setTeacherData(data?.result?.meta?.result);
        }
    }, [data, searchTerm, searchedTeachers]);

    const formattedData = teacherData?.slice(((currentPage * 10) - 10), (currentPage * 10)).map(
        (entry: { id: string, profileImage: string, fullName: string, loginUserName: string, email: string, gender: string, DOB: string, phone: string, status: string, joinedAt: string, updatedAt: string, Teacher: { grade: { school: { name: string } } }[] }) => ({
            "Id": entry.id,
            "Profile Image": (
                <Image
                    src={entry.profileImage || defaultImg}
                    height={50}
                    width={50}
                    alt={entry.fullName || "Full Name"}
                    className="w-8 h-8 rounded-full object-cover"
                    priority
                />
            ),
            "Full Name": entry?.fullName,
            "User Name": entry?.loginUserName,
            "School": entry?.Teacher[0]?.grade?.school?.name,
            "Status": entry?.status,
            "Joined At": new Date(entry.joinedAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            "Updated At": new Date(entry.updatedAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
        }));

    const handleRoute = (value: string) => {
        if (value === 'manual') {
            route.push('/admin/teachers/add-new-teacher')
        }
        else {
            setOpen(true);
        }
    }

    const handleExportToGoogleSheets = () => {
        if (!data || data?.result?.meta?.result?.length === 0) {
            alert("No data available to export!");
            return;
        }

        const headers = ["Sl/No", "Teacher Name", "Grade", "User Name", "Password"];
        const csvRows = [
            headers.join(","),
            ...data?.result?.meta?.result?.map((t: any, i: number) =>
                `${String(i + 1).padStart(2, "0")},${t.fullName},${t.Teacher?.map((g: any) => g?.grade?.grade).join(" / ")},${t.loginUserName},${t.password}`
            ),
        ];

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
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
            <div className='md:flex justify-between items-center mb-10'>
                <div className='mb-6 md:mb-0'>
                    <h1 className='text-2xl font-bold mb-3'>Teachers</h1>
                    <p className='font-medium'><span className='text-[#72727299]'>Library</span><span className='text-[#72727299] px-2'>/</span>Teacher List</p>
                </div>

                <Select onValueChange={(value) => handleRoute(value)}>
                    <SelectTrigger className="w-fit border border-[#1E3A8A] text-[#1E3A8A] bg-transparent hover:bg-transparent cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md data-[placeholder]:text-[#1E3A8A]">
                        <FaPlus className="text-[#1E3A8A]" />
                        <SelectValue placeholder="Create New Teacher" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="manual">
                            <Link href="/admin/teachers/add-new-teacher">
                                Manually Create
                            </Link>
                        </SelectItem>
                        <SelectItem value="automatic">Automatically Create</SelectItem>
                    </SelectContent>
                </Select>
                <Dialog open={open} onOpenChange={setOpen}>
                    <CreateTeacherModal />
                </Dialog>
            </div>

            <DataTable
                title="Teacher List"
                data={formattedData}
                currentPage={currentPage}
                isLoading={isTeacherLoading || isSearchedTeacherLoading}
                sort={(
                    <div className="relative w-64 pb-2">
                        <Input
                            placeholder="Search by School Name"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            className="pr-8 bg-[#F9F9F9] border-none shadow-none"
                        />
                        {
                            isSearchedTeacherLoading ?
                                <div className="absolute right-3 top-1 text-[#79767B] p-2 rounded-lg">
                                    <span className='sr-only'>Deleting</span>
                                    <div className="animate-spin">
                                        <PiSpinner className="h-4 w-4" />
                                    </div>
                                </div> :
                                <div className="absolute right-3 top-1 text-[#79767B] p-2 rounded-lg">
                                    <Search className="h-4 w-4" />
                                </div>
                        }
                    </div>
                )}
                sortTwo={(
                    <div className="relative w-64 pb-2">
                        <Input
                            placeholder="Search by Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="pr-8 bg-[#F9F9F9] border-none shadow-none"
                        />
                        {
                            isSearchedTeacherLoading ?
                                <div className="absolute right-3 top-1 text-[#79767B] p-2 rounded-lg">
                                    <span className='sr-only'>Deleting</span>
                                    <div className="animate-spin">
                                        <PiSpinner className="h-4 w-4" />
                                    </div>
                                </div> :
                                <div className="absolute right-3 top-1 text-[#79767B] p-2 rounded-lg">
                                    <Search className="h-4 w-4" />
                                </div>
                        }
                    </div>
                )}
                sortThree={(
                    <Select onValueChange={(value) => setSchoolId(value)}>
                        <SelectTrigger className="w-fit border border-[#1E3A8A] text-[#1E3A8A] bg-transparent hover:bg-transparent cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md data-[placeholder]:text-[#1E3A8A]">
                            <SelectValue placeholder="Select School" />
                            <FaAngleDown className='text-[#1E3A8A]' />
                        </SelectTrigger>
                        <SelectContent className='max-h-80'>
                            {
                                isLoading ?
                                    <div className='flex justify-center items-center text-[#1E3A8A] animate-spin my-6'><FiLoader size={24} /></div> :
                                    allSchools?.result?.schools?.map((school: { id: string; name: string; schoolLogo: string }, idx: number) =>
                                        <SelectItem key={idx} value={school?.id}>
                                            <Image
                                                src={school.schoolLogo || schoolImg}
                                                height={50}
                                                width={50}
                                                alt={school.name}
                                                style={{ width: 24, height: 24, borderRadius: '50%' }}
                                                priority
                                            />
                                            {school?.name}
                                        </SelectItem>
                                    )
                            }
                        </SelectContent>
                    </Select>
                )}
                sortFour={(
                    <Button onClick={handleExportToGoogleSheets} className='bg-transparent text-[#1E3A8A] border border-[#1E3A8A] hover:bg-transparent'>Export <PiExport /></Button>
                )}
            />

            <div className='flex flex-col md:flex-row justify-between items-center gap-6 mt-8'>
                <div className='text-base text-[#4A4A4A] flex items-center justify-start gap-2'>
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
                <Pagination totalPage={data?.result?.meta?.total} setCurrentPage={setCurrentPage} currentPage={currentPage} />
            </div>
        </div>
    );
};

export default TeacherList;

const Pagination = ({ totalPage, setCurrentPage, currentPage }: PaginationProps) => {
    return (
        <div className="flex justify-end items-center">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 bg-[#1E3A8A33] text-[#1E3A8A]"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                {Array.from({ length: totalPage / 10 }, (_, i) => i + 1)
                    .filter(
                        (page) =>
                            page === 1 ||
                            page === totalPage / 10 ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
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
                                className={`h-8 w-8 rounded-md hover:bg-[#1E3A8A33] hover:text-[#1E3A8A] ${currentPage === page
                                    ? "bg-[#1E3A8A] text-white"
                                    : ""
                                    }`}
                            >
                                {page}
                            </Button>
                        </React.Fragment>
                    ))}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage / 10))}
                    disabled={currentPage === totalPage / 10}
                    className="h-8 w-8 bg-[#1E3A8A33] text-[#1E3A8A]"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};