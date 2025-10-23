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
  MessageSquare,
  Search,
  Underline,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiHighlight } from "react-icons/bi";
import { LuUndo2 } from "react-icons/lu";
import { PiEraser } from "react-icons/pi";

// PDF.js types
interface PDFPageProxy {
  getViewport: (options: { scale: number }) => PDFPageViewport;
  render: (renderContext: any) => { promise: Promise<void> };
  getTextContent: () => Promise<PDFTextContent>;
}

interface PDFPageViewport {
  width: number;
  height: number;
}

interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
}

interface PDFTextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  dir: string;
  fontName: string;
  hasEOL: boolean;
}

interface PDFTextContent {
  items: PDFTextItem[];
  styles: { [key: string]: any };
}

// Component props interface
interface PdfReaderProps {
  bookId: string | number;
  pdfUrl: string;
  totalPages?: number;
}

// Highlight and annotation interfaces
interface Highlight {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: "highlight" | "underline" | "comment" | "bookmark";
  text?: string;
  comment?: string;
  bookmarkName?: string;
}

interface HistoryState {
  highlights: { [key: number]: Highlight[] };
  underlines: { [key: number]: Highlight[] };
  comments: { [key: number]: Highlight[] };
  bookmarks: { [key: number]: Highlight[] };
}

