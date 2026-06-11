"use client";

import React, { useRef, useState } from 'react';
import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { setActiveBookTab } from '@/redux/features/uiSlice';
import { RootState } from '@/redux/store/store';
import { MdOutlineDataset } from 'react-icons/md';
import { RiGraduationCapLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { SyncLoader } from 'react-spinners';
import { useAssignBooksMutation, useGetSingleSchoolQuery, useNotAssignedBooksQuery } from '@/redux/api/school';
import General from './AddNewSchool/General';
import UpdateGradeSection from './UpdateGradeSection';
import { IoBookOutline } from 'react-icons/io5';

const UpdateSchoolModal = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
  const closeRef = useRef(null);
  const tab = useSelector((state: RootState) => state.ui.activeBookTab);

  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [assignSuccess, setAssignSuccess] = useState(false);

  const { data, isLoading } = useGetSingleSchoolQuery({ id });
  const { data: notAssigned } = useNotAssignedBooksQuery(id);
  const [assignBooks, { isLoading: isAssigning }] = useAssignBooksMutation();

  const books: { id: string; bookName: string }[] = notAssigned?.result ?? [];

  const allSelected = books.length > 0 && selectedBookIds.length === books.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedBookIds([]);
    } else {
      setSelectedBookIds(books.map((b) => b.id));
    }
  };

  const handleToggleBook = (bookId: string) => {
    setSelectedBookIds((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const handleAssignBooks = async () => {
    if (selectedBookIds.length === 0) return;
    const payload = { schoolId: id, bookIds: selectedBookIds };
    const response = await assignBooks(payload);
    if ('data' in response) {
      setAssignSuccess(true);
      setSelectedBookIds([]);
      setTimeout(() => setAssignSuccess(false), 3000);
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
    <DialogContent className="overflow-y-auto overflow-x-hidden max-h-[75%] max-w-[90%] p-6" showCloseButton>
      <DialogClose ref={closeRef} className="hidden" />
      <h1 className="font-bold text-2xl mt-4">Edit School - {data?.result?.name}</h1>

      <div className="bg-white rounded-xl">
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex gap-2 border-b border-gray-200 pb-2 mb-4">
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

          <TabsContent value="assign">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Unassigned Books</h2>
                {selectedBookIds.length > 0 && (
                  <span className="text-sm text-[#1E3A8A] font-medium">
                    {selectedBookIds.length} book{selectedBookIds.length > 1 ? 's' : ''} selected
                  </span>
                )}
              </div>

              {books.length === 0 ? (
                <p className="text-gray-500 text-sm py-6 text-center">All books have already been assigned to this school.</p>
              ) : (
                <>
                  {/* Select All */}
                  <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 accent-[#1E3A8A]"
                    />
                    <span className="text-sm font-semibold text-gray-700">Select All</span>
                  </label>

                  {/* Book List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {books.map((book) => (
                      <label
                        key={book.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition ${
                          selectedBookIds.includes(book.id)
                            ? 'border-[#1E3A8A] bg-blue-50'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedBookIds.includes(book.id)}
                          onChange={() => handleToggleBook(book.id)}
                          className="w-4 h-4 accent-[#1E3A8A]"
                        />
                        <IoBookOutline className="text-[#1E3A8A] text-base flex-shrink-0" />
                        <span className="text-sm text-gray-800">{book.bookName}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {/* Success message */}
              {assignSuccess && (
                <p className="text-sm text-green-600 font-medium">✓ Books assigned successfully!</p>
              )}

              {/* Assign Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleAssignBooks}
                  disabled={selectedBookIds.length === 0 || isAssigning}
                  className="px-6 py-2 rounded-lg bg-[#1E3A8A] text-white text-sm font-medium hover:bg-[#1a3278] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAssigning ? (
                    <>
                      <SyncLoader color="#fff" size={6} />
                      Assigning...
                    </>
                  ) : (
                    'Assign Books'
                  )}
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );
};

export default UpdateSchoolModal;