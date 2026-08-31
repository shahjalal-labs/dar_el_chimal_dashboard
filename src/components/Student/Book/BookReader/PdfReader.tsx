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
  Loader2,
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
import { toast } from "sonner";

interface PDFPageProxy {
  getViewport: (options: { scale: number }) => PDFPageViewport;
  render: (renderContext: any) => PDFRenderTask;
  getTextContent: () => Promise<PDFTextContent>;
}

interface PDFRenderTask {
  promise: Promise<void>;
  cancel: () => void;
}

interface PDFPageViewport {
  width: number;
  height: number;
  convertToViewportRectangle: (rectangle: number[]) => number[];
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

interface PdfReaderProps {
  bookId: string | number;
  pdfUrl: string;
  totalPages?: number;
  isButton?: boolean;
  useStreaming?: boolean;
}

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

type ToolType =
  | "pen"
  | "underline"
  | "eraser"
  | "comment"
  | "copy"
  | "bookmark"
  | "search"
  | null;

type ColorName = "red" | "green" | "blue" | "purple";

function PdfReader({
  pdfUrl,
  totalPages = 120,
  isButton,
  useStreaming = false,
}: PdfReaderProps) {
  const router = useRouter();

  // Initialize currentPage from localStorage if available
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedPage = localStorage.getItem(`pdf-current-page-${pdfUrl}`);
      if (savedPage) {
        const pageNum = parseInt(savedPage, 10);
        if (pageNum > 0 && !isNaN(pageNum)) {
          return pageNum;
        }
      }
    }
    return 1;
  });

  const [zoom, setZoom] = useState<number>(100);
  const [pageInput, setPageInput] = useState<string>("1");
  const [panOffsets, setPanOffsets] = useState({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState<ColorName>("red");
  const [selectedTool, setSelectedTool] = useState<ToolType>(null);
  const [numPages, setNumPages] = useState<number>(totalPages);
  const [pageRendering, setPageRendering] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);

  const [highlights, setHighlights] = useState<{ [key: number]: Highlight[] }>(
    {},
  );
  const [underlines, setUnderlines] = useState<{ [key: number]: Highlight[] }>(
    {},
  );
  const [comments, setComments] = useState<{ [key: number]: Highlight[] }>({});
  const [bookmarks, setBookmarks] = useState<{ [key: number]: Highlight[] }>(
    {},
  );
  const [erasedAreas, setErasedAreas] = useState<{
    [key: number]: Array<{ x: number; y: number; radius: number }>;
  }>({});
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
  const [showSearchBar, setShowSearchBar] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<{
    [key: number]: Highlight[];
  }>({});
  const [searchResultIndex, setSearchResultIndex] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string>("");
  const [showCommentPopup, setShowCommentPopup] = useState<boolean>(false);
  const [showBookmarkPopup, setShowBookmarkPopup] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");
  const [bookmarkName, setBookmarkName] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right" | null>(
    null,
  );
  const renderTaskRef = useRef<PDFRenderTask | null>(null);
  const renderRequestIdRef = useRef<number>(0);
  const searchRequestRef = useRef(0);
  const panDragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const isErasingRef = useRef(false);

  const flattenedSearchResults = Object.entries(searchResults)
    .sort(([pageA], [pageB]) => Number(pageA) - Number(pageB))
    .flatMap(([, pageResults]) => pageResults);

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

  useEffect(() => {
    const savedComments = localStorage.getItem(`pdf-comments-${pdfUrl}`);
    if (!savedComments) {
      setComments({});
      return;
    }

    try {
      setComments(JSON.parse(savedComments));
    } catch (error) {
      console.error("Error loading comments from localStorage:", error);
      setComments({});
    }
  }, [pdfUrl]);

  useEffect(() => {
    localStorage.setItem(`pdf-comments-${pdfUrl}`, JSON.stringify(comments));
  }, [comments, pdfUrl]);

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    if (currentPage > 0) {
      localStorage.setItem(
        `pdf-current-page-${pdfUrl}`,
        currentPage.toString(),
      );
    }
  }, [currentPage, pdfUrl]);

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Initialize history
  useEffect(() => {
    addToHistory(highlights, underlines, comments, bookmarks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToHistory = useCallback(
    (
      newHighlights: { [key: number]: Highlight[] },
      newUnderlines: { [key: number]: Highlight[] },
      newComments: { [key: number]: Highlight[] },
      newBookmarks: { [key: number]: Highlight[] },
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
    [history, historyIndex],
  );

  // Extract text from PDF selection
  const extractTextFromSelection = async (
    pageNum: number,
    x: number,
    y: number,
    width: number,
    height: number,
  ): Promise<string> => {
    if (!pdfDocRef.current) return "";

    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });

      const currentCanvas = canvasRef.current;
      if (!currentCanvas) return "";

      // Convert canvas coordinates to PDF coordinates
      const pdfX = (x / currentCanvas.width) * viewport.width;
      const pdfY =
        viewport.height - (y / currentCanvas.height) * viewport.height;
      const pdfWidth = (width / currentCanvas.width) * viewport.width;
      const pdfHeight = (height / currentCanvas.height) * viewport.height;

      // Get text content from the page
      const textContent = await page.getTextContent();

      // Extract text items within the selection area
      const selectedTextItems = textContent.items.filter(
        (item: PDFTextItem) => {
          const itemX = item.transform[4];
          const itemY = item.transform[5];

          // Check if text item is within selection bounds
          const isInX = itemX >= pdfX && itemX <= pdfX + pdfWidth;
          const isInY = itemY <= pdfY && itemY >= pdfY - pdfHeight;

          return isInX && isInY;
        },
      );

      // Sort text items by position (top to bottom, left to right)
      selectedTextItems.sort((a: PDFTextItem, b: PDFTextItem) => {
        const aY = a.transform[5];
        const bY = b.transform[5];
        const aX = a.transform[4];
        const bX = b.transform[4];

        if (Math.abs(aY - bY) > 5) {
          return bY - aY;
        }
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

          const pdfjsLib = await import("pdfjs-dist/build/pdf");
          const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");

          (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

          const loadingTaskConfig: any = {
            url: pdfUrl,
            cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/",
            cMapPacked: true,
            withCredentials: false,
          };

          if (useStreaming) {
            loadingTaskConfig.rangeChunkSize = 65536;
            loadingTaskConfig.disableAutoFetch = true;
            loadingTaskConfig.disableStream = false;
            loadingTaskConfig.isEvalSupported = false;
          }

          const loadingTask = (pdfjsLib as any).getDocument(loadingTaskConfig);

          const pdf: PDFDocumentProxy = await loadingTask.promise;
          pdfDocRef.current = pdf;
          setNumPages(pdf.numPages);
        } catch (error) {
          console.error("Error loading PDF:", error);

          let errorMessage = "Failed to load PDF. ";

          if (error instanceof Error) {
            if (error.message.includes("500")) {
              errorMessage +=
                "The server encountered an error while fetching the PDF. Please check the PDF URL and try again.";
            } else if (error.message.includes("404")) {
              errorMessage +=
                "The PDF file was not found. Please check if the file exists.";
            } else if (error.message.includes("403")) {
              errorMessage +=
                "Access to the PDF is forbidden. Please check permissions.";
            } else {
              errorMessage += error.message;
            }
          } else {
            errorMessage += "An unknown error occurred. Please try again.";
          }

          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (pdfUrl) {
      loadPdfJs();
    }
  }, [pdfUrl, useStreaming]);

  // Render visible page
  const renderPage = useCallback(
    async (pageNum: number): Promise<void> => {
      if (!pdfDocRef.current || !canvasRef.current) return;
      if (pageNum < 1 || pageNum > numPages) return;

      const requestId = ++renderRequestIdRef.current;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
      let renderTask: PDFRenderTask | null = null;

      try {
        const page: PDFPageProxy = await pdfDocRef.current.getPage(pageNum);
        if (requestId !== renderRequestIdRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Could not get canvas context");
        }

        const viewport: PDFPageViewport = page.getViewport({
          scale: 1.5,
        });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
        });
        renderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (error) {
        if (
          !(
            error instanceof Error &&
            error.name === "RenderingCancelledException"
          )
        ) {
          console.error(`Error rendering page ${pageNum}:`, error);
        }
      } finally {
        if (renderTaskRef.current === renderTask) {
          renderTaskRef.current = null;
        }
      }
    },
    [numPages],
  );

  const drawAnnotations = useCallback(
    (pageNum: number): void => {
      if (!overlayRef.current) return;

      const canvas = overlayRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      const pdfCanvas = canvasRef.current;
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
          highlight.height,
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
          underline.y + underline.height,
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
          bookmark.height,
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
        context.fillStyle = "rgba(250, 204, 21, 0.24)";
        context.fillRect(comment.x, comment.y, comment.width, comment.height);
        context.strokeStyle = "rgba(202, 138, 4, 0.8)";
        context.lineWidth = 2;
        context.strokeRect(comment.x, comment.y, comment.width, comment.height);

        // Comment indicator
        context.fillStyle = "rgb(202, 138, 4)";
        context.beginPath();
        context.arc(
          comment.x + comment.width - 5,
          comment.y + 5,
          5,
          0,
          2 * Math.PI,
        );
        context.fill();

        // Comment text preview
        if (comment.comment) {
          const maxBubbleWidth = 220;
          const lineHeight = 18;
          const padding = 10;
          context.font = "14px Arial";
          const words = comment.comment.trim().split(/\s+/);
          const lines: string[] = [];
          let line = "";

          words.forEach((word) => {
            const nextLine = line ? `${line} ${word}` : word;
            if (
              line &&
              context.measureText(nextLine).width > maxBubbleWidth - padding * 2
            ) {
              lines.push(line);
              line = word;
            } else {
              line = nextLine;
            }
          });
          if (line) lines.push(line);

          const visibleLines = lines.slice(0, 3);
          if (lines.length > 3) {
            visibleLines[2] = `${visibleLines[2].slice(0, -3)}...`;
          }

          const bubbleWidth = maxBubbleWidth;
          const bubbleHeight = visibleLines.length * lineHeight + padding * 2;
          let bubbleX = comment.x + comment.width + 14;
          if (bubbleX + bubbleWidth > canvas.width - 4) {
            bubbleX = comment.x - bubbleWidth - 14;
          }
          bubbleX = Math.max(
            4,
            Math.min(bubbleX, canvas.width - bubbleWidth - 4),
          );
          const bubbleY = Math.max(
            4,
            Math.min(comment.y, canvas.height - bubbleHeight - 4),
          );

          context.strokeStyle = "rgba(202, 138, 4, 0.75)";
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(
            bubbleX > comment.x ? comment.x + comment.width : comment.x,
            comment.y + comment.height / 2,
          );
          context.lineTo(
            bubbleX > comment.x ? bubbleX : bubbleX + bubbleWidth,
            bubbleY + bubbleHeight / 2,
          );
          context.stroke();

          context.fillStyle = "rgba(255, 251, 235, 0.98)";
          context.beginPath();
          context.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8);
          context.fill();
          context.strokeStyle = "rgb(202, 138, 4)";
          context.stroke();

          context.fillStyle = "rgb(55, 65, 81)";
          visibleLines.forEach((visibleLine, index) => {
            context.fillText(
              visibleLine,
              bubbleX + padding,
              bubbleY + padding + lineHeight * (index + 1) - 3,
            );
          });
        }
      });

      // Draw search results
      const pageSearchResults = searchResults[pageNum] || [];
      pageSearchResults.forEach((result) => {
        const isActive =
          flattenedSearchResults[searchResultIndex]?.id === result.id;
        context.fillStyle = isActive
          ? "rgba(255, 165, 0, 0.65)"
          : "rgba(255, 255, 0, 0.4)";
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
          currentSelection.height,
        );
      }

      // Paint erased areas last
      const pageErasedAreas = erasedAreas[pageNum] || [];
      pageErasedAreas.forEach((area) => {
        context.fillStyle = "rgb(255, 255, 255)";
        context.beginPath();
        context.arc(area.x, area.y, area.radius, 0, 2 * Math.PI);
        context.fill();
      });
    },
    [
      highlights,
      underlines,
      comments,
      bookmarks,
      searchResults,
      flattenedSearchResults,
      searchResultIndex,
      currentSelection,
      selectedColor,
      erasedAreas,
    ],
  );

  // Render visible page when currentPage changes
  useEffect(() => {
    if (pdfDocRef.current && !isFlipping) {
      if (currentPage <= numPages) {
        renderPage(currentPage);
      }
    }
  }, [currentPage, numPages, renderPage, isFlipping]);

  useEffect(() => {
    drawAnnotations(currentPage);
  }, [
    highlights,
    underlines,
    comments,
    bookmarks,
    currentPage,
    searchResults,
    zoom,
    drawAnnotations,
  ]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement>,
    pageNum: number,
  ): void => {
    if (!selectedTool && zoom > 100) {
      panDragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: panOffsets.x,
        originY: panOffsets.y,
      };
      e.currentTarget.style.cursor = "grabbing";
      return;
    }

    if (selectedTool === "eraser") {
      const { x, y } = getCanvasCoordinates(e, pageNum);

      isErasingRef.current = true;
      removeAnnotationAtPosition(x, y, pageNum);
      addEraseMark(x, y, pageNum);
      setIsSelecting(true);
      setSelectionStart({ x, y, page: pageNum });
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

    const { x, y } = getCanvasCoordinates(e, pageNum);

    setIsSelecting(true);
    setSelectionStart({ x, y, page: pageNum });
  };

  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement>,
    pageNum: number,
  ): { x: number; y: number } => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const pageCanvas = canvasRef.current;
    const zoomScale = zoom / 100;
    const unscaledWidth = rect.width / zoomScale;
    const unscaledHeight = rect.height / zoomScale;

    return {
      x:
        ((e.clientX - rect.left) / zoomScale) *
        (pageCanvas ? canvas.width / unscaledWidth : 1),
      y:
        ((e.clientY - rect.top) / zoomScale) *
        (pageCanvas ? canvas.height / unscaledHeight : 1),
    };
  };

  const handlePanMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    const drag = panDragRef.current;
    if (!drag) return;

    const maxX = (550 * (zoom / 100 - 1)) / 2;
    const maxY = (750 * (zoom / 100 - 1)) / 2;
    const nextX = drag.originX + e.clientX - drag.startX;
    const nextY = drag.originY + e.clientY - drag.startY;

    setPanOffsets({
      x: Math.max(-maxX, Math.min(maxX, nextX)),
      y: Math.max(-maxY, Math.min(maxY, nextY)),
    });
  };

  const handlePanEnd = (): void => {
    panDragRef.current = null;
  };

  const finishCommentSelection = async (pageNum: number): Promise<void> => {
    if (
      selectedTool !== "comment" ||
      !isSelecting ||
      !currentSelection ||
      currentSelection.page !== pageNum
    ) {
      return;
    }

    const extractedText = await extractTextFromSelection(
      pageNum,
      currentSelection.x,
      currentSelection.y,
      currentSelection.width,
      currentSelection.height,
    );
    setSelectedText(extractedText);
    setCurrentSelection({ ...currentSelection, text: extractedText });
    setShowCommentPopup(true);
    setIsSelecting(false);
    setSelectionStart(null);
  };

  const removeAnnotationAtPosition = (
    x: number,
    y: number,
    pageNum: number,
  ): boolean => {
    const checkAnnotation = (annotations: Highlight[]) => {
      return annotations.filter(
        (annotation) =>
          !(
            x >= annotation.x &&
            x <= annotation.x + annotation.width &&
            y >= annotation.y &&
            y <= annotation.y + annotation.height
          ),
      );
    };

    const newHighlights = { ...highlights };
    const newUnderlines = { ...underlines };
    const newComments = { ...comments };
    const newBookmarks = { ...bookmarks };
    let removed = false;

    if (newHighlights[pageNum]) {
      const previousLength = newHighlights[pageNum].length;
      newHighlights[pageNum] = checkAnnotation(newHighlights[pageNum]);
      removed ||= newHighlights[pageNum].length !== previousLength;
    }
    if (newUnderlines[pageNum]) {
      const previousLength = newUnderlines[pageNum].length;
      newUnderlines[pageNum] = checkAnnotation(newUnderlines[pageNum]);
      removed ||= newUnderlines[pageNum].length !== previousLength;
    }
    if (newComments[pageNum]) {
      const previousLength = newComments[pageNum].length;
      newComments[pageNum] = checkAnnotation(newComments[pageNum]);
      removed ||= newComments[pageNum].length !== previousLength;
    }
    if (newBookmarks[pageNum]) {
      const previousLength = newBookmarks[pageNum].length;
      newBookmarks[pageNum] = checkAnnotation(newBookmarks[pageNum]);
      removed ||= newBookmarks[pageNum].length !== previousLength;
    }

    if (!removed) return false;

    setHighlights(newHighlights);
    setUnderlines(newUnderlines);
    setComments(newComments);
    setBookmarks(newBookmarks);
    addToHistory(newHighlights, newUnderlines, newComments, newBookmarks);
    return true;
  };

  const addEraseMark = (x: number, y: number, pageNum: number): void => {
    setErasedAreas((current) => ({
      ...current,
      [pageNum]: [...(current[pageNum] || []), { x, y, radius: 24 }],
    }));
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement>,
    pageNum: number,
  ): void => {
    if (panDragRef.current) {
      handlePanMove(e);
      return;
    }

    if (selectedTool === "eraser" && isErasingRef.current) {
      const { x, y } = getCanvasCoordinates(e, pageNum);
      removeAnnotationAtPosition(x, y, pageNum);
      addEraseMark(x, y, pageNum);
      return;
    }

    if (!isSelecting || !selectionStart || !selectedTool) return;

    const { x, y } = getCanvasCoordinates(e, pageNum);

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
    drawAnnotations(pageNum);
  };

  const handleMouseUp = async (
    e: React.MouseEvent<HTMLCanvasElement>,
    pageNum: number,
  ): Promise<void> => {
    if (panDragRef.current) {
      handlePanEnd();
      return;
    }

    if (selectedTool === "eraser") {
      isErasingRef.current = false;
      setIsSelecting(false);
      setSelectionStart(null);
      setCurrentSelection(null);
      return;
    }

    if (!isSelecting || !selectionStart || !selectedTool) {
      setIsSelecting(false);
      return;
    }

    const { x, y } = getCanvasCoordinates(e, pageNum);

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
          height,
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
        await handleCopyText(extractedText);
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
      setSelectedTool(null);
      toast.success("Comment added", {
        description: "Your comment was saved to this page.",
      });
    }
  };

  const handleAddBookmark = () => {
    const name =
      bookmarkName.trim() || `Bookmark ${new Date().toLocaleDateString()}`;

    if (typeof window !== "undefined") {
      try {
        const sidebar = (window as any).sidebar;

        if (sidebar && sidebar.addPanel) {
          sidebar.addPanel(name, pdfUrl, "");
        } else if (
          (window as any).external &&
          "AddFavorite" in (window as any).external
        ) {
          (window as any).external.AddFavorite(pdfUrl, name);
        } else {
          alert(
            `To bookmark this PDF:\n1. Press Ctrl+D (Cmd+D on Mac)\n2. Name: ${name}\n3. URL: ${pdfUrl}\n4. Click "Save"`,
          );
        }
      } catch (error) {
        alert(
          `Bookmark this PDF:\nName: ${name}\nURL: ${pdfUrl}\n\nYou can copy this URL and add it to your bookmarks manually.`,
        );
      }
    }

    const bookmarkId = `pdf-${Date.now()}`;
    const newBookmark: Highlight = {
      id: bookmarkId,
      x: 50,
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

  const handleCopyText = async (text?: string): Promise<void> => {
    const textToCopy = text ?? currentSelection?.text;

    if (textToCopy?.trim()) {
      const copiedValue = textToCopy.trim();

      try {
        await navigator.clipboard.writeText(copiedValue);
        toast.success("Text copied to clipboard", {
          duration: 1000,
        });
        setCopiedText("Text copied to clipboard!");
        setTimeout(() => setCopiedText(""), 2000);
      } catch (error) {
        console.error("Failed to copy text: ", error);
        toast.error("Could not copy text", {
          description:
            "Please check your browser clipboard permission and try again.",
        });
        setCopiedText("Failed to copy text");
        setTimeout(() => setCopiedText(""), 2000);
      }
      setCurrentSelection(null);
    } else if (text !== undefined || currentSelection) {
      toast.warning("No text found", {
        description: "Select an area containing text and try again.",
      });
      setCopiedText("No text found in selected area");
      setTimeout(() => setCopiedText(""), 2000);
      setCurrentSelection(null);
    }
  };

  const handlePageChangeWithAnimation = (
    newPage: number,
    direction: "left" | "right",
  ) => {
    if (isFlipping) return;

    setIsFlipping(true);
    setFlipDirection(direction);

    setCurrentPage(newPage);

    setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
    }, 200);
  };

  const handlePrevPage = (): void => {
    if (currentPage > 1 && !isFlipping) {
      handlePageChangeWithAnimation(Math.max(1, currentPage - 1), "right");
    }
  };

  const handleNextPage = (): void => {
    if (currentPage < numPages && !isFlipping) {
      handlePageChangeWithAnimation(
        Math.min(numPages, currentPage + 1),
        "left",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, numPages, isFlipping]);

  const handleZoomIn = (): void => {
    setZoom((prev) => Math.min(200, prev + 10));
  };

  const handleZoomOut = (): void => {
    setZoom((prev) => Math.max(50, prev - 10));
  };

  useEffect(() => {
    if (zoom <= 100) {
      setPanOffsets({ x: 0, y: 0 });
      return;
    }

    const maxX = (550 * (zoom / 100 - 1)) / 2;
    const maxY = (750 * (zoom / 100 - 1)) / 2;
    setPanOffsets((current) => ({
      x: Math.max(-maxX, Math.min(maxX, current.x)),
      y: Math.max(-maxY, Math.min(maxY, current.y)),
    }));
  }, [zoom]);

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

  const handleSearch = async (query: string): Promise<void> => {
    setSearchQuery(query);
    const requestId = ++searchRequestRef.current;

    if (query.trim() === "") {
      setIsSearching(false);
      setSearchResults({});
      setSearchResultIndex(0);
      return;
    }

    setIsSearching(true);

    if (!pdfDocRef.current) {
      setIsSearching(false);
      return;
    }

    const results: { [key: number]: Highlight[] } = {};
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const pagesToSearch = [currentPage];
    const measurementContext = canvasRef.current?.getContext("2d");

    for (const pageNumber of pagesToSearch) {
      if (requestId !== searchRequestRef.current) return;

      const page = await pdfDocRef.current.getPage(pageNumber);
      const viewport = page.getViewport({ scale: (zoom / 100) * 1.5 });
      const textContent = await page.getTextContent();
      const pageResults: Highlight[] = [];

      textContent.items.forEach((item: PDFTextItem, itemIndex: number) => {
        const text = item.str || "";
        const lowerText = text.toLocaleLowerCase();
        let matchStart = lowerText.indexOf(normalizedQuery);

        while (matchStart !== -1) {
          const matchEnd = matchStart + normalizedQuery.length;
          const itemX = item.transform[4] || 0;
          const itemY = item.transform[5] || 0;
          const itemWidth = item.width || 0;
          const itemHeight = item.height || Math.abs(item.transform[3] || 10);
          let startOffset = itemWidth * (matchStart / text.length);
          let endOffset = itemWidth * (matchEnd / text.length);

          const fontStyle = textContent.styles[item.fontName];
          if (measurementContext && fontStyle?.fontFamily) {
            const fontSize =
              Math.hypot(item.transform[0], item.transform[1]) || itemHeight;
            measurementContext.font = `${fontSize}px ${fontStyle.fontFamily}`;
            const measuredTextWidth =
              measurementContext.measureText(text).width;

            if (measuredTextWidth > 0) {
              const widthScale = itemWidth / measuredTextWidth;
              startOffset =
                measurementContext.measureText(text.slice(0, matchStart))
                  .width * widthScale;
              endOffset =
                measurementContext.measureText(text.slice(0, matchEnd)).width *
                widthScale;
            }
          }

          const startX = itemX + startOffset;
          const endX = itemX + endOffset;
          const rectangle = viewport.convertToViewportRectangle([
            startX,
            itemY,
            endX,
            itemY + itemHeight,
          ]);
          const x = Math.min(rectangle[0], rectangle[2]);
          const y = Math.min(rectangle[1], rectangle[3]);

          pageResults.push({
            id: `search-${pageNumber}-${itemIndex}-${matchStart}`,
            x,
            y,
            width: Math.abs(rectangle[2] - rectangle[0]),
            height: Math.abs(rectangle[3] - rectangle[1]),
            color: "yellow",
            type: "highlight",
            text: text.slice(matchStart, matchEnd),
          });

          matchStart = lowerText.indexOf(normalizedQuery, matchEnd);
        }
      });

      if (pageResults.length > 0) {
        results[pageNumber] = pageResults;
      }
    }

    if (requestId !== searchRequestRef.current) return;
    setIsSearching(false);
    setSearchResults(results);
    setSearchResultIndex(0);
  };

  const goToSearchResult = (index: number): void => {
    const result = flattenedSearchResults[index];
    if (!result) return;

    setSearchResultIndex(index);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      void handleSearch(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleGoToPage = (): void => {
    const requestedPage = Number.parseInt(pageInput, 10);
    if (Number.isNaN(requestedPage)) {
      toast.error("Enter a valid page number");
      setPageInput(currentPage.toString());
      return;
    }

    const targetPage = Math.min(Math.max(requestedPage, 1), numPages);
    setCurrentPage(targetPage);
    setPanOffsets({ x: 0, y: 0 });
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
    } else if (tool === "comment") {
      setSelectedTool("comment");
    } else if (tool === "bookmark") {
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
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <div className="text-gray-600">Loading PDF...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Error Loading PDF</h3>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-2 justify-center">
            {isButton && (
              <Button onClick={() => router.back()} variant="outline">
                Go Back
              </Button>
            )}
            <Button onClick={() => window.location.reload()} variant="default">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-4 py-3 flex items-center">
        {isButton && (
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </Button>
        )}
      </div>

      {/* Search Bar */}
      {showSearchBar && (
        <div className="bg-white border-b rounded-2xl px-4 py-3 flex items-center gap-2 w-[80%] mx-auto">
          <input
            type="text"
            placeholder="Search in PDF..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex items-center gap-1 shrink-0">
            <input
              type="number"
              min={1}
              max={numPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGoToPage();
              }}
              className="w-16 px-2 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Page number"
              title="Go to page"
            />
            <Button
              variant="outline"
              onClick={handleGoToPage}
              className="px-3 py-2 rounded-lg"
              aria-label="Go to page"
            >
              Go to page
            </Button>
          </div>
          {searchQuery.trim() && (
            <div className="flex items-center gap-1 text-sm text-gray-600 whitespace-nowrap">
              {isSearching ? (
                <span className="flex items-center gap-1.5 px-1">
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Searching...</span>
                </span>
              ) : (
                <span>
                  {flattenedSearchResults.length > 0
                    ? searchResultIndex + 1
                    : 0}{" "}
                  of {flattenedSearchResults.length}
                </span>
              )}
              <Button
                variant="ghost"
                onClick={() => {
                  if (flattenedSearchResults.length > 0) {
                    goToSearchResult(
                      (searchResultIndex - 1 + flattenedSearchResults.length) %
                      flattenedSearchResults.length,
                    );
                  }
                }}
                disabled={isSearching || flattenedSearchResults.length === 0}
                className="p-1"
                aria-label="Previous search result"
                title="Previous match"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  if (flattenedSearchResults.length > 0) {
                    goToSearchResult(
                      (searchResultIndex + 1) % flattenedSearchResults.length,
                    );
                  }
                }}
                disabled={isSearching || flattenedSearchResults.length === 0}
                className="p-1"
                aria-label="Next search result"
                title="Next match"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Button
            variant="default"
            onClick={() => {
              setShowSearchBar(false);
              setSearchQuery("");
              setSearchResults({});
            }}
            className="p-2 bg-gray-200 hover:bg-gray-50 rounded-lg"
          >
            <X className="w-5 h-5 text-black" />
          </Button>
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
              <Button variant="default" onClick={handleAddComment}>
                Add Comment
              </Button>
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
        <Button
          variant="default"
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || isFlipping}
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10
            ${currentPage <= 1 || isFlipping
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-gray-50 hover:shadow-xl cursor-pointer"
            }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Button>

        {/* Book Page Container with Smooth Animation */}
        <div
          className={`transition-all duration-200 ease-out ${isFlipping ? "opacity-90 scale-[0.99]" : "opacity-100 scale-100"
            }`}
        >
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden flex items-center justify-center relative w-[520px] sm:w-[600px] md:w-[680px] aspect-[3/4] max-h-[calc(100vh-220px)]">
            <div
              className="relative w-full h-full shrink-0 transition-transform duration-200"
              style={{
                transform: `translate(${panOffsets.x}px, ${panOffsets.y}px) scale(${zoom / 100})`,
              }}
            >
              <canvas ref={canvasRef} className="block w-full h-full" />
              <canvas
                ref={overlayRef}
                className="absolute inset-0 w-full h-full cursor-crosshair"
                onMouseDown={(e) => handleMouseDown(e, currentPage)}
                onMouseMove={(e) => handleMouseMove(e, currentPage)}
                onMouseUp={(e) => handleMouseUp(e, currentPage)}
                onMouseLeave={() => {
                  isErasingRef.current = false;
                  if (
                    selectedTool === "comment" &&
                    currentSelection &&
                    currentSelection.width > 5 &&
                    currentSelection.height > 5
                  ) {
                    void finishCommentSelection(currentPage);
                    return;
                  }
                  handlePanEnd();
                  setIsSelecting(false);
                  setSelectionStart(null);
                  setCurrentSelection(null);
                }}
                style={{
                  cursor:
                    !selectedTool && zoom > 100
                      ? "grab"
                      : selectedTool === "eraser"
                        ? "crosshair"
                        : selectedTool
                          ? "crosshair"
                          : "default",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Arrow */}
        <Button
          variant="default"
          onClick={handleNextPage}
          disabled={currentPage >= numPages || isFlipping}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10
            ${currentPage >= numPages || isFlipping
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-gray-50 hover:shadow-xl cursor-pointer"
            }`}
          aria-label="Next page"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </Button>
      </div>

      {/* Bottom Toolbar */}
      <div className="py-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Section - Color Palette */}
          <div className="flex gap-2">
            {colors.map((color) => (
              <Button
                variant="default"
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-8 h-8 rounded-full bg-white ${color.class} ${selectedColor === color.name
                    ? "ring-2 ring-offset-2 ring-gray-400"
                    : ""
                  } transition-all hover:scale-110`}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>

          {/* Center Section - Tools */}
          <div className="flex items-center gap-1">
            <Button
              variant="default"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-2 rounded-lg transition-colors bg-white ${historyIndex <= 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-100"
                }`}
              aria-label="Undo"
              title="Undo last action"
            >
              <LuUndo2 className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="default"
              onClick={() => handleToolClick("eraser")}
              className={`p-2 rounded-lg transition-colors bg-white ${selectedTool === "eraser" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              aria-label="Eraser"
              title="Click to enable eraser mode"
            >
              <PiEraser className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="default"
              onClick={() => handleToolClick("underline")}
              className={`p-2 rounded-lg transition-colors bg-white ${selectedTool === "underline"
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
                }`}
              aria-label="Underline"
              title="Click to enable underline mode"
            >
              <Underline className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="default"
              onClick={() => handleToolClick("search")}
              className={`p-2 rounded-lg transition-colors bg-white ${showSearchBar ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              aria-label="Search"
              title="Search in PDF"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="default"
              onClick={() => handleToolClick("pen")}
              className={`p-2 rounded-lg transition-colors bg-white ${selectedTool === "pen" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              aria-label="Highlight"
              title="Click to enable highlighting mode"
            >
              <BiHighlight className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="default"
              onClick={() => handleToolClick("comment")}
              className={`p-2 rounded-lg transition-colors bg-white ${selectedTool === "comment" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              aria-label="Comment"
              title="Add comment to selected text"
            >
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="default"
              onClick={() => handleToolClick("copy")}
              className={`p-2 rounded-lg transition-colors bg-white ${copiedText ? "bg-green-100" : "hover:bg-gray-100"
                }`}
              aria-label="Copy"
              title="Copy selected text"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="default"
              onClick={() => handleToolClick("bookmark")}
              className={`p-2 rounded-lg transition-colors bg-white ${selectedTool === "bookmark"
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
                }`}
              aria-label="Bookmark"
              title="Bookmark this PDF"
            >
              <Bookmark className="w-5 h-5 text-gray-600" />
            </Button>
          </div>

          {/* Right Section - Zoom Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 bg-white"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-gray-600" />
            </Button>
            <span className="text-sm text-gray-600 font-medium min-w-[60px] text-center">
              {zoom}%
            </span>
            <Button
              variant="default"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 bg-white"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Page Counter */}
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600 font-medium">
            {currentPage} of {numPages}
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
            {selectedTool === "eraser"
              ? "Eraser mode active – select text to erase"
              : selectedTool === "pen"
                ? "Highlight mode active – select text to highlight"
                : `${selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)} mode active – select text to ${selectedTool}`}
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfReader;
