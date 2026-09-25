/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useRef, useState } from 'react';
import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { setActiveBookTab } from '@/redux/features/uiSlice';
import { RootState } from '@/redux/store/store';
import { MdOutlineDataset } from 'react-icons/md';
import { RiGraduationCapLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { SyncLoader } from 'react-spinners';
import {
  useAssignBooksMutation,
  useAssignedBooksQuery,
  useGetSingleSchoolQuery,
  useNotAssignedBooksQuery,
  useUnassignBooksMutation,
} from '@/redux/api/school';
import General from './AddNewSchool/General';
import UpdateGradeSection from './UpdateGradeSection';
import {
  IoBookOutline,
  IoCheckmarkCircleOutline,
  IoSearchOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { toast } from 'sonner';
import { PiSpinner } from 'react-icons/pi';
import { compareBookTitlesNaturally } from '@/lib/bookSortUtils';

interface BookItem {
  id: string;
  bookName: string;
  coverImg?: string | null;
  author?: string | null;
  categoryName?: string | null;
  grades?: string[];
}

const sortBooks = <T extends { bookName?: string | null }>(bookList: T[]): T[] => {
  return [...bookList].sort((a, b) => {
    return compareBookTitlesNaturally(a.bookName, b.bookName);
  });
};

const UpdateSchoolModal = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
  const closeRef = useRef(null);
  const tab = useSelector((state: RootState) => state.ui.activeBookTab);

  // Sub-tab: 'unassigned' vs 'assigned'
  const [bookSubTab, setBookSubTab] = useState<'unassigned' | 'assigned'>('unassigned');
  const [unassignedSearch, setUnassignedSearch] = useState('');
  const [assignedSearch, setAssignedSearch] = useState('');
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [unassigningBookId, setUnassigningBookId] = useState<string | null>(null);

  const { data, isLoading } = useGetSingleSchoolQuery({ id });
  const { data: notAssigned, isLoading: isLoadingUnassigned } = useNotAssignedBooksQuery(id);
  const { data: assignedData, isLoading: isLoadingAssigned } = useAssignedBooksQuery(id);
  const [assignBooks, { isLoading: isAssigning }] = useAssignBooksMutation();
  const [unassignBooks] = useUnassignBooksMutation();
  const unassignedBooks = useMemo(
    () => sortBooks<BookItem>(notAssigned?.result ?? []),
    [notAssigned?.result]
  );
  const assignedBooks = useMemo(
    () => sortBooks<BookItem>(assignedData?.result ?? []),
    [assignedData?.result]
  );

  // Filter unassigned books by search term
  const filteredUnassignedBooks = useMemo(() => {
    if (!unassignedSearch.trim()) return unassignedBooks;
    const q = unassignedSearch.toLowerCase();
    return unassignedBooks.filter(
      (b) =>
        b.bookName?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.categoryName?.toLowerCase().includes(q) ||
        b.grades?.some((g) => g.toLowerCase().includes(q))
    );
  }, [unassignedBooks, unassignedSearch]);

  // Filter assigned books by search term
  const filteredAssignedBooks = useMemo(() => {
    if (!assignedSearch.trim()) return assignedBooks;
    const q = assignedSearch.toLowerCase();
    return assignedBooks.filter(
      (b) =>
        b.bookName?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.categoryName?.toLowerCase().includes(q) ||
        b.grades?.some((g) => g.toLowerCase().includes(q))
    );
  }, [assignedBooks, assignedSearch]);

  // "Select All" status for currently filtered unassigned books
  const allFilteredSelected =
    filteredUnassignedBooks.length > 0 &&
    filteredUnassignedBooks.every((b) => selectedBookIds.includes(b.id));

  const handleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredUnassignedBooks.map((b) => b.id));
      setSelectedBookIds((prev) => prev.filter((bookId) => !filteredIds.has(bookId)));
    } else {
      const newIds = filteredUnassignedBooks.map((b) => b.id);
      setSelectedBookIds((prev) => Array.from(new Set([...prev, ...newIds])));
    }
  };

  const handleToggleBook = (bookId: string) => {
    setSelectedBookIds((prev) =>
      prev.includes(bookId) ? prev.filter((item) => item !== bookId) : [...prev, bookId]
    );
  };

  const handleAssignBooks = async () => {
    if (selectedBookIds.length === 0) return;
    const payload = { schoolId: id, bookIds: selectedBookIds };
    try {
      const response: any = await assignBooks(payload).unwrap();
      if (response.success || response.statusCode === 200) {
        toast.success(response.message || "Books assigned successfully!");
        setSelectedBookIds([]);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to assign books");
    }
  };

  const handleUnassignBook = async (bookId: string, bookName: string) => {
    setUnassigningBookId(bookId);
    try {
      const response: any = await unassignBooks({ schoolId: id, bookIds: [bookId] }).unwrap();
      if (response.success || response.statusCode === 200) {
        toast.success(`"${bookName}" unassigned successfully`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to unassign book");
    } finally {
      setUnassigningBookId(null);
    }
  };

  const handleTabChange = (value: string) => {
    dispatch(setActiveBookTab(value as 'general' | 'resources' | 'grade' | 'assign'));
  };

  if (isLoading) {
    return (
      <DialogContent className="p-10" showCloseButton>
        <div className="flex justify-center items-center gap-4">
          <span className="text-[#1E3A8A]">Data is Loading</span>
          <SyncLoader color="#1E3A8A" />
        </div>
      </DialogContent>
    );
  }

  if (!data?.result) {
    return (
      <DialogContent className="p-10" showCloseButton>
        <p className="text-center text-gray-700">No data found!</p>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="overflow-y-auto overflow-x-hidden max-h-[85vh] w-[95%] sm:max-w-2xl md:max-w-3xl p-6" showCloseButton>
      <DialogClose ref={closeRef} className="hidden" />
      <h1 className="font-bold text-2xl mt-4">Edit School - {data?.result?.name}</h1>

      <div className="bg-white rounded-xl min-w-0 w-full">
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full min-w-0">
          <TabsList className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 mb-4">
            <TabsTrigger
              value="general"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                tab === 'general' ? 'bg-[#F8F8F8] text-[#1E3A8A]' : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <MdOutlineDataset /> General
            </TabsTrigger>

            <TabsTrigger
              value="grade"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                tab === 'grade' ? 'bg-[#F8F8F8] text-[#1E3A8A]' : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <RiGraduationCapLine /> Grade Mapping
            </TabsTrigger>

            <TabsTrigger
              value="assign"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                tab === 'assign' ? 'bg-[#F8F8F8] text-[#1E3A8A]' : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <IoBookOutline /> Assign Books
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <General id={id} />
          </TabsContent>

          <TabsContent value="grade">
            <UpdateGradeSection id={id} />
          </TabsContent>

          <TabsContent value="assign" className="min-w-0 w-full">
            <div className="space-y-4 min-w-0 w-full">
              {/* Sub-navigation tabs: Unassigned vs Already Assigned */}
              <div className="flex border-b border-gray-200 gap-4 overflow-x-auto min-w-0 pb-1">
                <button
                  type="button"
                  onClick={() => setBookSubTab('unassigned')}
                  className={`pb-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                    bookSubTab === 'unassigned'
                      ? 'border-[#1E3A8A] text-[#1E3A8A]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IoBookOutline className="text-base" /> Unassigned Books
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-[#1E3A8A] font-semibold">
                    {unassignedBooks.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookSubTab('assigned')}
                  className={`pb-2 text-sm font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                    bookSubTab === 'assigned'
                      ? 'border-[#1E3A8A] text-[#1E3A8A]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IoCheckmarkCircleOutline className="text-base" /> Already Assigned Books
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                    {assignedBooks.length}
                  </span>
                </button>
              </div>

              {/* TAB 1: UNASSIGNED BOOKS */}
              {bookSubTab === 'unassigned' && (
                <div className="space-y-3 min-w-0 w-full">
                  {/* Search Bar */}
                  <div className="relative">
                    <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="text"
                      placeholder="Search unassigned books by title, grade, category, or author..."
                      value={unassignedSearch}
                      onChange={(e) => setUnassignedSearch(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1E3A8A] transition"
                    />
                    {unassignedSearch && (
                      <button
                        type="button"
                        onClick={() => setUnassignedSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {isLoadingUnassigned ? (
                    <div className="py-8 text-center text-gray-500 text-sm">
                      <PiSpinner className="animate-spin h-5 w-5 mx-auto mb-2 text-[#1E3A8A]" />
                      Loading unassigned books...
                    </div>
                  ) : unassignedBooks.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      All books have already been assigned to this school.
                    </p>
                  ) : (
                    <>
                      {/* Header with Select All & Selected Count */}
                      <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700 select-none">
                          <input
                            type="checkbox"
                            checked={allFilteredSelected}
                            onChange={handleSelectAll}
                            className="w-4 h-4 accent-[#1E3A8A] rounded cursor-pointer"
                          />
                          <span>
                            Select All {unassignedSearch ? `(${filteredUnassignedBooks.length} found)` : ''}
                          </span>
                        </label>

                        {selectedBookIds.length > 0 && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-[#1E3A8A]">
                            {selectedBookIds.length} book{selectedBookIds.length > 1 ? 's' : ''} selected
                          </span>
                        )}
                      </div>

                      {/* Books List */}
                      {filteredUnassignedBooks.length === 0 ? (
                        <p className="text-gray-500 text-sm py-6 text-center">
                          No unassigned books found matching &quot;{unassignedSearch}&quot;.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                          {filteredUnassignedBooks.map((book) => {
                            const isSelected = selectedBookIds.includes(book.id);
                            return (
                              <label
                                key={book.id}
                                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border cursor-pointer transition select-none ${
                                  isSelected
                                    ? 'border-[#1E3A8A] bg-blue-50/70 shadow-sm'
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleBook(book.id)}
                                    className="w-4 h-4 accent-[#1E3A8A] rounded cursor-pointer flex-shrink-0"
                                  />
                                  <IoBookOutline className="text-[#1E3A8A] text-lg flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{book.bookName}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                      {book.grades && book.grades.length > 0 && (
                                        <div className="flex items-center gap-1 flex-wrap">
                                          <span className="text-[11px] text-gray-400">Grade:</span>
                                          {book.grades.map((gr) => (
                                            <span
                                              key={gr}
                                              className="text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-[#1E3A8A] font-semibold border border-blue-200"
                                            >
                                              {gr}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      {book.categoryName && (
                                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                                          {book.categoryName}
                                        </span>
                                      )}
                                      {book.author && (
                                        <span className="text-xs text-gray-500 truncate">Author: {book.author}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Assign Button */}
                      <div className="flex justify-end pt-3 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={handleAssignBooks}
                          disabled={selectedBookIds.length === 0 || isAssigning}
                          className="px-6 py-2.5 rounded-lg bg-[#1E3A8A] text-white text-sm font-medium hover:bg-[#1a3278] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                          {isAssigning ? (
                            <>
                              <PiSpinner className="animate-spin h-4 w-4" />
                              Assigning...
                            </>
                          ) : (
                            `Assign ${selectedBookIds.length > 0 ? `(${selectedBookIds.length}) ` : ''}Books`
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 2: ALREADY ASSIGNED BOOKS */}
              {bookSubTab === 'assigned' && (
                <div className="space-y-3 min-w-0 w-full">
                  {/* Search Bar */}
                  <div className="relative">
                    <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="text"
                      placeholder="Search already assigned books by title, grade, category, or author..."
                      value={assignedSearch}
                      onChange={(e) => setAssignedSearch(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1E3A8A] transition"
                    />
                    {assignedSearch && (
                      <button
                        type="button"
                        onClick={() => setAssignedSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {isLoadingAssigned ? (
                    <div className="py-8 text-center text-gray-500 text-sm">
                      <PiSpinner className="animate-spin h-5 w-5 mx-auto mb-2 text-[#1E3A8A]" />
                      Loading assigned books...
                    </div>
                  ) : assignedBooks.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      No books have been assigned to this school yet.
                    </p>
                  ) : filteredAssignedBooks.length === 0 ? (
                    <p className="text-gray-500 text-sm py-6 text-center">
                      No assigned books found matching &quot;{assignedSearch}&quot;.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                      {filteredAssignedBooks.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <IoCheckmarkCircleOutline className="text-green-600 text-lg flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">{book.bookName}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {book.grades && book.grades.length > 0 && (
                                  <div className="flex items-center gap-1 flex-wrap">
                                    <span className="text-[11px] text-gray-400">Grades:</span>
                                    {book.grades.map((gr) => (
                                      <span
                                        key={gr}
                                        className="text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-[#1E3A8A] font-medium border border-blue-100"
                                      >
                                        {gr}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {book.categoryName && (
                                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                                    {book.categoryName}
                                  </span>
                                )}
                                {book.author && (
                                  <span className="text-xs text-gray-500">Author: {book.author}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUnassignBook(book.id, book.bookName)}
                            disabled={unassigningBookId === book.id}
                            className="text-xs px-2.5 py-1.5 rounded text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200 flex items-center gap-1 cursor-pointer disabled:opacity-50 flex-shrink-0"
                            title="Unassign book from this school"
                          >
                            {unassigningBookId === book.id ? (
                              <PiSpinner className="animate-spin h-3.5 w-3.5" />
                            ) : (
                              <IoTrashOutline className="text-sm" />
                            )}
                            <span>Unassign</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );
};

export default UpdateSchoolModal;