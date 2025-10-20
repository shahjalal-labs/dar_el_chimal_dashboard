// "use client"
// import React, { useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

// // Configure PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const PdfReader = () => {
//     const [numPages, setNumPages] = useState(null);
//     const [pageNumber, setPageNumber] = useState(1);

//     function onDocumentLoadSuccess({ numPages }) {
//         setNumPages(numPages);
//     }

//     return (
//         <div className="pdf-container">
//             <div className="pdf-viewer">
//                 <Document
//                     file="https://arxiv.org/pdf/quant-ph/0410100.pdf"
//                     onLoadSuccess={onDocumentLoadSuccess}
//                     onLoadError={(error) => console.error('Error loading PDF:', error)}
//                 >
//                     <Page 
//                         pageNumber={pageNumber} 
//                         width={800}
//                     />
//                 </Document>
//             </div>
//             <div className="pdf-controls">
//                 <button 
//                     onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
//                     disabled={pageNumber <= 1}
//                 >
//                     Previous
//                 </button>
//                 <span>
//                     Page {pageNumber} of {numPages}
//                 </span>
//                 <button 
//                     onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
//                     disabled={pageNumber >= numPages}
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default PdfReader;