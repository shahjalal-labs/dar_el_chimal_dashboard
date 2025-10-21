"use client";

import React, { useRef } from 'react';
import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const ShowBulkTeachersModal = () => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const { teacherSchoolName, teacherList } = useSelector((state: RootState) => state.teacher);

    const handleExportToGoogleSheets = () => {
        if (!teacherList || teacherList.length === 0) {
            alert("No data available to export!");
            return;
        }

        const headers = ["Sl/No", "School Name", "User Name", "Password"];
        const csvRows = [
            headers.join(","),
            ...teacherList.map((t, i) =>
                `${String(i + 1).padStart(2, "0")},${teacherSchoolName},${t.loginUserName},${t.password}`
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
        <DialogContent className="overflow-y-auto overflow-x-hidden max-h-[75%] min-w-[50%] p-6">
            <DialogClose ref={closeRef} className="hidden" />
            <h1 className="font-bold text-2xl mb-4">Teacher List</h1>

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
                    {teacherList?.map((list, idx) => (
                        <TableRow key={idx}>
                            <TableCell className="text-sm">{String(idx + 1).padStart(2, "0")}</TableCell>
                            <TableCell>{teacherSchoolName}</TableCell>
                            <TableCell>{list?.loginUserName}</TableCell>
                            <TableCell>{list?.password}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-center items-center gap-3 pt-6">
                <Button
                    variant="outline"
                    onClick={() => closeRef.current?.click()}
                    className="px-6 border-[#636F85] text-[#636F85] font-medium"
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleExportToGoogleSheets}
                    className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A] text-white font-medium px-6"
                >
                    Export to Google Sheets
                </Button>
            </div>
        </DialogContent>
    );
};

export default ShowBulkTeachersModal;