// Tool types
type ToolType =
  | "pen"
  | "underline"
  | "eraser"
  | "comment"
  | "copy"
  | "bookmark"
  | "search"
  | null;

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  const [comments, setComments] = useState<{ [key: number]: Highlight[] }>({});
  const [bookmarks, setBookmarks] = useState<{ [key: number]: Highlight[] }>(
    {}
  );
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
    page: number;
  } | null>(null);
  const [currentSelection, setCurrentSelection] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
    text?: string;
  } | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{
    [key: number]: Highlight[];
  }>({});
  const [copiedText, setCopiedText] = useState<string>("");
  const [showCommentPopup, setShowCommentPopup] = useState<boolean>(false);
  const [showBookmarkPopup, setShowBookmarkPopup] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");
  const [bookmarkName, setBookmarkName] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right" | null>(
    null
  );

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("pdf-bookmarks");
    if (savedBookmarks) {
      try {
        const parsedBookmarks = JSON.parse(savedBookmarks);
        setBookmarks(parsedBookmarks);
      } catch (error) {
        console.error("Error loading bookmarks from localStorage:", error);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pdf-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Initialize history
  useEffect(() => {
    addToHistory(highlights, underlines, comments, bookmarks);
  }, []);

  const addToHistory = useCallback(
    (
      newHighlights: { [key: number]: Highlight[] },
      newUnderlines: { [key: number]: Highlight[] },
      newComments: { [key: number]: Highlight[] },
      newBookmarks: { [key: number]: Highlight[] }
    ) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({
        highlights: JSON.parse(JSON.stringify(newHighlights)),
        underlines: JSON.parse(JSON.stringify(newUnderlines)),
        comments: JSON.parse(JSON.stringify(newComments)),
        bookmarks: JSON.parse(JSON.stringify(newBookmarks)),
      });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  // Extract text from PDF selection
  const extractTextFromSelection = async (
    pageNum: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<string> => {
    if (!pdfDocRef.current) return "";

    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });

      // Get the current canvas dimensions
      const currentCanvas =
        pageNum === currentPage
          ? canvasLeftRef.current
          : canvasRightRef.current;
      if (!currentCanvas) return "";

      // Convert canvas coordinates to PDF coordinates
      const scale = (zoom / 100) * 1.5;
      const pdfX = (x / currentCanvas.width) * viewport.width;
      const pdfY =
        viewport.height - (y / currentCanvas.height) * viewport.height; // Invert Y axis
      const pdfWidth = (width / currentCanvas.width) * viewport.width;
      const pdfHeight = (height / currentCanvas.height) * viewport.height;

      // Get text content from the page
      const textContent = await page.getTextContent();

      // Extract text items within the selection area
      const selectedTextItems = textContent.items.filter(
        (item: PDFTextItem) => {
          const itemX = item.transform[4];
          const itemY = item.transform[5];
          const itemWidth = item.width || 0;
          const itemHeight = item.height || 10;

          // Check if text item is within selection bounds
          const isInX = itemX >= pdfX && itemX <= pdfX + pdfWidth;
          const isInY = itemY <= pdfY && itemY >= pdfY - pdfHeight;

          return isInX && isInY;
        }
      );

      // Sort text items by position (top to bottom, left to right)
      selectedTextItems.sort((a: PDFTextItem, b: PDFTextItem) => {
        const aY = a.transform[5];
        const bY = b.transform[5];
        const aX = a.transform[4];
        const bX = b.transform[4];

        // First by Y coordinate (descending - higher Y is visually lower on page)
        if (Math.abs(aY - bY) > 5) {
          return bY - aY;
        }
        // Then by X coordinate
        return aX - bX;
      });

      // Combine text items
      const extractedText = selectedTextItems
        .map((item: PDFTextItem) => item.str)
        .join(" ");
      return extractedText || `Selected area from page ${pageNum}`;
    } catch (error) {
      console.error("Error extracting text:", error);
      return `Selected area from page ${pageNum}`;
    }
  };

  // Load PDF.js library
  useEffect(() => {
    const loadPdfJs = async (): Promise<void> => {
      if (typeof window !== "undefined") {
        try {
          setIsLoading(true);
          setError(null);

          // Use dynamic imports with proper typing
          const pdfjsLib = await import("pdfjs-dist/build/pdf");
          const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");

          // Set worker source
          (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

          const loadingTask = (pdfjsLib as any).getDocument({
            url: pdfUrl,
            cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/",
            cMapPacked: true,
          });

          const pdf: PDFDocumentProxy = await loadingTask.promise;
          pdfDocRef.current = pdf;
          setNumPages(pdf.numPages);
        } catch (error) {
          console.error("Error loading PDF:", error);
          setError("Failed to load PDF. Please check the URL and try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (pdfUrl) {
      loadPdfJs();
    }
  }, [pdfUrl]);

  // Render PDF pages
  const renderPage = useCallback(
    async (
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

        const viewport: PDFPageViewport = page.getViewport({
          scale: (zoom / 100) * 1.5,
        });
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
    },
    [zoom, pageRendering]
  );

  const drawAnnotations = useCallback(
    (
      pageNum: number,
      overlayRef: React.RefObject<HTMLCanvasElement | null>
    ): void => {
      if (!overlayRef.current) return;

      const canvas = overlayRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      // Match canvas size to PDF canvas
      const pdfCanvas =
        pageNum === currentPage
          ? canvasLeftRef.current
          : canvasRightRef.current;
      if (pdfCanvas) {
        canvas.width = pdfCanvas.width;
        canvas.height = pdfCanvas.height;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw highlights
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

      // Draw underlines
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

      // Draw bookmarks
      const pageBookmarks = bookmarks[pageNum] || [];
      pageBookmarks.forEach((bookmark) => {
        context.fillStyle = "rgba(255, 193, 7, 0.3)";
        context.fillRect(
          bookmark.x,
          bookmark.y,
          bookmark.width,
          bookmark.height
        );

        // Bookmark icon
        context.fillStyle = "rgb(255, 193, 7)";
        context.beginPath();
        context.moveTo(bookmark.x + bookmark.width - 10, bookmark.y);
        context.lineTo(bookmark.x + bookmark.width, bookmark.y);
        context.lineTo(bookmark.x + bookmark.width, bookmark.y + 15);
        context.closePath();
        context.fill();

        // Bookmark text
        if (bookmark.bookmarkName) {
          context.fillStyle = "rgb(0, 0, 0)";
          context.font = "12px Arial";
          context.fillText(bookmark.bookmarkName, bookmark.x, bookmark.y - 5);
        }
      });

      // Draw comments
      const pageComments = comments[pageNum] || [];
      pageComments.forEach((comment) => {
        context.fillStyle = "rgba(255, 193, 7, 0.3)";
        context.fillRect(comment.x, comment.y, comment.width, comment.height);

        // Comment indicator
        context.fillStyle = "rgb(255, 193, 7)";
        context.beginPath();
        context.arc(
          comment.x + comment.width - 5,
          comment.y + 5,
          5,
          0,
          2 * Math.PI
        );
        context.fill();

        // Comment text preview
        if (comment.comment) {
          context.fillStyle = "rgb(0, 0, 0)";
          context.font = "10px Arial";
          const preview =
            comment.comment.length > 20
              ? comment.comment.substring(0, 20) + "..."
              : comment.comment;
          context.fillText(preview, comment.x, comment.y - 5);
        }
      });

      // Draw search results
      const pageSearchResults = searchResults[pageNum] || [];
      pageSearchResults.forEach((result) => {
        context.fillStyle = "rgba(255, 255, 0, 0.4)";
        context.fillRect(result.x, result.y, result.width, result.height);
      });

      // Draw current selection with selected color
      if (currentSelection && currentSelection.page === pageNum) {
        const colorMap: Record<ColorName | string, string> = {
          red: "rgba(248, 113, 113, 0.3)",
          green: "rgba(74, 222, 128, 0.3)",
          blue: "rgba(96, 165, 250, 0.3)",
          purple: "rgba(192, 132, 252, 0.3)",
        };

        context.fillStyle = colorMap[selectedColor] || colorMap.red;
        context.fillRect(
          currentSelection.x,
          currentSelection.y,
          currentSelection.width,
          currentSelection.height
        );
      }
    },
    [
      highlights,
      underlines,
      comments,
      bookmarks,
      searchResults,
      currentSelection,
      currentPage,
      selectedColor,
    ]
  );

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
    drawAnnotations(currentPage, overlayLeftRef);
    drawAnnotations(currentPage + 1, overlayRightRef);
  }, [
    highlights,
    underlines,
    comments,
    bookmarks,
    currentPage,
    searchResults,
    drawAnnotations,
  ]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement>,
    pageNum: number
  ): void => {
    if (selectedTool === "eraser") {
      // Handle eraser tool
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Find and remove annotation at this position
      removeAnnotationAtPosition(x, y, pageNum);
      return;
    }

    if (
      !selectedTool ||
      (selectedTool !== "pen" &&
        selectedTool !== "underline" &&
        selectedTool !== "bookmark" &&
        selectedTool !== "comment" &&
        selectedTool !== "copy")
    ) {
      return;
    }

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsSelecting(true);
    setSelectionStart({ x, y, page: pageNum });
  };

  const removeAnnotationAtPosition = (
    x: number,
    y: number,
    pageNum: number
  ) => {
    const checkAnnotation = (annotations: Highlight[]) => {
      return annotations.filter(
        (annotation) =>
          !(
            x >= annotation.x &&
            x <= annotation.x + annotation.width &&
            y >= annotation.y &&
            y <= annotation.y + annotation.height
          )
      );
    };

    const newHighlights = { ...highlights };
    const newUnderlines = { ...underlines };
    const newComments = { ...comments };
    const newBookmarks = { ...bookmarks };

    if (newHighlights[pageNum]) {
      newHighlights[pageNum] = checkAnnotation(newHighlights[pageNum]);
    }
    if (newUnderlines[pageNum]) {
      newUnderlines[pageNum] = checkAnnotation(newUnderlines[pageNum]);
    }
    if (newComments[pageNum]) {
      newComments[pageNum] = checkAnnotation(newComments[pageNum]);
    }
    if (newBookmarks[pageNum]) {
      newBookmarks[pageNum] = checkAnnotation(newBookmarks[pageNum]);
    }

    setHighlights(newHighlights);
    setUnderlines(newUnderlines);
    setComments(newComments);
    setBookmarks(newBookmarks);
    addToHistory(newHighlights, newUnderlines, newComments, newBookmarks);
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

    const width = Math.abs(x - selectionStart.x);
    const height = Math.abs(y - selectionStart.y);
    const startX = Math.min(x, selectionStart.x);
    const startY = Math.min(y, selectionStart.y);

    setCurrentSelection({
      x: startX,
      y: startY,
      width,
      height,
      page: pageNum,
    });

    // Update overlay
    drawAnnotations(
      pageNum,
      pageNum === currentPage ? overlayLeftRef : overlayRightRef
    );
  };

  const handleMouseUp = async (
    e: React.MouseEvent<HTMLCanvasElement>,
    pageNum: number
  ): Promise<void> => {
    if (selectedTool === "eraser") {
      setIsSelecting(false);
      setSelectionStart(null);
      setCurrentSelection(null);
      return;
    }

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

      // Extract actual text from PDF for copy and comment tools
      let extractedText = "";
      if (selectedTool === "copy" || selectedTool === "comment") {
        extractedText = await extractTextFromSelection(
          pageNum,
          startX,
          startY,
          width,
          height
        );
      }

      const newAnnotation: Highlight = {
        id: Date.now().toString(),
        x: startX,
        y: startY,
        width,
        height,
        color: selectedColor,
        type:
          selectedTool === "pen"
            ? "highlight"
            : selectedTool === "underline"
            ? "underline"
            : selectedTool === "bookmark"
            ? "bookmark"
            : "comment",
        text: extractedText || `Selected area from page ${pageNum}`,
      };

      if (selectedTool === "pen") {
        const newHighlights = {
          ...highlights,
          [pageNum]: [...(highlights[pageNum] || []), newAnnotation],
        };
        setHighlights(newHighlights);
        addToHistory(newHighlights, underlines, comments, bookmarks);
      } else if (selectedTool === "underline") {
        const newUnderlines = {
          ...underlines,
          [pageNum]: [...(underlines[pageNum] || []), newAnnotation],
        };
        setUnderlines(newUnderlines);
        addToHistory(highlights, newUnderlines, comments, bookmarks);
      } else if (selectedTool === "bookmark") {
        setShowBookmarkPopup(true);
        setCurrentSelection(null);
      } else if (selectedTool === "comment") {
        setSelectedText(extractedText || `Selected area from page ${pageNum}`);
        setShowCommentPopup(true);
        setCurrentSelection({
          x: startX,
          y: startY,
          width,
          height,
          page: pageNum,
          text: extractedText,
        });
      } else if (selectedTool === "copy") {
        // Store the extracted text for copying
        setCurrentSelection({
          x: startX,
          y: startY,
          width,
          height,
          page: pageNum,
          text: extractedText,
        });
        // Copy the actual extracted text
        handleCopyText();
      }
    }

    setIsSelecting(false);
    setSelectionStart(null);
  };

  const handleAddComment = () => {
    if (currentSelection && commentText.trim()) {
      const newComment: Highlight = {
        id: Date.now().toString(),
        x: currentSelection.x,
        y: currentSelection.y,
        width: currentSelection.width,
        height: currentSelection.height,
        color: selectedColor,
        type: "comment",
        text: selectedText,
        comment: commentText,
      };

      const newComments = {
        ...comments,
        [currentSelection.page]: [
          ...(comments[currentSelection.page] || []),
          newComment,
        ],
      };
      setComments(newComments);
      addToHistory(highlights, underlines, newComments, bookmarks);
      setShowCommentPopup(false);
      setCommentText("");
      setSelectedText("");
      setCurrentSelection(null);
    }
  };

  const handleAddBookmark = () => {
    // Bookmark the entire PDF URL instead of selected text
    const name =
      bookmarkName.trim() || `Bookmark ${new Date().toLocaleDateString()}`;

    if (typeof window !== "undefined") {
      try {
        // For modern browsers
        const sidebar = (window as any).sidebar;

        if (sidebar && sidebar.addPanel) {
          // Firefox
          sidebar.addPanel(name, pdfUrl, "");
        } else if (
          (window as any).external &&
          "AddFavorite" in (window as any).external
        ) {
          // IE
          (window as any).external.AddFavorite(pdfUrl, name);
        } else {
          // Other browsers - show instructions
          alert(
            `To bookmark this PDF:\n1. Press Ctrl+D (Cmd+D on Mac)\n2. Name: ${name}\n3. URL: ${pdfUrl}\n4. Click "Save"`
          );
        }
      } catch (error) {
        alert(
          `Bookmark this PDF:\nName: ${name}\nURL: ${pdfUrl}\n\nYou can copy this URL and add it to your bookmarks manually.`
        );
      }
    }

    // Also save to local storage for in-app bookmarks
    const bookmarkId = `pdf-${Date.now()}`;
    const newBookmark: Highlight = {
      id: bookmarkId,
      x: 50, // Default position
      y: 50,
      width: 100,
      height: 30,
      color: "blue",
      type: "bookmark",
      text: `PDF Bookmark: ${name}`,
      bookmarkName: name,
    };

    const newBookmarks = {
      ...bookmarks,
      [currentPage]: [...(bookmarks[currentPage] || []), newBookmark],
    };
    setBookmarks(newBookmarks);
    addToHistory(highlights, underlines, comments, newBookmarks);

    setShowBookmarkPopup(false);
    setBookmarkName("");
    setCopiedText("Bookmark added successfully!");
    setTimeout(() => setCopiedText(""), 3000);
  };

  const handleCopyText = () => {
    if (currentSelection && currentSelection.text) {
      const textToCopy = currentSelection.text;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopiedText("Text copied to clipboard!");
          setTimeout(() => setCopiedText(""), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          setCopiedText("Failed to copy text");
          setTimeout(() => setCopiedText(""), 2000);
        });
      setCurrentSelection(null);
    } else if (currentSelection) {
      // Fallback if no text was extracted
      navigator.clipboard
        .writeText("Selected text from PDF")
        .then(() => {
          setCopiedText("Text copied to clipboard!");
          setTimeout(() => setCopiedText(""), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          setCopiedText("Failed to copy text");
          setTimeout(() => setCopiedText(""), 2000);
        });
      setCurrentSelection(null);
    }
  };

  const handlePageChangeWithAnimation = (
    newPage: number,
    direction: "left" | "right"
  ) => {
    setIsFlipping(true);
    setFlipDirection(direction);

    setTimeout(() => {
      setCurrentPage(newPage);
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 300);
    }, 150);
  };

  const handlePrevPage = (): void => {
    if (currentPage > 1 && !isFlipping) {
      handlePageChangeWithAnimation(Math.max(1, currentPage - 2), "right");
    }
  };

  const handleNextPage = (): void => {
    if (currentPage < numPages - 1 && !isFlipping) {
      handlePageChangeWithAnimation(
        Math.min(numPages - 1, currentPage + 2),
        "left"
      );
    }
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
  }, [currentPage, numPages, isFlipping]);

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
      setComments(state.comments);
      setBookmarks(state.bookmarks);
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
    for (let page = 1; page <= numPages; page++) {
      if (query.toLowerCase().includes("example") || Math.random() > 0.7) {
        results[page] = [
          {
            id: `search-${page}`,
            x: 50 + Math.random() * 300,
            y: 100 + Math.random() * 300,
            width: 150,
            height: 20,
            color: "yellow",
            type: "highlight",
          },
        ];
      }
    }
    setSearchResults(results);
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
      setSelectedTool("copy");
      // Copy will be handled when selection is made
    } else if (tool === "comment") {
      setSelectedTool("comment");
      // Comment will be added when selection is made
    } else if (tool === "bookmark") {
      // For bookmark tool, directly show the popup without requiring selection
      setShowBookmarkPopup(true);
      setSelectedTool(null);
    } else {
      setSelectedTool((prev) => (prev === tool ? null : tool));
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading PDF...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Error: {error}</div>
      </div>
    );
  }

  const leftPage = currentPage;
  const rightPage = currentPage + 1;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-4 py-3 flex items-center">
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
        <div className="bg-white border-b rounded-2xl px-4 py-3 flex items-center gap-2 w-[50%] mx-auto">
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

      {/* Comment Popup */}
      {showCommentPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Comment</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Selected text:</p>
              <p className="text-sm bg-gray-100 p-2 rounded">{selectedText}</p>
            </div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Enter your comment..."
              className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentPopup(false);
                  setCommentText("");
                  setSelectedText("");
                  setCurrentSelection(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddComment}>Add Comment</Button>
            </div>
          </div>
        </div>
      )}

      {/* Bookmark Popup */}
      {showBookmarkPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Bookmark PDF</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">PDF URL:</p>
              <p className="text-sm bg-gray-100 p-2 rounded break-all">
                {pdfUrl}
              </p>
            </div>
            <input
              type="text"
              value={bookmarkName}
              onChange={(e) => setBookmarkName(e.target.value)}
              placeholder="Enter bookmark name (optional)"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBookmarkPopup(false);
                  setBookmarkName("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddBookmark}>Add Bookmark</Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-auto">
        {/* Left Arrow */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || isFlipping}
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10
            ${
              currentPage <= 1 || isFlipping
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl cursor-pointer"
            }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Book Pages Container with 3D Flip Effect */}
        <div
          className={`flex gap-8 max-w-7xl transition-all duration-500 ${
            isFlipping
              ? flipDirection === "left"
                ? "transform-gpu perspective-1000 rotate-y-10 scale-95"
                : "transform-gpu perspective-1000 -rotate-y-10 scale-95"
              : "transform-gpu perspective-1000 rotate-y-0 scale-100"
          }`}
        >
          {/* Left Page */}
          <div
            className={`bg-white shadow-2xl rounded-lg overflow-hidden flex items-center justify-center relative transition-all duration-500 ${
              isFlipping && flipDirection === "right"
                ? "z-20 shadow-xl"
                : "z-10"
            }`}
            style={{ minWidth: "450px", minHeight: "600px" }}
          >
            <canvas ref={canvasLeftRef} className="max-w-full max-h-full" />
            <canvas
              ref={overlayLeftRef}
              className="absolute top-0 left-0 cursor-crosshair"
              onMouseDown={(e) => handleMouseDown(e, leftPage)}
              onMouseMove={(e) => handleMouseMove(e, leftPage)}
              onMouseUp={(e) => handleMouseUp(e, leftPage)}
              onMouseLeave={() => {
                setIsSelecting(false);
                setSelectionStart(null);
                setCurrentSelection(null);
              }}
              style={{
                cursor:
                  selectedTool === "eraser"
                    ? "not-allowed"
                    : selectedTool
                    ? "crosshair"
                    : "default",
              }}
            />
          </div>

          {/* Right Page */}
          {rightPage <= numPages && (
            <div
              className={`bg-white shadow-2xl rounded-lg overflow-hidden flex items-center justify-center relative transition-all duration-500 ${
                isFlipping && flipDirection === "left"
                  ? "z-20 shadow-xl"
                  : "z-10"
              }`}
              style={{ minWidth: "450px", minHeight: "600px" }}
            >
              <canvas ref={canvasRightRef} className="max-w-full max-h-full" />
              <canvas
                ref={overlayRightRef}
                className="absolute top-0 left-0 cursor-crosshair"
                onMouseDown={(e) => handleMouseDown(e, rightPage)}
                onMouseMove={(e) => handleMouseMove(e, rightPage)}
                onMouseUp={(e) => handleMouseUp(e, rightPage)}
                onMouseLeave={() => {
                  setIsSelecting(false);
                  setSelectionStart(null);
                  setCurrentSelection(null);
                }}
                style={{
                  cursor:
                    selectedTool === "eraser"
                      ? "not-allowed"
                      : selectedTool
                      ? "crosshair"
                      : "default",
                }}
              />
            </div>
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= numPages - 1 || isFlipping}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10
            ${
              currentPage >= numPages - 1 || isFlipping
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl cursor-pointer"
            }`}
          aria-label="Next page"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Bottom Toolbar */}
      <div className="py-4 px-8">
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
              <LuUndo2 className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleToolClick("eraser")}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === "eraser" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Eraser"
              title="Click to enable eraser mode"
            >
              <PiEraser className="w-5 h-5 text-gray-600" />
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
              <BiHighlight className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleToolClick("comment")}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === "comment" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Comment"
              title="Add comment to selected text"
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
              title="Bookmark this PDF"
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
            {currentPage} - {Math.min(currentPage + 1, numPages)} of {numPages}
          </span>
        </div>

        {/* Copy Feedback */}
        {copiedText && (
          <div className="text-center mt-2 text-sm text-green-600 font-medium">
            {copiedText}
          </div>
        )}

        {/* Tool Indicator */}
        {selectedTool && selectedTool !== "bookmark" && (
          <div className="text-center mt-2 text-sm text-blue-600 font-medium">
            {selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)} mode
            active - Select text to {selectedTool}
          </div>
        )}
      </div>

      {/* Add custom CSS for 3D flip effect */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-10 {
          transform: rotateY(10deg);
        }
        .-rotate-y-10 {
          transform: rotateY(-10deg);
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
        .transform-gpu {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}

export default PdfReader;
