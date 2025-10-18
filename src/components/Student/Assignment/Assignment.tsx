"use client";

import { Button } from "@/components/ui/button";
import { useGetStudentDetailsQuery } from "@/redux/api/student/overviewApi";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { AssignmentDetailView } from "./AssignmentDetailView";
import { AssignmentModal } from "./AssignmentModal";

interface Assignment {
  id: string;
  title: string;
  createdAt: string;
  dueDate?: string;
  status: "Pending" | "Submitted" | "Graded" | "Missed";
}

export default function Assignment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
   const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)

  const pathname = usePathname();
  const queryField = pathname.split("/").pop();

  const { data: getAssignment, refetch } = useGetStudentDetailsQuery(queryField);
  const assignmentData: Assignment[] = getAssignment?.result?.assignments ?? [];

  const ITEMS_PER_PAGE = 7;

  // ✅ Helper to format dates (safe even if null)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ Type-safe and working color mapping
  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "Pending":
        return "text-orange-500";
      case "Submitted":
        return "text-green-500";
      case "Graded":
        return "text-gray-500";
      case "Missed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusLabel = (status: Assignment["status"]) => status;

  // ✅ Filter safely
  const filteredAssignments = useMemo(() => {
    return assignmentData.filter((assignment) =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assignmentData, searchQuery]);

  const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAssignments = filteredAssignments.slice(startIndex, endIndex);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    const halfWindow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= halfWindow + 1) {
        for (let i = 1; i <= maxPagesToShow; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - halfWindow) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++)
          pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (
          let i = currentPage - halfWindow;
          i <= currentPage + halfWindow;
          i++
        )
          pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };


   const handleAssignmentClick = (assignments: Assignment) => {
    setSelectedAssignment(assignments)
    if (assignments.status === "Pending" || assignments.status === "Missed") {
      setShowModal(true)
    } else {
      setShowDetailView(true)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedAssignment(null)
  }

  const handleCloseDetailView = () => {
    setShowDetailView(false)
    setSelectedAssignment(null)
  }


  if (showDetailView && selectedAssignment) {
    return (
      <AssignmentDetailView
        assignments={{
          id: selectedAssignment.id,
          title: selectedAssignment.title,
          description: "Read this page and write a short summary of how photosynthesis works.",
          status: selectedAssignment.status as "Submitted" | "Graded",
          grade: selectedAssignment.status === "Graded" ? "B+" : undefined,
          feedback:
            selectedAssignment.status === "Graded"
              ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              : undefined,
          answer:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          attachmentName: "Photosynthesis Drawing.jpeg",
          attachmentUrl: "/photosynthesis-diagram.png",
        }}
        onBack={handleCloseDetailView}
      />
    )
  }

  return (
    <main className="bg-white rounded-2xl p-5">
      <div className="mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold text-gray-900">Assignment List</h1>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Assignment List */}
        <div className="space-y-4 mb-8">
          {currentAssignments.length > 0 ? (
            currentAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-[#F7F9FF] p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                  onClick={() => handleAssignmentClick(assignment)}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {assignment.title}
                  </h3>

                  <div className="text-sm text-gray-600">
                    <p>Assigned on: {formatDate(assignment.createdAt)}</p>
                    <p>Due date: {formatDate(assignment.dueDate)}</p>
                  </div>
                </div>

                <span
                  className={`ml-4 whitespace-nowrap font-medium ${getStatusColor(
                    assignment.status
                  )}`}
                >
                  {getStatusLabel(assignment.status)}
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-600">
                No assignments found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-10 w-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={page === "..."}
                className={`h-10 w-10 rounded-lg font-medium transition-colors ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : page === "..."
                    ? "cursor-default text-gray-600"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="h-10 w-10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>



       {selectedAssignment && (
        <AssignmentModal
          isOpen={showModal}
          onClose={handleCloseModal}
          refetch={refetch}
          assignments={{
            id: selectedAssignment.id,
            title: selectedAssignment.title,
            description: "Read this page and write a short summary of how photosynthesis works.",
            status: selectedAssignment.status as "Pending" | "Missed",
          }}
        />
      )}
    </main>
  );
}
