# Student Management System (SMS) - Registry Module

## 1. Project Overview & Fulfillment
The **SMS Registry Module** is a high-performance, enterprise-grade student management platform developed as a focused technical assessment for PEN Global. Built using the **Next.js 14 App Router**, **Prisma ORM**, and **PostgreSQL (hosted on Neon)**, this application demonstrates a robust architectural approach to handling complex educational workflows.

### Core Workflow Coverage:
1.  **Student Enrolment:** Centralized student directory with automated unique ID generation (`SMS-2026-XXXX`) and sophisticated search/filter capabilities.
2.  **Fees & Payments:** Real-time financial ledger tracking total fees, amounts paid, and outstanding balances.
3.  **Assessments:** Multi-file submission portal with strict validation (PDF/Docx) and server-side timestamping.
4.  **Results Management:** Comprehensive marksheet view for staff and personalized result views for students.

### "Feature Intuition" Implementation:
Beyond basic CRUD, the system implements advanced business logic to handle real-world scenarios:
*   **Overdue Fee Management:** Automated status updates (e.g., `CRITICAL_OVERDUE`) based on payment history.
*   **Late Submission Tracking:** Submissions are automatically flagged as "Late" if they exceed assessment deadlines.
*   **Result Withholding:** Students with critical financial arrears are restricted from viewing their grades—the UI dynamically masks marks until the balance is settled.

---

## 2. Architecture & Interconnections

### Data Model & Relational Integrity
The system employs a normalized relational schema to ensure data consistency:
*   **Student & Programme:** Students are linked to specific programmes which define their fee structures and tuition logic.
*   **Payment Ledger:** A robust `Payment` model tracks every transaction, feeding into the student's `financialStatus`.
*   **Academic Records:** `Grade`, `Assessment`, and `Submission` models are interconnected to provide a 360-degree view of student performance and compliance.

### State Management
We utilize **TanStack Query (React Query)** for server state management. This ensures:
*   **Real-time Synchronization:** CRUD operations trigger targeted cache invalidation, updating the UI without full page refreshes.
*   **Optimistic Updates:** Enhances perceived performance during payment recording and assessment submissions.
*   **Loading/Error States:** Elegant handling of asynchronous operations using standardized UI skeletons.

### Role-Based Access Control (RBAC)
The application implements a `useRole` context provider that allows seamless toggling between **Staff** and **Student** perspectives:
*   **Staff:** Full administrative access (Enrol students, record payments, grade assessments).
*   **Student:** Read-only access to personal financial records and academic results (subject to fee compliance).

---

## 3. Folder & Component Breakdown

### `/registry` - Student Administration
*   **Logic:** Features a custom `studentIdGenerator` that combines the current year with a database-backed sequence to prevent collisions.
*   **UI:** A high-fidelity student list with status badges (`Active`, `Suspended`, etc.) and a powerful search engine.

### `/payments` - Financial Ledger
*   **Logic:** Implements "Auto-Settlement" logic. When a student's balance reaches $0, the "Record Payment" functionality is programmatically disabled to prevent overpayment.
*   **Visuals:** A ledger-style table showing the history of credits and debits.

### `/assessments` - Academic Submission Portal
*   **Logic:** Enforces file type restrictions (PDF, DOCX) and records `submittedAt` timestamps directly on the server to prevent client-side manipulation.
*   **Validation:** Uses Zod schemas for rigorous server-side validation of assessment data.

### `/results` - Performance & Compliance
*   **Withheld Logic:** Grades are conditionally rendered. If the student's `financialStatus` is `CRITICAL_OVERDUE`, the results are masked with a professional "Withheld" notification, prompting payment.

---

## 4. Technical Quality & Performance

*   **Server-Side Validation:** Every API route is protected by **Zod**, ensuring that only sanitized, correctly typed data enters the database.
*   **Performance Optimization:** PostgreSQL queries are optimized via Prisma's efficient indexing. The application leverages Next.js Server Components to minimize client-side JavaScript.
*   **Premium UI/UX:** The interface follows a minimalist, "Google-like" design language. **Framer Motion** is used for subtle, professional animations that provide interactive feedback.
*   **Edge Case Handling:** The system prevents duplicate submissions, handles overpayment scenarios, and maintains audit trails for all financial transactions.

---

## 5. Local Setup Instructions

### Prerequisites
*   **Node.js** (v18.x or higher)
*   **PostgreSQL** (or a Neon.tech account)

### Steps to Run
1.  **Clone the repository and install dependencies:**
    ```bash
    npm install
    ```
2.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    DATABASE_URL="postgresql://neondb_owner:npg_OB8b3DdYVmQC@ep-late-sea-apszu5xg-pooler.c-7.us-east-1.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require"
    ```
3.  **Initialize the Database:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```
4.  **Seed the System:**
    Run the seed script to populate the database with 5 demo students, 2 programmes, and pre-configured financial/grade data:
    ```bash
    npx tsx prisma/seed.ts
    ```
5.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    Access the app at [http://localhost:3000](http://localhost:3000).

---

## 6. AI Usage Documentation

This project leveraged Artificial Intelligence to accelerate development and ensure high technical standards:
*   **Architectural Planning:** AI assisted in designing the multi-file Prisma schema and optimizing relational mappings between financial and academic models.
*   **Debugging:** Complex Prisma relations and TanStack Query cache invalidation strategies were refined through AI-driven diagnostic analysis.
*   **UI Component Fidelity:** High-fidelity Tailwind CSS and Framer Motion components were generated with AI assistance to achieve a premium aesthetic while maintaining accessibility standards.
*   **Logic Verification:** AI was used to peer-review the "Withheld Results" and "Late Submission" business logic to ensure it adhered to the assessment requirements.

*Final human ownership was maintained over all business logic, data integrity, and architectural decisions.*
