// // "use client";

// // import { useParams } from "next/navigation";
// // import dynamic from "next/dynamic";

// // // Dynamically import the flipbook PDF viewer (for client-side only)
// // const FlipBookViewer = dynamic(
// //   () => import("@/components/Student/Book/BookReader/PdfReader.tsx"),
// //   { ssr: false }
// // );

// // export default function BookReaderPage() {
// //   const params = useParams();
// //   const id = params.id as string;

// //   return (
// //     <main className="min-h-screen bg-gray-50">
// //       <FlipBookViewer bookId={id} />
// //     </main>
// //   );
// // }



// import PdfReader from '@/components/Student/Book/BookReader/PdfReader'
// import React from 'react'

// function page() {
//   return (
//     <div>
//         <PdfReader/>
//     </div>
//   )
// }

// export default page

import React from 'react';

const Page = () => {
    return (
        <div>

        </div>
    );
};

export default Page;