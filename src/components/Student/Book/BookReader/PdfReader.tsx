"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Undo, Edit, Underline, Search, Pen, MessageSquare, Copy, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface PdfReaderProps {
  bookId: string | number;
  pdfUrl: string;
  totalPages?: number;
}

function PdfReader({ bookId, pdfUrl, totalPages = 120 }: PdfReaderProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [selectedColor, setSelectedColor] = useState<string>("red");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(totalPages);
  const [pageRendering, setPageRendering] = useState(false);
  const canvasLeftRef = useRef<HTMLCanvasElement>(null);
  const canvasRightRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);

  // Load PDF.js library
  useEffect(() => {
    const loadPdfJs = async () => {
      if (typeof window !== 'undefined') {
        const pdfjsLib = await import('pdfjs-dist/build/pdf');
        const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

        try {
          const loadingTask = pdfjsLib.getDocument(pdfUrl);
          const pdf = await loadingTask.promise;
          pdfDocRef.current = pdf;
          setNumPages(pdf.numPages);
        } catch (error) {
          console.error('Error loading PDF:', error);
        }
      }
    };

    if (pdfUrl) {
      loadPdfJs();
    }
  }, [pdfUrl]);

  // Render PDF pages
  const renderPage = async (pageNum: number, canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (!pdfDocRef.current || !canvasRef.current || pageRendering) return;

    setPageRendering(true);
    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      const viewport = page.getViewport({ scale: (zoom / 100) * 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
    } finally {
      setPageRendering(false);
    }
  };

  // Render pages when current page or zoom changes
  useEffect(() => {
    if (pdfDocRef.current) {
      const leftPage = currentPage;
      const rightPage = currentPage + 1;

      if (leftPage <= numPages) {
        renderPage(leftPage, canvasLeftRef);
      }
      if (rightPage <= numPages) {
        renderPage(rightPage, canvasRightRef);
      }
    }
  }, [currentPage, zoom, numPages]);

  // Handle page navigation with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevPage();
      } else if (e.key === "ArrowRight") {
        handleNextPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, numPages]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => Math.max(1, prev - 2));
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages - 1) {
      setCurrentPage(prev => Math.min(numPages - 1, prev + 2));
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 10));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(50, prev - 10));
  };

  const colors = [
    { name: "red", class: "bg-red-400", hex: "#f87171" },
    { name: "green", class: "bg-green-400", hex: "#4ade80" },
    { name: "blue", class: "bg-blue-400", hex: "#60a5fa" },
    { name: "purple", class: "bg-purple-400", hex: "#c084fc" },
  ];

  const handleToolClick = (tool: string) => {
    setSelectedTool(prev => prev === tool ? null : tool);
  };

  const leftPage = currentPage;
  const rightPage = currentPage + 1;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-auto">
        {/* Left Arrow */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10
            ${currentPage <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 hover:shadow-xl cursor-pointer'}`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Book Pages Container */}
        <div className="flex gap-8 max-w-7xl">
          {/* Left Page */}
          <div 
            className="bg-white shadow-2xl rounded-lg overflow-hidden flex items-center justify-center"
            style={{ minWidth: "450px", minHeight: "600px" }}
          >
            <canvas 
              ref={canvasLeftRef}
              className="max-w-full max-h-full"
            />
          </div>

          {/* Right Page */}
          {rightPage <= numPages && (
            <div 
              className="bg-white shadow-2xl rounded-lg overflow-hidden flex items-center justify-center"
              style={{ minWidth: "450px", minHeight: "600px" }}
            >
              <canvas 
                ref={canvasRightRef}
                className="max-w-full max-h-full"
              />
            </div>
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= numPages - 1}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10
            ${currentPage >= numPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 hover:shadow-xl cursor-pointer'}`}
          aria-label="Next page"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Bottom Toolbar */}
      <div className="bg-white border-t py-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Section - Color Palette */}
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-8 h-8 rounded-full ${color.class} ${
                  selectedColor === color.name
                    ? "ring-2 ring-offset-2 ring-gray-400"
                    : ""
                } transition-all hover:scale-110`}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>

          {/* Center Section - Tools */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handleToolClick("undo")}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === "undo" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Undo"
            >
              <Undo className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => handleToolClick("edit")}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === "edit" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Edit"
            >
              <Edit className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => handleToolClick("underline")}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === "underline" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Underline"
            >
              <Underline className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => handleToolClick("search")}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === "search" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => handleToolClick("pen")}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === "pen" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Pen"
            >
              <Pen className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => handleToolClick("comment")}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === "comment" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Comment"
            >
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => handleToolClick("copy")}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === "copy" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Copy"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => handleToolClick("bookmark")}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === "bookmark" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Bookmark"
            >
              <Bookmark className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Right Section - Zoom Controls */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600 font-medium min-w-[60px] text-center">
              {zoom}%
            </span>
            <button 
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Page Counter */}
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600 font-medium">
            {currentPage} / {numPages}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PdfReader;