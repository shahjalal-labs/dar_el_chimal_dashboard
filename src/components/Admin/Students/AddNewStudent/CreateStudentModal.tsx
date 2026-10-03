/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { DialogClose, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import GetSchools, { SchoolOption } from "@/components/Common/GetSchools";
import Select from "react-select";
import { useGetAllGradesQuery } from "@/redux/api/grade";
import { useAssignedBooksQuery } from "@/redux/api/school";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PiSpinner } from "react-icons/pi";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useCreateBulkStudentMutation } from "@/redux/api/student";
import {
  setNumberOfStudent,
  setStudentSchoolName,
} from "@/redux/features/studentSlice";
import { sortGrades } from "@/lib/gradeUtils";

interface GradeOption {
  id: string;
  label: string;
  schoolId: string;
}

interface BookOption {
  id: string;
  label: string;
  gradeIds?: string[];
}

interface Mapping {
  id: string;
  school: SchoolOption | null;
  grade: GradeOption | null;
}

const CreateStudentModal = () => {
  const dispatch = useDispatch();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { numberOfStudent } = useSelector((state: RootState) => state.student);

  const [mappings, setMappings] = useState<Mapping[]>([
    { id: Date.now().toString(), school: null, grade: null },
  ]);
  const [selectedBooks, setSelectedBooks] = useState<BookOption[]>([]);
  const [lastGradeId, setLastGradeId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setNumberOfStudent(0));
    return () => {
      dispatch(setNumberOfStudent(0));
    };
  }, [dispatch]);

  const { data: gradesData } = useGetAllGradesQuery({
    currentPage: 1,
    limit: 1000,
  });

  const selectedSchoolId = mappings[0]?.school?.schoolId;
  const { data: assignedBooksData } = useAssignedBooksQuery(selectedSchoolId, {
    skip: !selectedSchoolId,
  });

  const [createStudent, { isLoading: isCreating }] =
    useCreateBulkStudentMutation();

  const allGrades: GradeOption[] =
    gradesData?.result?.map((g: any) => ({
      id: g.id,
      label: g.grade,
      schoolId: g.schoolId,
    })) ?? [];

  const handleSchoolChange = (id: string, school: SchoolOption) => {
    dispatch(setStudentSchoolName(school?.schoolName));
    setMappings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, school, grade: null } : item,
      ),
    );
    setSelectedBooks([]);
    setLastGradeId(null);
  };

  const handleGradeChange = (id: string, selectedGrade: GradeOption | null) => {
    setMappings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, grade: selectedGrade } : item,
      ),
    );
  };

  const availableBooks: BookOption[] = useMemo(() => {
    if (!assignedBooksData?.result || !mappings[0]?.grade) return [];
    const currentGradeId = mappings[0].grade.id;
    const matching = assignedBooksData.result
      .filter((b: any) => b.gradeIds?.includes(currentGradeId))
      .map((b: any) => ({
        id: b.id,
        label: b.bookName || "Untitled Book",
        gradeIds: b.gradeIds,
      }));
    if (matching.length > 0) return matching;
    return assignedBooksData.result.map((b: any) => ({
      id: b.id,
      label: b.bookName || "Untitled Book",
      gradeIds: b.gradeIds,
    }));
  }, [assignedBooksData, mappings]);

  useEffect(() => {
    const currentGradeId = mappings[0]?.grade?.id || null;
    if (currentGradeId !== lastGradeId) {
      setLastGradeId(currentGradeId);
      if (availableBooks.length > 0) {
        setSelectedBooks(availableBooks);
      } else {
        setSelectedBooks([]);
      }
    }
  }, [mappings, lastGradeId, availableBooks]);

  const isAllSelected =
    availableBooks.length > 0 && selectedBooks.length === availableBooks.length;
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(availableBooks);
    }
  };

  const handleSave = async () => {
    if (
      !mappings[0]?.school ||
      !mappings[0]?.grade ||
      !numberOfStudent ||
      numberOfStudent < 1
    ) {
      toast.warning("Please fill all required fields correctly");
      return;
    }

    const body = {
      schoolId: mappings[0].school.schoolId,
      gradeId: mappings[0].grade.id,
      numberOfStudent: numberOfStudent,
      bookIds: selectedBooks.length > 0 ? selectedBooks.map((b) => b.id) : undefined,
    };

    try {
      const response = await createStudent(body).unwrap();
      if (response.success) {
        toast.success(
          response?.message || "Students created successfully!",
        );
        dispatch(setNumberOfStudent(0));
        setMappings([{ id: Date.now().toString(), school: null, grade: null }]);
        setSelectedBooks([]);
        closeRef.current?.click();
      }
    } catch (error) {
      toast.warning(
        (error as any)?.data?.message ||
          "Something went wrong while creating students",
      );
    }
  };

  const isButtonDisabled =
    !mappings[0]?.school || !mappings[0]?.grade || !numberOfStudent || isCreating;

  return (
    <DialogContent
      className="overflow-y-auto overflow-x-hidden max-h-[75%] min-w-[50%] p-6"
      showCloseButton
    >
      <DialogClose ref={closeRef} className="hidden" />
      <h1 className="font-bold text-2xl">Create New Students</h1>

      <div>
        {mappings.map((mapping) => {
          const { school, grade } = mapping;
          const filteredGradeOptions = school
            ? sortGrades(
                allGrades.filter(
                  (g) => String(g.schoolId) === String(school.schoolId),
                ),
              )
            : [];

          return (
            <div key={mapping.id}>
              <div className="flex flex-col md:flex-row items-start gap-6 mb-6 relative">
                <div className="flex-1 w-full">
                  <Label className="flex items-center gap-2">
                    School Name
                    <span className="text-xs text-[#636F85] font-normal">(Can search schools)</span>
                  </Label>
                  <GetSchools
                    value={school}
                    onChange={(selectedSchool) =>
                      handleSchoolChange(mapping.id, selectedSchool)
                    }
                    excludeIds={mappings.filter((m) => m.id !== mapping.id && m.school).map((m) => m.school!.schoolId)}
                  />
                </div>

                {/* Number of Students */}
                <div className="flex-1 relative w-full">
                  <Label>Number of Students</Label>
                  <Input
                    type="number"
                    step={1}
                    min={1}
                    max={100}
                    placeholder="e.g. 50"
                    value={numberOfStudent === 0 ? "" : numberOfStudent}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const valStr = e.target.value;
                      if (!valStr) {
                        dispatch(setNumberOfStudent(0));
                        return;
                      }
                      const sanitized = valStr.replace(/^0+/, "");
                      if (sanitized === "") {
                        e.target.value = "";
                        dispatch(setNumberOfStudent(0));
                        return;
                      }
                      const value = Number(sanitized);
                      if (value <= 100) {
                        e.target.value = String(value);
                        dispatch(setNumberOfStudent(value));
                      } else {
                        e.target.value = "100";
                        dispatch(setNumberOfStudent(100));
                        toast.error(
                          "The number of students cannot be more than 100!",
                        );
                      }
                    }}
                    required
                  />
                </div>
              </div>

              {/* Grade Selection */}
              <div className="flex-1 w-full">
                <Label>Grade</Label>
                <Select<GradeOption, false>
                  isMulti={false}
                  options={filteredGradeOptions}
                  className="basic-single-select mt-2"
                  classNamePrefix="select"
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.id}
                  value={grade}
                  onChange={(selectedOption) =>
                    handleGradeChange(mapping.id, selectedOption as GradeOption)
                  }
                  placeholder={grade ? "" : "Select grade..."}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#CBD5E1",
                      borderRadius: "0.5rem",
                      boxShadow: "none",
                      padding: "2px 4px",
                    }),
                    placeholder: (base, state) => ({
                      ...base,
                      display: (state.hasValue || Boolean(grade)) ? 'none' : 'block',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      display: 'flex',
                      alignItems: 'center',
                    }),
                  }}
                />
              </div>

              {/* Assign Books Section */}
              <div className="flex-1 w-full mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <Label>Assign Books</Label>
                  {availableBooks.length > 0 && (
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      {isAllSelected ? "Unselect All" : "Select All"}
                    </button>
                  )}
                </div>
                <Select<BookOption, true>
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  options={availableBooks}
                  className="basic-multi-select mt-2"
                  classNamePrefix="select"
                  placeholder={
                    selectedBooks.length > 0
                      ? ""
                      : grade
                      ? (availableBooks.length > 0
                          ? "Select books to assign (leave empty to assign all)..."
                          : "No books available for this grade")
                      : "Please select a grade first"
                  }
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.id}
                  value={selectedBooks}
                  onChange={(selected) =>
                    setSelectedBooks([...(selected || [])])
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#CBD5E1",
                      borderRadius: "0.5rem",
                      boxShadow: "none",
                      padding: "2px 4px",
                    }),
                    placeholder: (base, state) => ({
                      ...base,
                      display:
                        state.hasValue || selectedBooks.length > 0
                          ? "none"
                          : "block",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#E5E7EB",
                      borderRadius: "9999px",
                      padding: "0 4px",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      fontWeight: 500,
                      color: "#374151",
                      paddingRight: 6,
                    }),
                  }}
                />
                {grade && availableBooks.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                    <span className="font-semibold text-[#1E3A8A]">Note:</span> If left empty, all books available for this grade will automatically be assigned to the students.
                  </p>
                )}
                {grade && availableBooks.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No books currently mapped to this school/grade.
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex justify-center items-center gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setMappings([{ id: Date.now().toString(), school: null, grade: null }]);
              setSelectedBooks([]);
              closeRef.current?.click();
            }}
            className="px-6 border-[#636F85] text-[#636F85] font-medium"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={isButtonDisabled}
            className={`px-6 text-white font-medium transition-all ease-in-out duration-500 cursor-pointer ${
              isButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A]"
            }`}
          >
            {isCreating ? (
              <div className="flex justify-center items-center gap-2">
                Creating...
                <PiSpinner className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default CreateStudentModal;
