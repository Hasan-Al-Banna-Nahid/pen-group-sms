# Student Management System (SMS)

This is a Student Management System (SMS) built with Next.js, React, Prisma, and a PostgreSQL database. It allows for the management of student enrollments, assessments, grades, payments, and submissions. The application is designed to support both student and staff roles, with different functionalities available based on the authenticated user's role.

## Features

The SMS provides the following key features:

### Student Management
- **Student Enrollment:** Register new students with details such as full name, email, date of birth, academic year, and programme.
- **Student ID Generation:** Automatic generation of unique student IDs.
- **Fee Management:** Tracks total fees and fee amounts for each student, integrated with programme base fees.
- **Student Records:** View and manage student profiles, including their enrolled programme, academic status, grades, payments, and submissions.

### Assessment Management
- **Assessment Creation:** Staff can create and manage assessments, specifying title, maximum marks, weightage, module, and submission deadline.
- **Submission Handling:** Students can upload their assessment submissions (e.g., PDF files).
- **Grading:** Staff can grade student submissions, record scores, and publish grades.
- **Late Submission Detection:** The system automatically flags late submissions.
- **Grade Classification:** Grades are classified (e.g., Distinction, Merit, Pass, Fail) based on scores.

### Module Management
- **Module Definition:** Define academic modules with unique codes, names, and credit values.
- **Module-Assessment Linking:** Link assessments to specific modules.

### Payment Management
- **Payment Recording:** Record student payments with amount, date, and reference.
- **Financial Tracking:** Integrate payment information with student records to track outstanding fees.

### Role-Based Access Control
- **Staff Role:** Access to administrative functions like student enrollment, assessment grading, and data management.
- **Student Role:** Access to view personal academic records, submit assessments, and check grades.
- **Role Toggle:** A UI mechanism to switch between Staff and Student views for demonstration/testing purposes.

## Architecture

The application follows a modern full-stack architecture:

### 1. Frontend (UI)

-   **Framework:** Next.js with React.
-   **Styling:** Utilizes Tailwind CSS and `shadcn/ui` for a responsive and consistent user interface.
-   **State Management:**
    -   **`react-query`**: For efficient data fetching, caching, and synchronization with the backend API. It handles loading states, error handling, and data invalidation.
    -   **`useContext`**: For global state management, such as the `RoleContext` which manages the current user role (Staff/Student).
-   **Components:** Modular and reusable React components (e.g., `AssessmentCard`, `EnrolmentDialog`, `StudentList`) designed for specific functionalities.
    -   **Example: `AssessmentCard`**: Displays assessment details, handles student selection, shows submission status, allows staff to grade, and enables students to submit/resubmit files. It dynamically adjusts its appearance and functionality based on the `useRole` context.
-   **Hooks:** Custom hooks like `useStudents` and `useEnrolStudent` encapsulate API interactions and `react-query` logic, promoting reusability and cleaner component code.

### 2. Backend (API)

-   **Framework:** Next.js API Routes.
-   **Database Interaction:** Uses Prisma Client to interact with the PostgreSQL database.
-   **API Endpoints:**
    -   `GET /api/students`: Fetches all student records, including their payment information.
    -   `POST /api/students`: Enrols a new student, generates a unique student ID, and sets initial fees based on the selected programme.
    -   `GET /api/students/[id]`: Retrieves a specific student's details.
    -   `GET /api/students/[id]/results`: Fetches assessment results for a specific student.
    -   `GET /api/assessments`: Retrieves a list of all assessments.
    -   `POST /api/assessments`: Creates a new assessment.
    -   `GET /api/grade`: Fetches grading information.
    -   `POST /api/grade`: Records and publishes a student's grade for an assessment.
    -   `POST /api/submissions`: Handles student assessment file uploads.
    -   `GET /api/modules`: Fetches all academic modules.
    -   `GET /api/payments`: Fetches payment records.
    -   `GET /api/registry/search`: Provides search functionality within the student registry.
-   **Input Validation:** Utilizes `zod` for robust schema validation of API request bodies (e.g., `enrolmentSchema` for student registration).
-   **Error Handling:** Consistent error response handling for API failures.

### 3. Data Model (Database)

