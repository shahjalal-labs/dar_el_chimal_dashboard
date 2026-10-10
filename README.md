# 📚 Dar El Chimal — Publishing & Document Enterprise Portal

![UI Architecture Banner](./assets/banner.svg)

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind_CSS" />
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix_UI" />
  <img src="https://img.shields.io/badge/PDF_Viewer-F59E0B?style=for-the-badge&logo=filetext&logoColor=white" alt="PDF_Viewer" />
  
</p>

---

## 📌 Executive Overview

Dar El Chimal Dashboard is a corporate publishing and distribution management system. It provides manuscript ingestion, catalog metadata management, royalty tracking, and an integrated high-performance PDF viewer.

---

## 🚀 Key Frontend Engineering Highlights

- **In-Browser Document Rendering**: Integrated high-speed PDF reader with text search, zoom, and page thumbnails.
- **Catalog & ISBN Management**: Comprehensive publication records, author royalties, and inventory tiers.
- **Order & Distribution Dispatch**: Wholesale bulk shipment orders and international freight manifests.
- **Accessible Primitives**: Dialog modals, dropdown menus, and popovers engineered with Radix UI.
- **Performance Engineered**: Lazy-loaded module chunks and optimized asset streaming.

---

## 📂 Project Architecture

```plaintext
dar_el_chimal_dashboard/
├── assets/
│   └── banner.svg         # UI architecture visual banner
├── src/
│   ├── components/        # Reusable design system primitives & UI atoms
│   ├── pages/ or app/     # Application routes & layouts
│   ├── hooks/             # Custom React hooks & state encapsulation
│   ├── services/          # API client endpoints & HTTP adapters
│   └── styles/            # Tailwind CSS configurations & themes
├── public/                # Static assets & icons
├── package.json
└── tsconfig.json
```

---

## 🛠️ Quickstart & Local Setup

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shahjalal-labs/dar_el_chimal_dashboard.git
cd dar_el_chimal_dashboard
npm install
```

### 2. Environment Configuration
Create a local `.env` file if required:
```bash
cp .env.example .env 2>/dev/null || true
```

### 3. Run Development Server
```bash
npm run dev
```

Application will launch locally at `http://localhost:3000` or `http://localhost:5173`.

---

## 👨‍💻 Engineering & Authorship

Developed and maintained by **Md. Shahjalal**.

* **GitHub**: [@shahjalal-labs](https://github.com/shahjalal-labs)
* **Email**: [muhommodshahjalal@gmail.com](mailto:muhommodshahjalal@gmail.com)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
