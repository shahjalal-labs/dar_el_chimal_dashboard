/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// types/pdfjs-dist.d.ts
declare module 'pdfjs-dist/build/pdf' {
  const pdfjsLib: any;
  export = pdfjsLib;
}

declare module 'pdfjs-dist/build/pdf.worker.entry' {
  const workerSrc: string;
  export = workerSrc;
}