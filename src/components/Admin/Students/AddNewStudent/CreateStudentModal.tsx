/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useRef, useState } from "react";
import { DialogClose, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import GetSchools, { SchoolOption } from "@/components/Common/GetSchools";
import Image from "next/image";
import Select from "react-select";
import { useGetAllGradesQuery } from "@/redux/api/grade";
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
import schoolImg from "@/assets/school.png";

interface GradeOption {
  id: string;
  label: string;
  schoolId: string;
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

  const { data: gradesData } = useGetAllGradesQuery({
    currentPage: 1,
    limit: 1000,
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
  };

  const handleGradeChange = (id: string, selectedGrade: GradeOption | null) => {
    setMappings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, grade: selectedGrade } : item,
      ),
    );
  };

  const selectedSchoolIds = useMemo(
    () => mappings.filter((m) => m.school).map((m) => m.school!.schoolId),
    [mappings],
  );

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
    };

    try {
      const response = await createStudent(body).unwrap();
      if (response.success) {
        toast.success(
          "Student creation process is in progress. Please refresh after a few seconds.",
        );
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
    !mappings[0]?.school || !mappings[0]?.grade || !numberOfStudent;

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
            ? allGrades.filter(
                (g) => String(g.schoolId) === String(school.schoolId),
              )
            : [];

          return (
            <div key={mapping.id}>
              <div className="flex flex-col md:flex-row items-start gap-6 mb-6 relative">
                {/* School Name */}
                <div className="flex-1 relative w-full">
                  <Label>School Name</Label>
                  <GetSchools
                    onChange={(selectedSchool) =>
                      handleSchoolChange(mapping.id, selectedSchool)
                    }
                    excludeIds={selectedSchoolIds}
                  />

                  {/* Display selected school */}
                  {school && (
                    <div className="flex items-center gap-2 mt-2 absolute top-[35%] left-4">
                      <Image
                        src={school?.image || schoolImg}
                        height={32}
                        width={24}
                        alt={school.schoolName}
                        className="rounded-xl"
                      />
                      <span>{school.schoolName}</span>
                    </div>
                  )}
                </div>

                {/* Number of Students */}
                <div className="flex-1 relative w-full">
                  <Label>Number of Students</Label>
                  <Input
                    type="number"
                    step={1}
                    min={1}
                    max={100}
                    placeholder="00"
                    value={numberOfStudent}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= 100) {
                        dispatch(setNumberOfStudent(value));
                      } else {
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
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#CBD5E1",
                      borderRadius: "0.5rem",
                      boxShadow: "none",
                      padding: "2px 4px",
                    }),
                  }}
                />
              </div>
            </div>
          );
        })}

        <div className="flex justify-center items-center gap-3 pt-6">
          <Button
            variant="outline"
            onClick={() => closeRef.current?.click()}
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
