"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Use CDN for the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
}

export default function PDFViewer({ pdfUrl, onClose }: PDFViewerProps) {
  console.log("pdfurl", pdfUrl);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">PDF Viewer</h2>
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Close
          </button>
        </div>

        <Document
          // file={pdfUrl}
          file="https://nyc3.digitaloceanspaces.com/smtech-space/the-time-machine.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p>Loading PDF...</p>}
          error={<p className="text-red-500">Failed to load PDF.</p>}
        >
          <Page pageNumber={pageNumber} scale={1.5} />
        </Document>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() =>
              setPageNumber(Math.min(pageNumber + 1, numPages || 1))
            }
            disabled={pageNumber >= (numPages || 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
