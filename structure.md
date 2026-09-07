# 📁 Project Structure

```bash
.
├── bun.lock
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public
│   ├── book.pdf
│   ├── file.svg
│   ├── firebase-messaging-sw.js
│   ├── globe.svg
│   ├── next.svg
│   ├── pdf.worker.min.js
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── src
│   ├── app
│   │   ├── account-create
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   └── proxy-pdf
│   │   │       └── route.ts
│   │   ├── (auth)
│   │   │   ├── forgot-password
│   │   │   │   └── page.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── otp
│   │   │   │   └── page.tsx
│   │   │   ├── register
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password
│   │   │   │   └── page.tsx
│   │   │   └── select-role
│   │   │       └── page.tsx
│   │   ├── (dashboard)
│   │   │   ├── admin
│   │   │   │   ├── announcements
│   │   │   │   │   ├── add-new-announcement
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── book-categories
│   │   │   │   │   ├── new-book-category
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── books
│   │   │   │   │   ├── add-new-book
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── book-overview
│   │   │   │   │   │   └── [id]
│   │   │   │   │   │       ├── page.tsx
│   │   │   │   │   │       ├── pdf
│   │   │   │   │   │       │   └── page.tsx
│   │   │   │   │   │       └── [resourceId]
│   │   │   │   │   │           └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── schools
│   │   │   │   │   ├── add-new-school
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── students
│   │   │   │   │   ├── add-new-student
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── teachers
│   │   │   │       ├── add-new-teacher
│   │   │   │       │   └── page.tsx
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── notifications
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── settings
│   │   │   │   └── page.tsx
│   │   │   ├── student
│   │   │   │   ├── announcments
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── assignments
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── books
│   │   │   │   │   ├── bookDetails
│   │   │   │   │   │   └── [id]
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── read
│   │   │   │   │       └── page.tsx
│   │   │   │   └── overview
│   │   │   │       └── page.tsx
│   │   │   └── teacher
│   │   │       └── classes
│   │   │           ├── books
│   │   │           │   ├── book-overview
│   │   │           │   │   └── [id]
│   │   │           │   │       ├── pdf
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       └── [resourceId]
│   │   │           │   │           └── page.tsx
│   │   │           │   └── [id]
│   │   │           │       ├── [bookId]
│   │   │           │       │   ├── page.tsx
│   │   │           │       │   ├── pdf
│   │   │           │       │   │   └── page.tsx
│   │   │           │       │   └── [resourceId]
│   │   │           │       │       └── page.tsx
│   │   │           │       └── page.tsx
│   │   │           ├── [id]
│   │   │           │   ├── add-new-announcement
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── add-new-assignment
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── announcements
│   │   │           │   │   ├── [announcmentId]
│   │   │           │   │   │   └── page.tsx
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── assignments
│   │   │           │   │   ├── [assignmentId]
│   │   │           │   │   │   ├── [assignmentProgressId]
│   │   │           │   │   │   │   └── page.tsx
│   │   │           │   │   │   └── page.tsx
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── page.tsx
│   │   │           │   └── students
│   │   │           │       └── page.tsx
│   │   │           └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── assets
│   │   ├── activeStudents.svg
│   │   ├── adminStatFour.svg
│   │   ├── adminStatOne.svg
│   │   ├── adminStatThree.svg
│   │   ├── adminStatTwo.svg
│   │   ├── assignedBooks.svg
│   │   ├── attach_file_add.svg
│   │   ├── authLogo.svg
│   │   ├── Avatar (1).svg
│   │   ├── Avatar (2).svg
│   │   ├── Avatar (3).svg
│   │   ├── Avatar (4).svg
│   │   ├── Avatar (5).svg
│   │   ├── Avatar (6).svg
│   │   ├── Avatar (7).svg
│   │   ├── Avatar.svg
│   │   ├── default.png
│   │   ├── docs.svg
│   │   ├── line.svg
│   │   ├── link.svg
│   │   ├── logo.svg
│   │   ├── mp.svg
│   │   ├── no-img.jpg
│   │   ├── notFound.jpg
│   │   ├── pdfIcon
│   │   │   ├── pdf1.png
│   │   │   ├── pdf2.png
│   │   │   ├── pdf3.png
│   │   │   ├── pdf4.png
│   │   │   ├── pdf5.png
│   │   │   ├── pdf6.png
│   │   │   ├── pdf7.png
│   │   │   └── pdf8.png
│   │   ├── school.png
│   │   ├── student
│   │   │   ├── anoucment.png
│   │   │   ├── assignments.png
│   │   │   ├── book.png
│   │   │   ├── calender.png
│   │   │   └── link-04.png
│   │   ├── totalAnoucments.svg
│   │   ├── totalAssignments.svg
│   │   ├── totalBooks.svg
│   │   ├── totalLinks.svg
│   │   ├── totalStudents.svg
│   │   ├── uploadImg.svg
│   │   └── User.png
│   ├── components
│   │   ├── Admin
│   │   │   ├── Announcement
│   │   │   │   ├── AddNewAnnouncement.tsx
│   │   │   │   ├── AnnouncementList.tsx
│   │   │   │   ├── UpdateAnnouncement.tsx
│   │   │   │   └── ViewAnnouncement.tsx
│   │   │   ├── BookCategories
│   │   │   │   ├── BookCategoryList.tsx
│   │   │   │   ├── NewBookCategory.tsx
│   │   │   │   ├── UpdateBookCategoryModal.tsx
│   │   │   │   └── ViewBookCategoryModal.tsx
│   │   │   ├── Books
│   │   │   │   ├── AddNewBook
│   │   │   │   │   ├── AddNewBook.tsx
│   │   │   │   │   ├── General.tsx
│   │   │   │   │   ├── Grade.tsx
│   │   │   │   │   └── Resource.tsx
│   │   │   │   ├── BookOverview.tsx
│   │   │   │   ├── Books.tsx
│   │   │   │   ├── PDF.tsx
│   │   │   │   ├── Resources
│   │   │   │   │   ├── ResourceDetails.tsx
│   │   │   │   │   └── UpdateResource.tsx
│   │   │   │   └── UpdateBookModal.tsx
│   │   │   ├── Schools
│   │   │   │   ├── AddNewSchool
│   │   │   │   │   ├── AddGradeSection.tsx
│   │   │   │   │   ├── AddNewSchool.tsx
│   │   │   │   │   ├── General.tsx
│   │   │   │   │   └── Resource.tsx
│   │   │   │   ├── SchoolList.tsx
│   │   │   │   ├── UpdateGradeSection.tsx
│   │   │   │   ├── UpdateSchoolModal.tsx
│   │   │   │   └── ViewSchoolModal.tsx
│   │   │   ├── Students
│   │   │   │   ├── AddNewStudent
│   │   │   │   │   ├── AddNewStudent.tsx
│   │   │   │   │   ├── CreateStudentModal.tsx
│   │   │   │   │   ├── General.tsx
│   │   │   │   │   ├── Grade.tsx
│   │   │   │   │   ├── ShowBulkStudentsModal.tsx
│   │   │   │   │   └── UpdateGradeSection.tsx
│   │   │   │   ├── StudentList.tsx
│   │   │   │   ├── UpdateStudentModal.tsx
│   │   │   │   └── ViewStudentModal.tsx
│   │   │   └── Teachers
│   │   │       ├── AddNewTeacher
│   │   │       │   ├── AddNewTeacher.tsx
│   │   │       │   ├── CreateTeacherModal.tsx
│   │   │       │   ├── General.tsx
│   │   │       │   ├── Grade.tsx
│   │   │       │   └── ShowBulkTeachersModal.tsx
│   │   │       ├── TeacherList.tsx
│   │   │       ├── UpdateGradeSection.tsx
│   │   │       ├── UpdateTeacherModal.tsx
│   │   │       └── ViewTeacherModal.tsx
│   │   ├── Auth
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── LeftSide.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── OtpPage.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ResetPassword.tsx
│   │   │   └── SelectRole.tsx
│   │   ├── Common
│   │   │   ├── CustomPagination.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── GetBookCategory.tsx
│   │   │   └── GetSchools.tsx
│   │   ├── DashboardLayout
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── DashboardStat.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── StudentTable.tsx
│   │   │   └── TeacherRingChart.tsx
│   │   ├── Navbar
│   │   │   ├── NavbarSlider.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── TopNavbar.tsx
│   │   ├── RoleGaurd.tsx
│   │   ├── Settings
│   │   │   ├── AccountSection.tsx
│   │   │   ├── BasicSection.tsx
│   │   │   ├── Notifications.tsx
│   │   │   └── Settings.tsx
│   │   ├── Student
│   │   │   ├── Announcments
│   │   │   │   ├── AnnouncementCard.tsx
│   │   │   │   └── AnnouncementDetail.tsx
│   │   │   ├── Assignment
│   │   │   │   ├── AssignmentDetailView.tsx
│   │   │   │   ├── AssignmentModal.tsx
│   │   │   │   └── Assignment.tsx
│   │   │   ├── Book
│   │   │   │   ├── BookList.tsx
│   │   │   │   ├── BookReader
│   │   │   │   │   └── PdfReader.tsx
│   │   │   │   └── BooksOverview
│   │   │   │       ├── Attachments.tsx
│   │   │   │       └── GeneralOverview.tsx
│   │   │   └── Overview
│   │   │       └── StatCard.tsx
│   │   ├── Teacher
│   │   │   ├── AddNewAnnouncement.tsx
│   │   │   ├── AddNewAssignment.tsx
│   │   │   ├── Announcements.tsx
│   │   │   ├── AssignmentDetails.tsx
│   │   │   ├── Assignments.tsx
│   │   │   ├── BookOverview.tsx
│   │   │   ├── Books.tsx
│   │   │   ├── ClassDetails.tsx
│   │   │   ├── Classes.tsx
│   │   │   ├── GradeStudentAssignmentModal.tsx
│   │   │   ├── PDF.tsx
│   │   │   ├── ResourceDetails.tsx
│   │   │   ├── Resource.tsx
│   │   │   ├── StudentAssignment.tsx
│   │   │   ├── Students.tsx
│   │   │   ├── UpdateAnnouncement.tsx
│   │   │   ├── ViewAnnouncement.tsx
│   │   │   └── ViewStudentDetailsModal.tsx
│   │   └── ui
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── confirmation.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── ImageUploader.tsx
│   │       ├── Input-Otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── tooltip.tsx
│   │       └── UploadVideo.tsx
│   ├── lib
│   │   ├── data.ts
│   │   ├── firebase.ts
│   │   ├── formateTimeStamp.ts
│   │   ├── pdfWorkerSetup.ts
│   │   ├── type.ts
│   │   └── utils.ts
│   ├── middleware.ts
│   ├── react-pdf.d.ts
│   ├── redux
│   │   ├── api
│   │   │   ├── admin.ts
│   │   │   ├── announcement.ts
│   │   │   ├── authApi.ts
│   │   │   ├── baseApi.ts
│   │   │   ├── bookCategory.ts
│   │   │   ├── book.ts
│   │   │   ├── grade.ts
│   │   │   ├── notificationApi.ts
│   │   │   ├── resource.ts
│   │   │   ├── school.ts
│   │   │   ├── settingsApi.ts
│   │   │   ├── student
│   │   │   │   ├── assignmentApi.ts
│   │   │   │   ├── booksApi.ts
│   │   │   │   └── overviewApi.ts
│   │   │   ├── student.ts
│   │   │   ├── teacher
│   │   │   │   └── overviewApi.ts
│   │   │   └── teacher.ts
│   │   ├── features
│   │   │   ├── announcementSlice.ts
│   │   │   ├── authSlice.ts
│   │   │   ├── bookSlice.ts
│   │   │   ├── rootReducer.ts
│   │   │   ├── schoolSlice.ts
│   │   │   ├── studentSlice.ts
│   │   │   ├── teacherSlice.ts
│   │   │   └── uiSlice.ts
│   │   ├── provider
│   │   │   └── ReduxProvider.tsx
│   │   └── store
│   │       └── store.ts
│   └── types
│       ├── pdfjs-dist.d.ts
│       └── react-pageflip.d.ts
└── tsconfig.json

103 directories, 279 files

```
