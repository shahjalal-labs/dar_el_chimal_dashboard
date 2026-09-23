/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useRef, useState } from "react";
import { DialogClose, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import GetSchools, { SchoolOption } from "@/components/Common/GetSchools";
import Select, { ActionMeta, OnChangeValue, StylesConfig } from "react-select";
import { useGetAllGradesQuery } from "@/redux/api/grade";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PiSpinner } from "react-icons/pi";
import { toast } from "sonner";
import { useCreateBulkTeacherMutation } from "@/redux/api/teacher";
import { useDispatch, useSelector } from "react-redux";
import {
  setNumberOfTeacher,
  setTeacherSchoolName,
} from "@/redux/features/teacherSlice";
import { RootState } from "@/redux/store/store";
import { useGetAllBookCategoriesQuery } from "@/redux/api/bookCategory";
import { sortGrades } from "@/lib/gradeUtils";

interface GradeOption {
  id: string;
  label: string;
  schoolId: string;
}

interface Mapping {
  id: string;
  school: SchoolOption | null;
  grades: GradeOption[];
}

interface CategoryOption {
  id: string;
  categoryName: string;
  isFixed?: false;
}

const styles: StylesConfig<CategoryOption, true> = {
  multiValue: (base, state) => ({
    ...base,
    backgroundColor: state.data.isFixed ? "#9CA3AF" : "#E5E7EB", // gray
    borderRadius: "9999px",
    padding: "0 4px",
  }),
  multiValueLabel: (base, state) => ({
    ...base,
    fontWeight: state.data.isFixed ? "600" : "400",
    color: state.data.isFixed ? "white" : "#374151",
    paddingRight: 6,
  }),
  multiValueRemove: (base, state) => ({
    ...base,
    display: state.data.isFixed ? "none" : "flex",
    cursor: "pointer",
  }),
  control: (base) => ({
    ...base,
    borderColor: "#CBD5E1",
    borderRadius: "0.5rem",
    boxShadow: "none",
    padding: "2px 4px",
  }),
};

