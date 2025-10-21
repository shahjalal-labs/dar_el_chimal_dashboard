"use client";

import React, { useRef } from "react";
import { DialogClose, DialogContent } from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ShowBulkStudentsModal = () => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const { studentSchoolName, studentList } = useSelector(
        (state: RootState) => state.student
    );

    const handleExportToGoogleSheets = () => {
        if (!studentList || studentList.length === 0) {
            toast.warning("No student data available to export!");
            return;
        }

        // Prepare CSV data
        const headers = ["Sl/No", "School Name", "User Name", "Password"];
        const csvRows = [
            headers.join(","),
            ...studentList.map(
                (student, index) =>
                    `${String(index + 1).padStart(2, "0")},${studentSchoolName},${student.loginUserName},${student.password}`
            ),
        ];

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        // Trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = `student_list_${studentSchoolName || "school"}.csv`;
        a.click();

        // Cleanup + open Google Sheets
        setTimeout(() => {
            window.open("https://sheets.google.com", "_blank");
            URL.revokeObjectURL(url);
        }, 500);
    };

    return (
        <DialogContent className="overflow-y-auto overflow-x-hidden max-h-[75%] min-w-[50%] p-6">
            <DialogClose ref={closeRef} className="hidden" />

            <h1 className="font-bold text-2xl mb-4">Student List</h1>

            {studentList?.length ? (
                <Table className="border border-[#F5F5F5] rounded-2xl">
                    <TableHeader>
                        <TableRow className="bg-[#1E3A8A0D]">
                            <TableHead>Sl/No</TableHead>
                            <TableHead>School Name</TableHead>
                            <TableHead>User Name</TableHead>
                            <TableHead>Password</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {studentList.map((student, index) => (
                            <TableRow key={student.loginUserName || index}>
                                <TableCell className="text-sm">
                                    {String(index + 1).padStart(2, "0")}
                                </TableCell>
                                <TableCell>{studentSchoolName}</TableCell>
                                <TableCell>{student.loginUserName}</TableCell>
                                <TableCell>{student.password}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-center text-gray-500 mt-4">
                    No students found.
                </p>
            )}

            <div className="flex justify-center items-center gap-3 pt-6">
                <Button
                    variant="outline"
                    onClick={() => closeRef.current?.click()}
                    className="px-6 border-[#636F85] text-[#636F85] font-medium"
                >
                    Close
                </Button>

                {studentList?.length > 0 && (
                    <Button
                        onClick={handleExportToGoogleSheets}
                        className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A] text-white font-medium px-6"
                    >
                        Export to Google Sheets
                    </Button>
                )}
            </div>
        </DialogContent>
    );
};

export default ShowBulkStudentsModal;