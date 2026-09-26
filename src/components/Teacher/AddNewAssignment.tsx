/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  useCreateAssignmentMutation,
  useGetAllBooksForTeacherQuery,
  useGetAllStudentsByTeacherQuery,
  useGetTeacherOverviewQuery,
} from "@/redux/api/teacher/overviewApi";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import link from "@/assets/attach_file_add.svg";
import { toast } from "sonner";
import { PiSpinner } from "react-icons/pi";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { TfiAngleLeft } from "react-icons/tfi";
import { FileText, Search, Trash2, X } from "lucide-react";

interface AssignmentFormData {
  title: string;
  instruction: string;
  book: { id: string; name: string };
  pageFrom: string;
  pageTo: string;
  attachment: File | null;
  dueDate: string;
  selectedStudents: string[];
  assignToAll: boolean;
}

const AddNewAssignment = () => {
  const route = useRouter();
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  const { data: teacherOverviewData } = useGetTeacherOverviewQuery(undefined);
  const teacherGrades = useMemo(
    () => teacherOverviewData?.result?.grades || [],
    [teacherOverviewData]
  );

  const [selectedGradeId, setSelectedGradeId] = useState<string>(
    id && id !== "all" ? (id as string) : ""
  );

  useEffect(() => {
    if (id && id !== "all") {
      setSelectedGradeId(id as string);
    } else if (!selectedGradeId && teacherGrades.length > 0) {
      setSelectedGradeId(teacherGrades[0].id);
    }
  }, [id, teacherGrades, selectedGradeId]);

  const { data, isLoading } = useGetAllStudentsByTeacherQuery(selectedGradeId, {
    skip: !selectedGradeId,
  });

  const { data: allBooks } = useGetAllBooksForTeacherQuery(
    {
      currentPage: 1,
      limit: 100,
      gradeId: selectedGradeId,
    },
    { skip: !selectedGradeId }
  );


  const [CreateAssignment, { isLoading: isCreating }] =
    useCreateAssignmentMutation();

  const [formData, setFormData] = useState<AssignmentFormData>({
    title: "",
    instruction: "",
    book: { id: "", name: "" },
    pageFrom: "",
    pageTo: "",
    attachment: null,
    dueDate: "",
    selectedStudents: [],
    assignToAll: true,
  });

  const [studentSearchTerm, setStudentSearchTerm] = useState("");

  const handleGradeChange = (newGradeId: string) => {
    setSelectedGradeId(newGradeId);
    setFormData((prev) => ({
      ...prev,
      book: { id: "", name: "" },
      selectedStudents: [],
    }));
    if (typeof window !== "undefined") {
      window.history.replaceState(
        null,
        "",
        `/teacher/classes/${newGradeId}/add-new-assignment`
      );
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSelect = (id: any) => {
    setFormData((prev: any) => {
      const selected = prev.selectedStudents.includes(id)
        ? prev.selectedStudents.filter((sid: any) => sid !== id)
        : [...prev.selectedStudents, id];
      return { ...prev, selectedStudents: selected };
    });
  };

  const students = useMemo(() => data?.result?.students || [], [data]);

  const currentGradeName = useMemo(() => {
    return (
      data?.result?.gradeData?.grade ||
      teacherGrades.find((g: any) => g.id === selectedGradeId)?.grade ||
      "this class"
    );
  }, [data, teacherGrades, selectedGradeId]);

  const filteredStudents = useMemo(() => {
    if (!studentSearchTerm.trim()) return students;
    const term = studentSearchTerm.trim().toLowerCase();
    return students.filter(
      (s: any) =>
        s?.fullName?.toLowerCase().includes(term) ||
        s?.loginUserName?.toLowerCase().includes(term) ||
        s?.email?.toLowerCase().includes(term)
    );
  }, [students, studentSearchTerm]);

  const handleSelectAll = () => {
    if (formData.selectedStudents.length === students.length && students.length > 0) {
      setFormData((prev) => ({ ...prev, selectedStudents: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedStudents: students.map((s: any) => s.id) || [],
      }));
    }
  };

  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, attachment: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGradeId) {
      toast.warning("Please select a class");
      return;
    }

    if (!formData.book.id) {
      toast.warning("Please select a book");
      return;
    }

    if (!formData.dueDate) {
      toast.warning("Please select a due date");
      return;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    if (new Date(formData.dueDate) < todayStart) {
      toast.warning("Due date cannot be in the past");
      return;
    }

    const body = {
      title: formData.title,
      startPage: formData.pageFrom,
      endPage: formData.pageTo,
      instruction: formData.instruction,
      dueDate: formData.dueDate,
      gradeId: selectedGradeId,
      bookId: formData.book.id,
      assignToAll: formData.assignToAll,
      studentIds: formData.selectedStudents,
    };

    const payload = new FormData();

    payload.append("bodyData", JSON.stringify(body));
    if (formData?.attachment) payload.append("file", formData?.attachment);

    try {
      const response = await CreateAssignment(payload).unwrap();
      if (response.success) {
        toast.success(response.message);
        setOpen(true);
      }
    } catch (error) {
      toast?.warning((error as any)?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div>
        <div className="mb-6 flex flex-col-reverse md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-3">Add New Assignment</h1>
            <p className="font-medium">
              <span className="text-[#72727299]">Assignment</span>
              <span className="text-[#72727299] px-2">/</span>Add New Assignment
            </p>
          </div>
          <Button
            onClick={() => route.back()}
            className="mb-6 md:mb-0 bg-white/80 text-black hover:text-white cursor-pointer w-fit"
          >
            <TfiAngleLeft />
            Back
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white rounded-xl p-10"
        >
          {/* Assignment Title */}
          <div>
            <label className="font-medium text-[#30373D]">
              Assignment Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter your assignment title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-2"
              required
            />
          </div>

          {/* Assignment Instruction */}
          <div>
            <label className="font-medium text-[#30373D]">
              Assignment Instruction
            </label>
            <textarea
              name="instruction"
              placeholder="Enter assignment instructions"
              value={formData.instruction}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-2"
              rows={4}
              required
            />
          </div>

          {/* Class / Grade Selection */}
          <div>
            <label className="font-medium text-[#30373D]">
              Class / Grade
            </label>
            <select
              value={selectedGradeId}
              onChange={(e) => handleGradeChange(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none bg-white mt-2"
              required
            >
              <option value="" disabled>
                {teacherGrades.length === 0
                  ? "No classes assigned"
                  : "Select Class / Grade"}
              </option>
              {teacherGrades.map((g: any) => (
                <option key={g.id} value={g.id}>
                  {g.grade}
                </option>
              ))}
            </select>
          </div>

          {/* Books  */}
          <div>
            <label className="font-medium text-[#30373D]">Books</label>
            <select
              name="book"
              value={formData.book.id ? JSON.stringify(formData.book) : ""}
              onChange={(e) => {
                if (!e.target.value) {
                  setFormData((prev) => ({ ...prev, book: { id: "", name: "" } }));
                  return;
                }
                try {
                  const value = JSON.parse(e.target.value);
                  setFormData((prev) => ({ ...prev, book: value }));
                } catch {
                  setFormData((prev) => ({ ...prev, book: { id: "", name: "" } }));
                }
              }}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none bg-white mt-2"
              required
            >
              <option value="" disabled>
                {allBooks?.result?.data?.length === 0
                  ? "No books available for this class"
                  : "Select a book"}
              </option>
              {allBooks?.result?.data?.map((book: any) => (
                <option
                  key={book.id}
                  value={JSON.stringify({ id: book.id, name: book.bookName })}
                >
                  {book.bookName}
                </option>
              ))}
            </select>
          </div>

          {/*  Pages */}
          <div className="flex items-center space-x-6">
            <div className="flex-1">
              <label className="font-medium text-[#30373D]">Page</label>
              <input
                type="number"
                name="pageFrom"
                placeholder="From"
                value={formData.pageFrom}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-2"
                required
              />
            </div>

            <div className="flex-1">
              <label className="font-medium text-[#30373D]">To</label>
              <input
                type="number"
                name="pageTo"
                placeholder="To"
                value={formData.pageTo}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-2"
                required
              />
            </div>
          </div>

          {/* Attachment */}
          <div>
            <div className="flex items-center justify-between">
              <label className="font-medium text-[#30373D]">
                Attachment (Optional)
              </label>
              {formData.attachment && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove file
                </button>
              )}
            </div>

            {!formData.attachment ? (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  name="attachment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="border border-dashed border-gray-300 hover:border-[#1E3A8A] transition-colors rounded-lg flex flex-col justify-center items-center w-full mt-2 p-6 bg-gray-50/50 hover:bg-blue-50/30">
                  <Image
                    src={link}
                    height={32}
                    width={32}
                    alt="Attach"
                    className="w-6 h-6 mx-auto opacity-70"
                    priority
                  />
                  <p className="text-[#4C4C4C] text-center mt-4 font-medium text-sm">
                    Attach PDF, Audio or Link
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Click to browse file</p>
                </div>
              </label>
            ) : (
              <div className="mt-2 border-2 border-[#1E3A8A]/30 bg-[#F0F4FF] rounded-xl p-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-xs md:max-w-md">
                        {formData.attachment.name}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-100 text-green-800 shrink-0">
                        Selected
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {(formData.attachment.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-4">
                  <label className="cursor-pointer text-xs font-medium text-[#1E3A8A] hover:bg-white bg-white/80 border border-[#1E3A8A]/40 px-3 py-1.5 rounded-lg transition shadow-2xs">
                    Change
                    <input
                      type="file"
                      name="attachment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="font-medium text-[#30373D]">
              Select Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              min={getTodayDateString()}
              value={formData.dueDate ? formData.dueDate.split("T")[0] : ""}
              onChange={(e) => {
                const selectedDate = e.target.value;
                if (!selectedDate) {
                  setFormData((prev) => ({ ...prev, dueDate: "" }));
                  return;
                }
                const todayStr = getTodayDateString();
                if (selectedDate < todayStr) {
                  toast.warning("Due date cannot be in the past");
                  return;
                }
                const isoDate = `${selectedDate}T23:59:59Z`;

                setFormData((prev) => ({
                  ...prev,
                  dueDate: isoDate,
                }));
              }}
              className="border rounded-md p-2 w-full cursor-pointer mt-2"
              required
            />
          </div>

          {/* Student Selection */}
          <div>
            <label className="font-medium text-[#30373D]">Assign To</label>
            <div className="mt-2 mb-10 space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="assignTo"
                  checked={formData.assignToAll}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, assignToAll: true }))
                  }
                  className="accent-[#1E3A8A] size-5 cursor-pointer"
                />
                <span className="text-[#272727] font-semibold">
                  All students in {currentGradeName}
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="assignTo"
                  checked={!formData.assignToAll}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, assignToAll: false }))
                  }
                  className="accent-[#1E3A8A] size-5 cursor-pointer"
                />
                <span className="text-[#272727] font-semibold">Individual</span>
              </label>
            </div>

            {/* Individual student list */}
            {!formData.assignToAll && (
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 mt-4">
                {isLoading ? (
                  <p className="text-gray-500 py-3 text-sm text-center">Loading students...</p>
                ) : students.length === 0 ? (
                  <p className="text-gray-500 py-3 text-sm text-center">
                    No students found in this class.
                  </p>
                ) : (
                  <>
                    {/* Search and Select All controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200">
                      <div className="flex items-center">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              formData.selectedStudents.length === students.length &&
                              students.length > 0
                            }
                            onChange={handleSelectAll}
                            className="accent-[#1E3A8A] size-4 rounded cursor-pointer"
                          />
                          <span className="text-[#272727] font-semibold text-sm">
                            Select All
                          </span>
                        </label>
                        <span className="text-xs text-gray-500 ml-3 bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
                          {formData.selectedStudents.length} of {students.length} selected
                        </span>
                      </div>

                      {students.length > 3 && (
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search student name..."
                            value={studentSearchTerm}
                            onChange={(e) => setStudentSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#1E3A8A]"
                          />
                          {studentSearchTerm && (
                            <button
                              type="button"
                              onClick={() => setStudentSearchTerm("")}
                              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {filteredStudents.length === 0 ? (
                      <p className="text-gray-400 py-4 text-xs text-center">
                        No students match &quot;{studentSearchTerm}&quot;
                      </p>
                    ) : (
                      <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                        {filteredStudents.map((student: any) => {
                          const isSelected = formData.selectedStudents.includes(student?.id);
                          const studentGrade = student?.grade || currentGradeName;
                          return (
                            <div
                              key={student?.id}
                              onClick={() => handleStudentSelect(student.id)}
                              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors border ${
                                isSelected
                                  ? "bg-blue-50/80 border-[#1E3A8A]/30"
                                  : "bg-white hover:bg-gray-50 border-gray-100"
                              }`}
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}} // handled by parent onClick
                                  className="accent-[#1E3A8A] size-4 rounded cursor-pointer shrink-0"
                                />
                                <Image
                                  src={
                                    student.profileImage ||
                                    "https://res.cloudinary.com/dddrm7ep8/image/upload/v1788255470/n2tfqinlzgwpdkittexh.jpg"
                                  }
                                  height={40}
                                  width={40}
                                  alt="profile"
                                  className="w-7 h-7 rounded-full object-cover shrink-0"
                                  priority
                                />
                                <div className="min-w-0 flex items-center gap-2">
                                  <span className="font-semibold text-sm text-[#272727] truncate">
                                    {student.fullName || student.loginUserName || "Student"}
                                  </span>
                                  {student.loginUserName && student.loginUserName !== student.fullName && (
                                    <span className="text-xs text-gray-400 hidden sm:inline">
                                      (@{student.loginUserName})
                                    </span>
                                  )}
                                </div>
                              </div>

                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100/70 text-[#1E3A8A] font-medium shrink-0 ml-2">
                                Grade: {studentGrade}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-4">
            <Button
              type="button"
              variant="default"
              className="border px-4 py-2 rounded-md bg-white text-black hover:text-white"
              onClick={() => route.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A80] text-white px-4 py-2 rounded-md transition ease-in-out duration-500 cursor-pointer"
            >
              {isCreating ? (
                <div className="flex items-center gap-2.5">
                  Saving...
                  <PiSpinner className="animate-spin h-4 w-4" />
                </div>
              ) : (
                "Save Assignment"
              )}
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-6">
          <h1 className="text-2xl text-[#30373D] font-semibold">
            Homework has been assigned to{" "}
            {formData?.assignToAll
              ? students?.length
              : formData?.selectedStudents?.length}{" "}
            students.
          </h1>
          <div className="flex items-center gap-6">
            <div className="space-y-2">
              <p className="font-semibold text-[#30373D]">Title:</p>
              <p className="font-semibold text-[#30373D]">Instruction:</p>
              <p className="font-semibold text-[#30373D]">Book:</p>
              <p className="font-semibold text-[#30373D]">Page:</p>
              <p className="font-semibold text-[#30373D]">Due:</p>
              <p className="font-semibold text-[#30373D]">Assigned to:</p>
            </div>
            <div className="space-y-2">
              <p className="text-[#4C4C4C]">{formData?.title}</p>
              <p className="text-[#4C4C4C]">{formData?.instruction}</p>
              <p className="text-[#4C4C4C]">{formData?.book?.name}</p>
              <p className="text-[#4C4C4C]">
                {formData?.pageFrom} to {formData?.pageTo}
              </p>
              <p className="text-[#4C4C4C]">
                {new Date(formData?.dueDate).toLocaleString("en-Us", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })}
              </p>
              <p className="text-[#4C4C4C]">
                {data?.result?.gradeData?.grade}
                {formData?.assignToAll
                  ? "(All)"
                  : ` (${formData?.selectedStudents?.map((sId, idx) => data?.result?.students?.map((id: any) => id?.id === sId && ` ${id?.email} ${formData?.selectedStudents?.length < idx + 1 ? "," : ""}`))})`}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewAssignment;
