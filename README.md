# Student Management System (SMS)

This is a comprehensive Student Management System designed to streamline academic and administrative processes for educational institutions. It provides functionalities for managing student registrations, academic assessments, grades, modules, payments, and submissions.

## Features

*   **Student Registration & Management:** Register new students, view student details, and perform administrative actions.
*   **Assessment Creation & Grading:** Create and manage academic assessments, and assign grades to student submissions.
*   **Module Management:** Organize and track academic modules offered to students.
*   **Payment Tracking:** Record and manage student payments and financial transactions.
*   **Submission Handling:** Facilitate and track student submissions for assessments.

## Technologies Used

This project leverages a modern web development stack to deliver a robust and scalable application.

*   **Frontend:**
    *   [Next.js](https://nextjs.org/): React framework for building server-rendered and static web applications.
    *   [React](https://react.dev/): A JavaScript library for building user interfaces.
    *   [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
    *   [Shadcn UI](https://ui.shadcn.com/): Reusable UI components built with Tailwind CSS and Radix UI.
    *   [Radix UI](https://www.radix-ui.com/): Low-level UI component library for building accessible design systems.
*   **State Management:**
    *   [React Query (TanStack Query)](https://tanstack.com/query/latest): Powerful asynchronous state management for React.
    *   [Redux Toolkit](https://redux-toolkit.js.org/): Opinionated, batteries-included toolset for efficient Redux development.
*   **Backend & Database:**
    *   [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/api-routes): Backend API endpoints powered by Next.js.
    *   [Prisma](https://www.prisma.io/): Next-generation ORM for Node.js and TypeScript.
    *   [PostgreSQL](https://www.postgresql.org/): Powerful, open-source object-relational database system.
*   **Validation:**
    *   [Zod](https://zod.dev/): TypeScript-first schema declaration and validation library.
    *   [React Hook Form](https://react-hook-form.com/): Performant, flexible, and extensible forms with easy-to-use validation.
*   **Utilities:**
    *   `clsx`: A tiny utility for constructing `className` strings conditionally.
    *   `tailwind-merge`: Merges Tailwind CSS classes without style conflicts.
    *   `date-fns`: Modern JavaScript date utility library.
    *   `lucide-react`: A collection of simply beautiful open-source icons.
    *   `sonner`: An opinionated toast component for React.
*   **Development Tools:**
    *   [TypeScript](https://www.typescriptlang.org/): Strongly typed JavaScript.
    *   [ESLint](https://eslint.org/): Pluggable JavaScript linter.
    *   [Jest](https://jestjs.io/): Delightful JavaScript Testing Framework.
    *   `tsx`: TypeScript execute for Node.js.
    *   `dotenv`: Loads environment variables from a `.env` file.

## Folder Structure

The project follows a well-organized structure to separate concerns and facilitate maintainability.

```
.
├── app/                  # Next.js app directory for pages, API routes, and components
│   ├── api/              # Backend API routes
│   │   ├── assessments/  # API for assessment management
│   │   ├── grade/        # API for grading operations
│   │   ├── modules/      # API for module management
│   │   ├── payments/     # API for payment tracking
│   │   ├── students/     # API for student management (including [id] for specific student actions)
│   │   └── submissions/  # API for submission handling
│   ├── assessments/      # Frontend pages related to assessments
│   ├── components/       # Reusable UI components specific to the app directory
│   │   ├── assessment/   # Components for assessment-related UI
│   │   ├── layout/       # Layout components (e.g., Navbar, RoleToggle)
│   │   └── registry/     # Components for student registry UI
│   ├── context/          # React Context providers (e.g., role-context.tsx)
│   ├── hooks/            # Custom React hooks for data fetching and logic
│   ├── providers/        # Global providers (e.g., QueryProvider for React Query)
│   └── registry/         # Frontend pages related to student registry
├── components/           # General UI components (Shadcn UI overrides/extensions)
│   └── ui/               # Shadcn UI components (e.g., button, dialog, input, table)
├── lib/                  # Utility functions, configurations, and validations
│   ├── financial-logic.ts# Business logic for financial calculations
│   ├── prisma.ts         # Prisma client initialization
│   ├── utils.ts          # General utility functions
│   └── validations/      # Zod schemas for data validation
│       └── student.ts    # Student data validation schema
├── prisma/               # Prisma schema definitions and database migrations
│   ├── schema/           # Individual Prisma schema files for different models
│   │   ├── assessment.prisma
│   │   ├── enums.prisma
│   │   ├── grade.prisma
│   │   ├── module.prisma
│   │   ├── payment.prisma
│   │   ├── schema.prisma
│   │   ├── student.prisma
│   │   └── submission.prisma
│   ├── migrations/       # Database migration files
│   └── seed.ts           # Script for seeding initial database data
├── public/               # Static assets (images, etc.)
└── ...                   # Other configuration files (.gitignore, package.json, tsconfig.json, etc.)
```

## API Endpoints

The following API endpoints are available for interacting with the system:

*   **`/api/assessments`**:
    *   `GET`: Retrieve all assessments.
    *   `POST`: Create a new assessment.
*   **`/api/grade`**:
    *   `POST`: Submit grades for an assessment.
*   **`/api/modules`**:
    *   `GET`: Retrieve all modules.
    *   `POST`: Create a new module.
*   **`/api/payments`**:
    *   `GET`: Retrieve all payments.
    *   `POST`: Record a new payment.
*   **`/api/students`**:
    *   `GET`: Retrieve all students.
    *   `POST`: Register a new student.
*   **`/api/students/[id]`**:
    *   `GET`: Retrieve a specific student by ID.
    *   `PUT`/`PATCH`: Update student information.
    *   `DELETE`: Delete a student record.
*   **`/api/submissions`**:
    *   `GET`: Retrieve all submissions.
    *   `POST`: Submit a new submission.

## Data Flow and Interconnections

The application follows a client-server architecture with clear separation of concerns:

1.  **Frontend (Next.js/React):**
    *   User interactions on pages (e.g., `app/assessments/page.tsx`, `app/registry/page.tsx`) trigger actions.
    *   These actions often utilize custom React hooks (e.g., `app/hooks/use-students`, `app/hooks/use-assessments`) for data fetching and mutations.
    *   `@tanstack/react-query` manages the caching, synchronization, and revalidation of server state, simplifying data handling.
    *   UI components from `app/components/` and `components/ui/` are used to build interactive user interfaces.
    *   Forms are handled using `react-hook-form` with validation schemas defined by `zod` (`lib/validations`).
    *   Global state like user roles might be managed through React Context (`app/context/role-context.tsx`).

2.  **Backend (Next.js API Routes):**
    *   Frontend requests (e.g., `GET`, `POST`, `PUT`, `DELETE`) are sent to the corresponding API routes in `app/api/`.
    *   These API routes are responsible for handling business logic, validating incoming data (often using `zod`), and interacting with the database.

3.  **Database (Prisma/PostgreSQL):**
    *   The Prisma client (`lib/prisma.ts`) acts as an ORM, abstracting database interactions within the API routes.
    *   Database schemas are defined in `prisma/schema/` (e.g., `student.prisma`, `assessment.prisma`), and `prisma migrate` is used to manage schema changes.
    *   `prisma/seed.ts` provides initial data for the database.

## Getting Started

To get a copy of the project up and running on your local machine for development and testing purposes, follow these steps.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   PostgreSQL database

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd sms
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root of the project based on `.env.example` (if available, otherwise refer to the Prisma setup for database connection string).
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/sms_db"
    NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET" # Recommended for NextAuth if used
    NEXT_PUBLIC_APP_URL="http://localhost:3000" # Your application's public URL
    ```
    *Replace `user`, `password`, and `sms_db` with your PostgreSQL credentials.*

4.  **Database Setup:**
    Run Prisma migrations to create the database schema:
    ```bash
    npx prisma migrate dev --name init
    ```
    Seed the database with initial data (optional):
    ```bash
    npx prisma db seed
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
2.  Open your browser and navigate to `http://localhost:3000`.

## Scripts

*   `npm run dev`: Starts the Next.js development server.
*   `npm run build`: Creates a production build of the application.
*   `npm run start`: Starts the Next.js production server.
*   `npm run lint`: Runs ESLint to check for code style issues.
*   `npx prisma migrate dev`: Runs Prisma migrations.
*   `npx prisma db seed`: Seeds the database.

 the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
2.  Open your browser and navigate to `http://localhost:3000`.

## Scripts

*   `npm run dev`: Starts the Next.js development server.
*   `npm run build`: Creates a production build of the application.
*   `npm run start`: Starts the Next.js production server.
*   `npm run lint`: Runs ESLint to check for code style issues.
*   `npx prisma migrate dev`: Runs Prisma migrations.
*   `npx prisma db seed`: Seeds the database.

