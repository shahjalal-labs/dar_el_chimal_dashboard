/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  MessageSquare,
  Pen,
  Search,
  Underline,
  Undo,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

// PDF.js types
interface PDFPageProxy {
  getViewport: (options: { scale: number }) => PDFPageViewport;
  render: (renderContext: any) => { promise: Promise<void> };
}

interface PDFPageViewport {
  width: number;
  height: number;
}

interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
}

// Component props interface
interface PdfReaderProps {
  bookId: string | number;
  pdfUrl: string;
  totalPages?: number;
}

// Highlight and annotation interfaces
interface Highlight {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: "highlight" | "underline";
}

interface HistoryState {
  highlights: { [key: number]: Highlight[] };
  underlines: { [key: number]: Highlight[] };
}

// Tool types
type ToolType = "pen" | "underline" | "edit" | "comment" | "copy" | "bookmark" | "search" | null;

// Color type
type ColorName = "red" | "green" | "blue" | "purple";

function PdfReader({ pdfUrl, totalPages = 120 }: PdfReaderProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [selectedColor, setSelectedColor] = useState<ColorName>("red");
  const [selectedTool, setSelectedTool] = useState<ToolType>(null);
  const [numPages, setNumPages] = useState<number>(totalPages);
  const [pageRendering, setPageRendering] = useState<boolean>(false);
  const canvasLeftRef = useRef<HTMLCanvasElement>(null);
  const canvasRightRef = useRef<HTMLCanvasElement>(null);
  const overlayLeftRef = useRef<HTMLCanvasElement>(null);
  const overlayRightRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const [highlights, setHighlights] = useState<{ [key: number]: Highlight[] }>(
    {}
  );
  const [underlines, setUnderlines] = useState<{ [key: number]: Highlight[] }>(
    {}
  );
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{
    [key: number]: Highlight[];
  }>({});
  const [copiedText, setCopiedText] = useState<string>("");

  const addToHistory = useCallback((
    newHighlights: { [key: number]: Highlight[] },
    newUnderlines: { [key: number]: Highlight[] }
  ) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ highlights: newHighlights, underlines: newUnderlines });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Load PDF.js library
  useEffect(() => {
    const loadPdfJs = async (): Promise<void> => {
      if (typeof window !== "undefined") {
        try {
          // Use dynamic imports with proper typing
          const pdfjsLib = await import("pdfjs-dist/build/pdf");
          const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
          
          // Set worker source
          (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

          const loadingTask = (pdfjsLib as any).getDocument(pdfUrl);
          const pdf: PDFDocumentProxy = await loadingTask.promise;
          pdfDocRef.current = pdf;
          setNumPages(pdf.numPages);
        } catch (error) {
          console.error("Error loading PDF:", error);
        }
      }
    };

    if (pdfUrl) {
      loadPdfJs();
    }
  }, [pdfUrl]);

  // Render PDF pages
  const renderPage = useCallback(async (
    pageNum: number,
    canvasRef: React.RefObject<HTMLCanvasElement | null>
  ): Promise<void> => {
    if (!pdfDocRef.current || !canvasRef.current || pageRendering) return;

    setPageRendering(true);
    try {
      const page: PDFPageProxy = await pdfDocRef.current.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      const viewport: PDFPageViewport = page.getViewport({ scale: (zoom / 100) * 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error("Error rendering page:", error);
    } finally {
      setPageRendering(false);
    }
  }, [zoom, pageRendering]);

  const drawHighlights = useCallback((
    pageNum: number,
    overlayRef: React.RefObject<HTMLCanvasElement | null>
  ): void => {
    if (!overlayRef.current) return;

    const canvas = overlayRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const pageHighlights = highlights[pageNum] || [];
    pageHighlights.forEach((highlight) => {
      const colorMap: Record<ColorName | string, string> = {
        red: "rgba(248, 113, 113, 0.3)",
        green: "rgba(74, 222, 128, 0.3)",
        blue: "rgba(96, 165, 250, 0.3)",
        purple: "rgba(192, 132, 252, 0.3)",
      };

      context.fillStyle = colorMap[highlight.color] || colorMap.red;
      context.fillRect(
        highlight.x,
        highlight.y,
        highlight.width,
        highlight.height
      );
    });

    const pageUnderlines = underlines[pageNum] || [];
    pageUnderlines.forEach((underline) => {
      const colorMap: Record<ColorName | string, string> = {
        red: "rgb(248, 113, 113)",
        green: "rgb(74, 222, 128)",
        blue: "rgb(96, 165, 250)",
        purple: "rgb(192, 132, 252)",
      };

      context.strokeStyle = colorMap[underline.color] || colorMap.red;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(underline.x, underline.y + underline.height);
      context.lineTo(
        underline.x + underline.width,
        underline.y + underline.height
      );
      context.stroke();
    });

    Object.values(searchResults).forEach((results) => {
      results.forEach((result) => {
        context.fillStyle = "rgba(255, 255, 0, 0.4)";
        context.fillRect(result.x, result.y, result.width, result.height);
      });
    });
  }, [highlights, underlines, searchResults]);

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
  }, [currentPage, zoom, numPages, renderPage]);

  useEffect(() => {
    drawHighlights(currentPage, overlayLeftRef);
    drawHighlights(currentPage + 1, overlayRightRef);
  }, [highlights, underlines, currentPage, searchResults, drawHighlights]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (
      !selectedTool ||
      (selectedTool !== "pen" && selectedTool !== "underline")
    )
      return;

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsSelecting(true);
    setSelectionStart({ x, y });
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement>,
    pageNum: number
  ): void => {
    if (!isSelecting || !selectionStart || !selectedTool) return;

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const overlayCanvas =
      pageNum === currentPage
        ? overlayLeftRef.current
        : overlayRightRef.current;
    if (!overlayCanvas) return;

    const context = overlayCanvas.getContext("2d");
    if (!context) return;

    drawHighlights(
      pageNum,
      pageNum === currentPage ? overlayLeftRef : overlayRightRef
    );

    const colorMap: Record<ColorName | string, string> = {
      red: "rgba(248, 113, 113, 0.3)",
      green: "rgba(74, 222, 128, 0.3)",
      blue: "rgba(96, 165, 250, 0.3)",
      purple: "rgba(192, 132, 252, 0.3)",
    };

    const width = Math.abs(x - selectionStart.x);
    const height = Math.abs(y - selectionStart.y);
    const startX = Math.min(x, selectionStart.x);
    const startY = Math.min(y, selectionStart.y);

    if (selectedTool === "pen") {
      context.fillStyle = colorMap[selectedColor] || colorMap.red;
      context.fillRect(startX, startY, width, height);
    } else if (selectedTool === "underline") {
      context.strokeStyle = colorMap[selectedColor] || colorMap.red;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(startX, startY + height);
      context.lineTo(startX + width, startY + height);
      context.stroke();
    }
  };

  const handleMouseUp = (
    e: React.MouseEvent<HTMLCanvasElement>,
    pageNum: number
  ): void => {
    if (!isSelecting || !selectionStart || !selectedTool) {
      setIsSelecting(false);
      return;
    }

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = Math.abs(x - selectionStart.x);
    const height = Math.abs(y - selectionStart.y);

    if (width > 5 && height > 5) {
      const startX = Math.min(x, selectionStart.x);
      const startY = Math.min(y, selectionStart.y);

      if (selectedTool === "pen") {
        const newHighlights = {
          ...highlights,
          [pageNum]: [
            ...(highlights[pageNum] || []),
            {
              x: startX,
              y: startY,
              width,
              height,
              color: selectedColor,
              type: "highlight" as const,
            },
          ],
        };
        setHighlights(newHighlights);
        addToHistory(newHighlights, underlines);
      } else if (selectedTool === "underline") {
        const newUnderlines = {
          ...underlines,
          [pageNum]: [
            ...(underlines[pageNum] || []),
            {
              x: startX,
              y: startY,
              width,
              height,
              color: selectedColor,
              type: "underline" as const,
            },
          ],
        };
        setUnderlines(newUnderlines);
        addToHistory(highlights, newUnderlines);
      }
    }

    setIsSelecting(false);
    setSelectionStart(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "ArrowLeft") {
        handlePrevPage();
      } else if (e.key === "ArrowRight") {
        handleNextPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, numPages]);

  const handlePrevPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage((prev) => Math.max(1, prev - 2));
    }
  };

  const handleNextPage = (): void => {
    if (currentPage < numPages - 1) {
      setCurrentPage((prev) => Math.min(numPages - 1, prev + 2));
    }
  };

  const handleZoomIn = (): void => {
    setZoom((prev) => Math.min(200, prev + 10));
  };

  const handleZoomOut = (): void => {
    setZoom((prev) => Math.max(50, prev - 10));
  };

  const handleUndo = (): void => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setHighlights(state.highlights);
      setUnderlines(state.underlines);
      setHistoryIndex(newIndex);
    }
  };

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults({});
      return;
    }

    const results: { [key: number]: Highlight[] } = {};
    // Simulate search results - in a real app, you'd extract text from PDF
    // For now, we'll create dummy search highlights
    for (let page = 1; page <= numPages; page++) {
      results[page] = [
        {
          x: 50,
          y: 100 + Math.random() * 300,
          width: 150,
          height: 20,
          color: "yellow",
          type: "highlight",
        },
      ];
    }
    setSearchResults(results);
  };

  const handleCopy = (): void => {
    if (selectedTool === "copy") {
      const text = "Selected text from PDF";
      navigator.clipboard.writeText(text).catch(err => {
        console.error("Failed to copy text: ", err);
      });
      setCopiedText("Copied!");
      setTimeout(() => setCopiedText(""), 2000);
    }
  };

  const colors: Array<{ name: ColorName; class: string; hex: string }> = [
    { name: "red", class: "bg-red-400", hex: "#f87171" },
    { name: "green", class: "bg-green-400", hex: "#4ade80" },
    { name: "blue", class: "bg-blue-400", hex: "#60a5fa" },
    { name: "purple", class: "bg-purple-400", hex: "#c084fc" },
  ];

  const handleToolClick = (tool: ToolType): void => {
    if (tool === "search") {
      setShowSearchBar(!showSearchBar);
      setSelectedTool(null);
    } else if (tool === "copy") {
      handleCopy();
    } else {
      setSelectedTool((prev) => (prev === tool ? null : tool));
    }
  };

  const leftPage = currentPage;
  const rightPage = currentPage + 1;

  return (
    <div className=" flex flex-col">
      {/* Header */}
      <div className=" px-4 py-3 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </Button>
      </div>

      {/* Search Bar */}
      {showSearchBar && (
        <div className="bg-white border-b px-8 py-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search in PDF..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={() => {
              setShowSearchBar(false);
              setSearchQuery("");
              setSearchResults({});
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-auto">
        {/* Left Arrow */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10
            ${
              currentPage <= 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl cursor-pointer"
            }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Book Pages Container */}
        <div className="flex gap-8 max-w-7xl">
          {/* Left Page */}
          <div
            className="bg-white shadow-2xl rounded-lg overflow-hidden flex items-center justify-center relative"
            style={{ minWidth: "450px", minHeight: "600px" }}
          >
            <canvas ref={canvasLeftRef} className="max-w-full max-h-full" />
            <canvas
              ref={overlayLeftRef}
              className="absolute top-0 left-0 cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={(e) => handleMouseMove(e, leftPage)}
              onMouseUp={(e) => handleMouseUp(e, leftPage)}
              onMouseLeave={() => {
                setIsSelecting(false);
                setSelectionStart(null);
              }}
              style={{
                display:
                  selectedTool === "pen" || selectedTool === "underline"
                    ? "block"
                    : "none",
              }}
            />
          </div>

          {/* Right Page */}
          {rightPage <= numPages && (
            <div
              className="bg-white shadow-2xl rounded-lg overflow-hidden flex items-center justify-center relative"
              style={{ minWidth: "450px", minHeight: "600px" }}
            >
              <canvas ref={canvasRightRef} className="max-w-full max-h-full" />
              <canvas
                ref={overlayRightRef}
                className="absolute top-0 left-0 cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={(e) => handleMouseMove(e, rightPage)}
                onMouseUp={(e) => handleMouseUp(e, rightPage)}
                onMouseLeave={() => {
                  setIsSelecting(false);
                  setSelectionStart(null);
                }}
                style={{
                  display:
                    selectedTool === "pen" || selectedTool === "underline"
                      ? "block"
                      : "none",
                }}
              />
            </div>
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= numPages - 1}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10
            ${
              currentPage >= numPages - 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl cursor-pointer"
            }`}
          aria-label="Next page"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Bottom Toolbar */}
      <div className=" py-4 px-8">
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
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-2 rounded-lg transition-colors ${
                historyIndex <= 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              aria-label="Undo"
              title="Undo last action"
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
                selectedTool === "underline"
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
              aria-label="Underline"
              title="Click to enable underline mode"
            >
              <Underline className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleToolClick("search")}
              className={`p-2 rounded-lg transition-colors ${
                showSearchBar ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Search"
              title="Search in PDF"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleToolClick("pen")}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === "pen" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Highlight"
              title="Click to enable highlighting mode"
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
                copiedText ? "bg-green-100" : "hover:bg-gray-100"
              }`}
              aria-label="Copy"
              title="Copy selected text"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleToolClick("bookmark")}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === "bookmark"
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
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

        {/* Copy Feedback */}
        {copiedText && (
          <div className="text-center mt-2 text-sm text-green-600 font-medium">
            {copiedText}
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfReader;