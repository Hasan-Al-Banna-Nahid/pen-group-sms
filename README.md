# Student Management System (SMS) - Registry Module

## 1. Project Overview & Fulfillment
The **SMS Registry Module** is a focused web application developed as a technical assessment for PEN Global, simulating the core daily workflows of a Registry Administrator. Built using the **Next.js 14 App Router**, **Prisma ORM**, and **PostgreSQL (hosted on Neon Serverless)**, this application avoids mocked data and operates entirely on a live relational database layer.

### Core Workflow Coverage:
1. **Student Enrolment:** Centralized administrative workspace to onboard students with automated, conflict-free unique ID generation and robust multi-parameter search/filter capabilities.
2. **Fees & Payments:** Dynamic ledger architecture tracking program-specific tuition fees, recording payments, and monitoring outstanding balances in real time.
3. **Assessment Submission:** Secure academic hub allowing students to upload files against active assessment deadlines with built-in late detection protocols.
4. **Marksheet & Results:** Complete grading desk for staff to enter numeric scores and a compliance-gated result access panel for students.

### Advanced "Feature Intuition" Implementation (Edge Cases):
Adhering to real-world registry constraints, the system handles complex operational edge cases natively:
* **Overdue Fee Flags:** Students with unpaid fees past internal deadlines are automatically flagged with a visual status on the staff dashboard.
* **Late Submission Enforcements:** Submissions past the absolute assessment deadline are structurally stamped as `isLate: true` within the database while remaining accepted, ensuring strict academic tracking.
* **Result Withholding Protocol:** Implements a critical business checkpoint. If a student's profile is caught in a financial deficit, their academic marksheet is dynamically masked with a secure "Withheld" notification until their ledger is settled.

---

## 2. Architecture & Interconnections

### Data Model & Relational Integrity
The application relies on a strictly normalized relational database schema via Prisma:
* **Student & Programme:** A one-to-many relationship where a student's assigned `Programme` determines their mandatory base fee structure automatically.
* **Payment Ledger:** Individual `Payment` records tie directly back to a `Student`, dynamically subtracting sums from the core fee to expose real-time outstanding balances.
* **Academic Records:** The `Grade`, `Assessment`, and `Submission` models intersect cleanly, mapping performance and submission time vectors against specific student entries.

### State Management & Reactivity
* **Refresh-Free UI Lifecycle:** Driven entirely by **TanStack Query (React Query) v5**. Client-side state mutations (such as completing a payment or committing a grade) explicitly trigger targeted cache invalidations (`queryClient.invalidateQueries`) to fetch pristine state without forcing heavy browser refreshes.
* **Loading States:** Implements standardized skeleton screens and discrete UI micro-spinners ensuring zero friction during asynchronous network round-trips.

### Role-Based Access Control (RBAC)
The frontend utilizes a lightweight `useRole` context provider mimicking a basic split authorization layer:
* **Staff View:** Unlocks global administrative operations (enrolling records, tracking financial ledgers, grading sheets, and publishing results).
* **Student View:** Safely restricts data scopes to personalized, read-only profiles, active assignment uploads, and compliance-checked results.

---

## 3. Folder & Component Breakdown

### `/registry` - Student Administration
* **Logic:** Employs an atomic transaction pattern utilizing a `YearlySequence` counter block to ensure sequential, non-colliding identity numbers prefixed by the active year (e.g., `SMS-2026-0001`).
* **UI:** Features a high-fidelity directory displaying status badges limited strictly to official enums: `Enrolled`, `Deferred`, `Withdrawn`, and `Completed`.

### `/payments` - Financial Ledger
* **Logic:** Enforces a rigid "Auto-Settlement" boundary. When a transaction zeroes out the student's outstanding balance, the repository safely transitions their state to `SETTLED`, and the UI instantly converts payment actions into a disabled, unclickable "Account Settled" badge to prevent overpayments.
* **UI:** A pristine financial ledger detailing credit history and debit balance rollups.

### `/assessments` - Academic Submission Portal
* **Logic:** Validates incoming file blobs exclusively against `.pdf` and `.docx` mime types. One file is permitted per assessment, allowing full overrides up until the deadline.
* **Validation:** Powered by server-side **Zod** configurations protecting the boundary from malicious or malformed parameters.

### `/results` - Performance & Compliance
* **Logic:** Automates grade tier classification directly upon numeric input (Pass $\ge 40$, Merit $\ge 60$, Distinction $\ge 70$). It prevents raw leaks by evaluating the `isPublished` toggle alongside the student's overall financial liability.

---

## 4. Technical Quality & Performance

* **Input Safety:** Every incoming API request payload passes a structural validation gate backed by Zod before executing Database interactions.
* **UI Design Language:** Crafted using a premium, light-themed design token system heavily inspired by Google and Vercel ecosystems. Employs wide whitespace, clean micro-borders, and **Framer Motion** choreographies for responsive, tactile feedback.

---

## 5. Local Setup Instructions

### Prerequisites
* **Node.js** (v18.x or higher)
* **PostgreSQL Engine** (Local server or Neon cloud provider)

### Steps to Run
1. **Clone the repository and install dependencies:**
   ```bash
   npm install