const CreateTeacherModal = () => {
  const dispatch = useDispatch();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { numberOfTeacher } = useSelector((state: RootState) => state.teacher);
  const [mappings, setMappings] = useState<Mapping[]>([
    { id: Date?.now()?.toString(), school: null, grades: [] },
  ]);

  const { data: gradesData } = useGetAllGradesQuery({
    currentPage: 1,
    limit: 1000,
  });
  const { data: allBookCategories } = useGetAllBookCategoriesQuery({
    currentPage: 1,
    limit: 1000,
  });

  const allCategories: CategoryOption[] =
    allBookCategories?.result?.result?.map((category: any) => ({
      id: category?.id,
      categoryName: category?.name,
      isFixed: false,
    })) ?? [];

  const orderOptions = (values: readonly CategoryOption[]) => {
    return [
      ...values.filter((v) => v.isFixed),
      ...values.filter((v) => !v.isFixed),
    ];
  };

  const [value, setValue] = useState<readonly CategoryOption[]>([]);

  const [CreateTeacher, { isLoading: isCreating }] =
    useCreateBulkTeacherMutation();

  const allGrades: GradeOption[] =
    gradesData?.result?.map((singleGrade: any) => ({
      id: singleGrade?.id,
      label: singleGrade?.grade,
      schoolId: singleGrade?.schoolId,
    })) ?? [];

  const onChange = (
    newValue: OnChangeValue<CategoryOption, true>,
    actionMeta: ActionMeta<CategoryOption>,
  ) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        newValue = value.filter((v) => v.isFixed); // keep fixed ones
        break;
    }

    setValue(orderOptions(newValue));
  };

  const handleSchoolChange = (id: string, school: SchoolOption) => {
    dispatch(setTeacherSchoolName(school?.schoolName));
    setMappings((prev) =>
      prev?.map((item) =>
        item?.id === id ? { ...item, school, grades: [] } : item,
      ),
    );
  };

  const handleGradeChange = (
    id: string,
    selectedGrades: readonly GradeOption[],
  ) => {
    setMappings((prev) =>
      prev?.map((item) =>
        item?.id === id ? { ...item, grades: [...selectedGrades] } : item,
      ),
    );
  };

  const selectedSchoolIds = useMemo(
    () => mappings?.filter((m) => m?.school)?.map((m) => m?.school!.schoolId),
    [mappings],
  );

  const handleSave = async () => {
    const formData = {
      schoolId: mappings[0]?.school?.schoolId,
      gradeIds: mappings[0]?.grades?.map((g: any) => g?.id),
      numberOfTeacher: numberOfTeacher,
      bookCategoryIds: value?.map((c: any) => c?.id),
    };

    try {
      const response = await CreateTeacher(formData).unwrap();
      if (response.success) {
        toast.success(
          "Teacher creation process is in progress. Please refresh after a few seconds.",
        );
        closeRef.current?.click();
      }
    } catch (error) {
      toast.warning((error as any)?.data?.message || "Something went wrong");
    }
  };

  const isButtonDisabled =
    !mappings[0].school || !numberOfTeacher || !mappings[0].grades.length;

  return (
    <DialogContent
      className="overflow-y-auto overflow-x-hidden max-h-[75%] min-w-[50%] p-6"
      showCloseButton
    >
      <DialogClose ref={closeRef} className="hidden" />
      <h1 className="font-bold text-2xl">Create New Teacher</h1>

      <div className="w-full">
        <Label>Select Book Categories</Label>
        <Select
          value={value}
          isMulti
          styles={styles}
          name="categories"
          className="react-select-container rounded-xl mt-2"
          classNamePrefix="select"
          getOptionLabel={(option) => option.categoryName}
          getOptionValue={(option) => option.id}
          onChange={onChange}
          options={allCategories}
          placeholder="Choose categories..."
        />
      </div>

      <div>
        {mappings?.map((mapping) => {
          const { school, grades } = mapping;
          const filteredGradeOptions = school
            ? sortGrades(
                allGrades?.filter(
                  (g: any) => String(g?.schoolId) === String(school?.schoolId),
                ),
              )
            : [];

          const isAllSelected =
            filteredGradeOptions.length > 0 &&
            grades.length === filteredGradeOptions.length;

          const handleToggleSelectAll = () => {
            if (isAllSelected) {
              handleGradeChange(mapping?.id, []);
            } else {
              handleGradeChange(mapping?.id, filteredGradeOptions);
            }
          };

          return (
            <div key={mapping?.id}>
              <div className="flex flex-col md:flex-row items-start gap-6 mb-6 relative">
                {/* School Name */}
                <div className="flex-1 relative w-full">
                  <Label>School Name</Label>
                  <GetSchools
                    value={school}
                    onChange={(selectedSchool) =>
                      handleSchoolChange(mapping?.id, selectedSchool)
                    }
                    excludeIds={selectedSchoolIds}
                  />
                </div>

                {/* Number of Teacher */}
                <div className="flex-1 relative w-full">
                  <Label>Number of Teacher</Label>
                  <Input
                    type="number"
                    step={1}
                    min={1}
                    max={100}
                    placeholder="00"
                    value={numberOfTeacher}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= 100) {
                        dispatch(setNumberOfTeacher(value));
                      } else {
                        dispatch(setNumberOfTeacher(100));
                        toast.error(
                          "The number of teachers cannot be more than 100!",
                        );
                      }
                    }}
                    required
                  />
                </div>
              </div>

              {/* Grade Section Mapping */}
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-1.5">
                  <Label>Grade Section Mapping</Label>
                  {filteredGradeOptions.length > 0 && (
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      {isAllSelected ? "Unselect All" : "Select All"}
                    </button>
                  )}
                </div>
                <Select<GradeOption, true>
                  isMulti
                  options={filteredGradeOptions}
                  className="basic-multi-select mt-2"
                  classNamePrefix="select"
                  getOptionLabel={(option) => option?.label}
                  getOptionValue={(option) => option?.id}
                  value={grades}
                  onChange={(selectedOptions) =>
                    handleGradeChange(mapping?.id, (selectedOptions as GradeOption[]) || [])
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
            type="button"
            variant="outline"
            onClick={() => closeRef.current?.click()}
            className="px-6 border-[#636F85] text-[#636F85] font-medium"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={isButtonDisabled}
            className={`px-6 text-white font-medium transition-all ease-in-out duration-500 cursor-pointer ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 border border-[#1E3A8A]"}`}
          >
            {isCreating ? (
              <div className="flex justify-center items-center gap-2">
                Creating...
                <div className="animate-spin">
                  <PiSpinner className="h-4 w-4" />
                </div>
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

export default CreateTeacherModal;
