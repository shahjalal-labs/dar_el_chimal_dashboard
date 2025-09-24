"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination = ({ totalPage, setCurrentPage, currentPage }: PaginationProps) => {
  return (
    <div className="flex justify-end items-center">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 bg-[#FF6B0033] text-[#FF6B00]"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {Array.from({ length: totalPage }, (_, i) => i + 1)
          .filter(
            (page) =>
              page === 1 ||
              page === totalPage ||
              (page >= currentPage - 1 && page <= currentPage + 1)
          )
          .map((page, index, array) => (
            <React.Fragment key={index}>
              {index > 0 && array[index - 1] !== page - 1 && (
                <span key={`ellipsis-${page}`} className="px-2">
                  ...
                </span>
              )}
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="icon"
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-md hover:bg-[#FF6B0033] hover:text-[#FF6B00] ${currentPage === page
                  ? "bg-[#FF6B00] text-white"
                  : ""
                  }`}
              >
                {page}
              </Button>
            </React.Fragment>
          ))}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))}
          disabled={currentPage === totalPage}
          className="h-8 w-8 bg-[#FF6B0033] text-[#FF6B00]"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;