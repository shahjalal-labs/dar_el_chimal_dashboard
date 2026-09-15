"use client";

import { PDFViewer, PDFViewerRef } from "@embedpdf/react-pdf-viewer";
import { useRef, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { usePathname } from "next/navigation";
import { getOptimizedPdfUrl } from "@/lib/pdfUtils";

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
  const injectShadowStyles = useCallback(
    (container: HTMLElement | null) => {
      if (!container || !container.shadowRoot || !shouldHide) return;
      const styleId = "embedpdf-no-print-export";
      if (!container.shadowRoot.getElementById(styleId)) {
        const styleEl = document.createElement("style");
        styleEl.id = styleId;
        styleEl.textContent = `
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
        `;
        container.shadowRoot.appendChild(styleEl);
      }
    },
    [shouldHide]
  );

  useEffect(() => {
    if (!shouldHide) return;

    // Observe shadowRoot to continuously ensure Print & Export remain hidden even when menus re-render
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

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [shouldHide, injectShadowStyles]);

  return (
    <div
      className="h-[90%] w-full overflow-hidden rounded-xl border border-gray-300 shadow-lg dark:border-gray-600 bg-white dark:bg-gray-900 select-none"
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
      <PDFViewer
        ref={viewerRef}
        config={{
          src: optimizedUrl,
          theme: { preference: themePreference },
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
          if (shouldHide) {
            injectShadowStyles(container);
          }
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default PdfReader;
