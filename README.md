# 📚 Dar El Chimal — K-12 School E-Learning LMS & Curriculum Portal

![UI Architecture Banner](./assets/banner.svg)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js_15" />
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React_18" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Turbopack-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Turbopack" />
  <img src="https://img.shields.io/badge/Ant_Design-0170FE?style=for-the-badge&logo=antdesign&logoColor=white" alt="Ant_Design" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind_CSS" />
  <img src="https://img.shields.io/badge/School_LMS-3B82F6?style=for-the-badge&logo=book-open&logoColor=white" alt="School_LMS" />
  
</p>

---

## 📌 Executive Overview

**Dar El Chimal Dashboard** is an enterprise-grade academic learning management system (LMS) and curriculum distribution portal designed for school networks, educators, and students. Built with **Next.js 15 (Turbopack, App Router)**, the platform coordinates multi-school administration, digital textbook distribution, classroom assignments, grade reporting, and student-teacher academic communication.

---

## 🚀 Key Engineering & Domain Capabilities

- **Multi-School Administration**: Centralized oversight for school campuses, student enrollments, and teacher rosters.
- **Digital Textbook & Curriculum Publishing**: Categorized book repositories with grade-level academic curriculum distribution.
- **Teacher-Student Classroom Hub**: Interactive assignment submissions, teacher grading rubrics, and feedback workflows.
- **Next.js 15 App Router Architecture**: Route grouping `(auth)`, `(dashboard)/admin`, `(dashboard)/teacher`, and `(dashboard)/student` with Turbopack acceleration.
- **Enterprise Data Tables**: Server-paginated Ant Design tables with multi-field search and academic record filtering.

---

## 🏛️ Application Architecture & Route Tree

```plaintext
dar_el_chimal_dashboard/
├── assets/
│   └── banner.svg                     # High-resolution architectural banner
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Sign-in & academic portal authentication
│   │   ├── (dashboard)/
│   │   │   ├── admin/                 # Schools, teachers, students, books, categories
│   │   │   ├── teacher/               # Class schedules, student assignments, grading
│   │   │   ├── student/               # Enrolled courses, textbook reader, submissions
│   │   │   ├── notifications/         # School announcements & academic alerts
│   │   │   └── settings/              # Campus profiles & system preferences
│   │   ├── layout.tsx                 # Root layout with Ant Design & theme providers
│   │   └── globals.css                # Tailwind CSS styling
│   ├── components/                    # Modular UI components (Books, Classrooms, Grids)
│   └── redux/                         # RTK Query API slices & global state
├── package.json                       # Next.js 15.5.9, React 18, Ant Design
└── tsconfig.json
```

---

## 💻 Tech Stack Specification

| Layer | Technologies |
|---|---|
| **Framework** | **Next.js 15** (App Router, Turbopack, Server/Client Components) |
| **UI Components** | Ant Design, Lucide Icons, Custom Tailwind Primitives |
| **State Management** | Redux Toolkit (RTK), RTK Query API Caching |
| **Styling** | Tailwind CSS 3.4, PostCSS, Responsive Mobile-First Theme |
| **Language** | TypeScript 5 (Strict Mode) |

---

## 🛠️ Getting Started & Local Development

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: `npm`, `yarn`, or `pnpm`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shahjalal-labs/dar_el_chimal_dashboard.git
cd dar_el_chimal_dashboard
npm install
```

### 2. Configure Environment Variables
Create a local `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Run Development Server (Turbopack)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 👨‍💻 Engineering & Authorship

Developed and engineered by **Md. Shahjalal**.

* **GitHub**: [@shahjalal-labs](https://github.com/shahjalal-labs)
* **Email**: [muhommodshahjalal@gmail.com](mailto:muhommodshahjalal@gmail.com)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
