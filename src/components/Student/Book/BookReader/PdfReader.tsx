"use client";

import { PDFViewer, PDFViewerRef } from "@embedpdf/react-pdf-viewer";
import { useRef, useEffect, useMemo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { usePathname } from "next/navigation";
import { getOptimizedPdfUrl } from "@/lib/pdfUtils";
import { PiSpinner } from "react-icons/pi";

interface PdfReaderProps {
  pdfUrl: string;
  bookId?: string | number;
  totalPages?: number;
  isButton?: boolean;
  useStreaming?: boolean;
  hideDownloadAndPrint?: boolean;
}

const PdfReader = ({ pdfUrl, hideDownloadAndPrint }: PdfReaderProps) => {
  const viewerRef = useRef<PDFViewerRef>(null);
  const themePreference: "light" | "dark" = "light";
  const pathname = usePathname();
  const authRole = useSelector((state: RootState) => state.auth.role);
  const [isReady, setIsReady] = useState(false);

  // Automatically optimize the PDF URL to high-speed CDN
  const optimizedUrl = useMemo(() => {
    return getOptimizedPdfUrl(pdfUrl);
  }, [pdfUrl]);

  // Determine if Print & Download/Export should be hidden
  const shouldHide = useMemo(() => {
    if (typeof hideDownloadAndPrint === "boolean") {
      return hideDownloadAndPrint;
    }
    const roleLower = authRole ? String(authRole).toLowerCase() : "";
    if (roleLower === "student" || roleLower === "teacher") {
      return true;
    }
    if (pathname?.startsWith("/student") || pathname?.startsWith("/teacher")) {
      return true;
    }
    if (roleLower === "admin" || pathname?.startsWith("/admin")) {
      return false;
    }
    // Default to true for copyright safety
    return true;
  }, [hideDownloadAndPrint, authRole, pathname]);

  // Update theme when preference changes
  useEffect(() => {
    viewerRef.current?.container?.setTheme({ preference: themePreference });
  }, [themePreference]);

  // Inject strict CSS into Shadow DOM to hide print & export in all menus & toolbars
  // and guarantee :host and embedpdf-snippet-root have 100% height
  const injectShadowStyles = useCallback(
    (container: HTMLElement | null) => {
      if (!container) return;
      container.style.display = "block";
      container.style.width = "100%";
      container.style.height = "100%";

      if (!container.shadowRoot) return;
      const styleId = "embedpdf-overrides";
      let styleEl = container.shadowRoot.getElementById(styleId) as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        container.shadowRoot.appendChild(styleEl);
      }
      styleEl.textContent = `
        :host {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          min-height: 100% !important;
        }
        .embedpdf-snippet-root {
          width: 100% !important;
          height: 100% !important;
          min-height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
        }
        ${
          shouldHide
            ? `
          [data-epdf-i="document:print"],
          [data-epdf-cat~="document-print"],
          [data-epdf-cat~="print"],
          [data-epdf-i="document:export"],
          [data-epdf-cat~="document-export"],
          [data-epdf-cat~="export"],
          [data-epdf-i="print-button"],
          [data-epdf-i="print-modal"] {
            display: none !important;
          }
        `
            : ""
        }
      `;
    },
    [shouldHide]
  );

  useEffect(() => {
    // Observe shadowRoot to continuously ensure Print & Export and Height remain applied
    const container = viewerRef.current?.container;
    if (container) {
      injectShadowStyles(container);
    }

    const interval = setInterval(() => {
      if (viewerRef.current?.container) {
        injectShadowStyles(viewerRef.current.container);
      }
    }, 500);

    // Prevent Ctrl+P, Cmd+P, Ctrl+S, Cmd+S keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (shouldHide) {
      window.addEventListener("keydown", handleKeyDown, true);
    }

    return () => {
      clearInterval(interval);
      if (shouldHide) {
        window.removeEventListener("keydown", handleKeyDown, true);
      }
    };
  }, [shouldHide, injectShadowStyles]);

  return (
    <div
      className="relative h-full min-h-[550px] w-full overflow-hidden rounded-xl border border-gray-300 shadow-lg dark:border-gray-600 bg-white dark:bg-gray-900 select-none flex flex-col"
      onContextMenu={(e) => {
        if (shouldHide) {
          e.preventDefault();
        }
      }}
    >
      {shouldHide && (
        <style jsx global>{`
          @media print {
            body {
              display: none !important;
            }
          }
        `}</style>
      )}

      {!isReady && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm pointer-events-none">
          <PiSpinner className="h-8 w-8 animate-spin text-[#1E3A8A] mb-2" />
          <span className="text-sm font-medium text-gray-700">Loading book...</span>
        </div>
      )}

      {optimizedUrl ? (
        <PDFViewer
          key={optimizedUrl}
          ref={viewerRef}
          config={{
            src: optimizedUrl,
            theme: { preference: themePreference },
            fontFallback: null,
            worker: true,
            ...(shouldHide
              ? {
                  disabledCategories: [
                    "document-print",
                    "document-export",
                    "print",
                    "export",
                  ],
                  permissions: {
                    enforceDocumentPermissions: true,
                    overrides: {
                      print: false,
                      copyContents: false,
                    },
                  },
                }
              : {}),
          }}
          onInit={(container) => {
            injectShadowStyles(container);
          }}
          onReady={() => {
            setIsReady(true);
          }}
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-500">
          No PDF URL provided.
        </div>
      )}
    </div>
  );
};

export default PdfReader;