-   **ORM:** Prisma ORM for type-safe database access.
-   **Database:** PostgreSQL.
-   **Schema Definition:** Defined across multiple `.prisma` files and composed into `schema.prisma`.
    -   **`Student`**: Stores student personal information, enrollment details, programme affiliation, fees, and links to grades, payments, and submissions.
    -   **`Programme`**: Defines academic programmes with their names and base fees.
    -   **`Module`**: Represents academic modules with codes, names, and credits.
    -   **`Assessment`**: Contains assessment details (title, marks, weightage, deadline) and links to modules, grades, and submissions.
    -   **`Submission`**: Records student submissions, including file URL, submission time, and links to students and assessments.
    -   **`Grade`**: Stores a student's score, feedback, classification, and links to students and assessments. Includes flags for publication and late submission.
    -   **`Payment`**: Records individual payments made by students.
    -   **`YearlySequence`**: Used for generating unique sequential IDs (e.g., student IDs) per year.
    -   **`EnrolmentStatus` (Enum)**: Defines possible statuses for student enrollment (ENROLLED, DEFERRED, WITHDRAWN, COMPLETED).
    -   **`Classification` (Enum)**: Defines grade classifications (DISTINCTION, MERIT, PASS, FAIL).

## How the Application Works

The application orchestrates these components to provide a seamless experience:

1.  **User Interaction:**
    -   When a user (Staff or Student) interacts with the UI (e.g., navigating to the Registry page or an Assessment page), React components render.
    -   The `useRole` context determines which UI elements and functionalities are visible and active.

2.  **Data Flow (Frontend to Backend):**
    -   **Data Fetching:** Components use `react-query` hooks (e.g., `useStudents`, `useQuery` for assessments) to send `GET` requests to the Next.js API routes (e.g., `/api/students`, `/api/assessments`).
    -   **Data Submission:** When a user performs an action that requires data persistence (e.g., enrolling a student, grading an assessment, uploading a submission), `react-query` mutations (e.g., `useEnrolStudent`, `gradingMutation`, `uploadMutation`) send `POST` requests to the appropriate API routes (e.g., `/api/students`, `/api/grade`, `/api/submissions`).
    -   **Form Data:** For file uploads, `FormData` is used to send the file along with metadata.

3.  **Backend Processing:**
    -   Next.js API routes receive the requests.
    -   Input data is validated using `zod`.
    -   Prisma Client is used to perform CRUD operations on the PostgreSQL database based on the request (e.g., `prisma.student.create`, `prisma.student.findMany`, `prisma.$transaction` for complex operations).
    -   Business logic, such as `generateStudentId` and fee calculation, is executed.
    -   The API returns a `NextResponse` with the processed data or an error message.

4.  **Data Flow (Backend to Frontend):**
    -   Upon a successful API response, `react-query` automatically updates its cache and re-renders the relevant UI components with the fresh data (e.g., invalidating `["students"]` query after a new student is enrolled).
    -   `sonner` toast notifications provide real-time feedback to the user about the success or failure of operations.
    -   The UI dynamically updates to reflect changes in student data, assessment statuses, and grades.

### Interconnections

-   **Student-Programme:** Students are optionally linked to a Programme, which dictates their base fee.
-   **Student-Assessment-Grade-Submission:** A student's academic journey is tracked through their submissions to assessments and the grades they receive. Each grade and submission is uniquely tied to both a student and an assessment.
-   **Student-Payment:** Financial records (payments) are directly associated with students.
-   **Module-Assessment:** Assessments are organized under specific academic modules.
-   **`useRole` Context:** This context acts as a central switch, modifying the behavior and visibility of various UI components (e.g., `AssessmentCard`) and potentially API interactions based on whether the current user is a Staff member or a Student.
-   **`react-query` Cache Invalidation:** Key to keeping the frontend synchronized with the backend. After any data modification (e.g., a new grade is posted), relevant queries are invalidated to trigger a refetch, ensuring the UI always displays the latest information.

## Getting Started

*(Further instructions for setting up the environment, installing dependencies, running migrations, seeding the database, and starting the development server would go here.)*

---
This `README.md` provides a high-level overview of the SMS application, covering its features, architectural components, and how they interact.
