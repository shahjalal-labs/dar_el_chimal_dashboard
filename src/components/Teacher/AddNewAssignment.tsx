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

  const handleGradeChange = (newGradeId: string) => {
    setSelectedGradeId(newGradeId);
    setFormData((prev) => ({
      ...prev,
      book: { id: "", name: "" },
      selectedStudents: [],
    }));
    route.replace(`/teacher/classes/${newGradeId}/add-new-assignment`);
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

  const students = data?.result?.students || [];

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

  const handleFileChange = (e: any) => {
    setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
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
            <label className="font-medium text-[#30373D]">
              Attachment (Optional)
            </label>
            <br />
            <label className="cursor-pointer">
              <div className="border border-dashed rounded-lg flex flex-col justify-center items-center w-full mt-2 p-6">
                <input
                  type="file"
                  name="attachment"
                  onChange={handleFileChange}
                  className="border rounded-md p-2 w-full hidden"
                />
                <Image
                  src={link}
                  height={50}
                  width={50}
                  alt="Link"
                  className="w-6 h-6 mx-auto"
                  priority
                />
                <p className="text-[#4C4C4C] text-center mt-4">
                  Attach PDF, Audio or Link
                </p>
              </div>
            </label>
            {formData?.attachment && (
              <p className="text-sm text-gray-600 mt-2">
                Selected:{" "}
                <span className="font-medium">
                  {formData?.attachment?.name}
                </span>
              </p>
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
              value={formData.dueDate ? formData.dueDate.split("T")[0] : ""}
              onChange={(e) => {
                const selectedDate = e.target.value;
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
                  All students in{" "}
                  {data?.result?.gradeData?.grade ||
                    teacherGrades.find((g: any) => g.id === selectedGradeId)?.grade ||
                    "this class"}
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
              <div className="">
                {isLoading ? (
                  <p className="text-gray-500 py-2 text-sm">Loading students...</p>
                ) : students.length === 0 ? (
                  <p className="text-gray-500 py-2 text-sm">
                    No students found in this class.
                  </p>
                ) : (
                  <>
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={
                          formData.selectedStudents.length === students.length &&
                          students.length > 0
                        }
                        onChange={handleSelectAll}
                        className="accent-[#1E3A8A] size-4 mr-2"
                      />
                      <span className="text-[#272727] font-semibold">
                        Select All
                      </span>
                    </div>

                    {students?.map((student: any) => (
                      <div
                        key={student?.id}
                        className="flex items-center space-x-2 py-1"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedStudents.includes(student?.id)}
                          onChange={() => handleStudentSelect(student.id)}
                          className="accent-[#1E3A8A] size-4 mr-2"
                        />
                        <Image
                          src={
                            student.profileImage ||
                            "https://res.cloudinary.com/dddrm7ep8/image/upload/v1788255470/n2tfqinlzgwpdkittexh.jpg"
                          }
                          height={50}
                          width={50}
                          alt="profile"
                          className="w-8 h-8 rounded-full object-cover"
                          priority
                        />
                        <span>{student.fullName || student.email}</span>
                      </div>
                    ))}
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
