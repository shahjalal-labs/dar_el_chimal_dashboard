// lib/pdfWorker.ts
import { pdfjs } from "react-pdf";

// ✅ Proper way to register worker in Next.js (ESM)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export { pdfjs };
