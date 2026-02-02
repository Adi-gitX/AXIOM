# Skills (formerly AXIOM) - Application Documentation

## 1. Executive Overview

**Skills** (internal codename **AXIOM**) is a unified "Command Center" for developer careers. It consolidates learning, DSA practice, interview preparation, job hunting, and professional networking into a single, high-performance web application.

The application is built as a **monorepo** containing a React frontend (`client`) and an Express/PostgreSQL backend (`server`).

## 2. Product Vision & Feature Details

### Why This App Exists (The Problem)
Developers today face a **fragmented ecosystem** when trying to grow their careers:
- **Scattered Learning:** Tutorials are spread across YouTube, Udemy, and docs without a cohesive path.
- **Fragmented Practice:** They use LeetCode for DSA, a separate site for mock interviews, and another for system design.
- **Disconnected Job Hunting:** Job boards are generic and don't integrate with a developer's actual skills or practice history.
- **Isolation:** Self-taught developers often lack a community to learn with.

### The Solution: A Unified Command Center
**Skills** solves this by centralizing the entire developer lifecycle into one beautiful, "Glassmorphism" styled interface. It is designed to be the **single platform** a developer logs into every day.

### Detailed Feature Breakdown

#### 1. **Dashboard** (`/app`)
- **Purpose:** The "Home Base" for the user.
- **Features:**
    - **Activity Heatmap:** Visualizes coding/study streak (similar to GitHub).
    - **Progress Stats:** Tracks DSA problems solved, hours studied, and interviews completed.
    - **Quick Actions:** Instant access to resume current courses or daily challenges.

#### 2. **Education Hub** (`/app/education`)
- **Purpose:** A structured learning environment.
- **Content:** Curated paths for Frontend, Backend, DevOps, and System Design.
- **Functionality:** Tracks progress through video courses (embedded) and text-based resources.

#### 3. **DSA Tracker** (`/app/dsa`)
- **Purpose:** To master Data Structures and Algorithms.
- **Methodology:** Based on **Striver's A2Z Sheet**.
- **Features:**
    - Topics organized by difficulty (Arrays, Trees, Graphs, DP).
    - Checkbox tracking for completed problems.
    - "Revision Mode" to flag difficult problems.

#### 4. **Interview Prep** (`/app/interview`)
- **Purpose:** Comprehensive preparation for technical interviews.
- **Modules:**
    - **Behavioral:** STAR method guides and common HR questions.
    - **System Design:** Scalability, Load Balancing, Database Sharding concepts.
    - **Resume Review:** checklists and templates.

#### 5. **Jobs Board** (`/app/jobs`)
- **Purpose:** A developer-first job finding experience.
- **Features:**
    - High-quality listings with salary transparency.
    - Filters for Remote, Contract, and Visa Sponsorship.
    - "Save Job" functionality to track applications.

#### 6. **Developer Connect** (`/app/connect`)
- **Purpose:** Real-time community interaction.
- **Channels:** General chat, specialized framework discussions (React, Node), and career advice.

#### 7. **User Profile** (`/app/profile`)
- **Purpose:** The developer's professional identity.
- **Features:**
    - **Bio & Socials:** Central link for GitHub, LinkedIn, Portfolio.
    - **Tech Stack:** Visual badges of known technologies.
    - **Experience Timeline:** Interactive work history display.
    - **Resume Upload:** Cloud-hosted PDF resume storage.

---

## 3. Technical Stack

### Frontend (`/client`)
- **Framework:** React 18 (Vite)
- **Styling:** TailwindCSS 3 + `tailwindcss-animate`
- **Animations:** Framer Motion (`framer-motion`, `motion`)
- **State Management:** Zustand
- **Routing:** React Router v6
- **Auth:** Firebase Authentication (Client SDK)
- **Icons:** Lucide React

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** PostgreSQL (using strict SQL queries via `pg` driver)
- **Security:** Helmet, Rate Limit, CORS
- **Environment:** `dotenvx` for secure env var management
- **Image Storage:** Cloudinary (Signed uploads)

---

## 4. Complete Folder Structure

### Root Directory
- `appideaprd.md` - Product Requirements Document.
- `client/` - Frontend application.
- `server/` - Backend API.
- `server_log.txt` - Server access logs.

### Client Structure (`/client/src`)
The frontend is organized cleanly by feature and function:

```text
client/src/
├── assets/          # Static assets (images, global styles)
├── components/      # Reusable UI components
│   ├── Layout.jsx   # Main App Layout (Sidebar + Header + Content)
│   └── ...          # Atoms/Molecules (Buttons, Cards, Modals)
├── contexts/        # React Contexts
│   └── AuthContext.jsx # Firebase Auth Provider
├── lib/             # Utilities
│   └── cloudinary.js # Cloudinary helper
├── pages/           # Main Route/Tab Views
│   ├── auth/        # Login/Signup Pages
│   ├── Dashboard.jsx
│   ├── DSATracker.jsx
│   ├── Education.jsx
│   ├── Jobs.jsx
│   ├── Profile.jsx
│   └── ... (See Tabs section)
├── stores/          # Zustand Stores
│   └── useUserStore.js # Global Client State
├── App.jsx          # Main Router Configuration
└── index.css        # Global Tailwind Directives
```

### Server Structure (`/server`)
The backend is a focused REST API:

```text
server/
├── config/
│   └── db.js        # PostgreSQL Connection Pool
├── controllers/
│   └── userController.js # Logic for Profiles, Cloudinary, DB Init
├── routes/
│   └── userRoutes.js # API Route Definitions
├── index.js         # Entry point, Middleware setup (CORS, Security)
└── reset_db.js      # Utility script to wipe/reset database
```

---

## 5. Tabs & Routing Structure

The application uses a **protected route wrapper** (`/app`) that ensures users are authenticated before accessing the core dashboard.

### Public Routes
- **`/`** - Landing Page (Hero, Features, Call to Action)
- **`/docs`** - Documentation View
- **`/pricing`** - Pricing Tier Information
- **`/login`** - Authentication (Login)
- **`/signup`** - Authentication (Registration)

### App Routes (Protected)
All these routes are rendered inside the Main Layout (Sidebar + Topbar):

| URL Path | Component | Description & Current Status |
|----------|-----------|------------------------------|
| `/app` | `Dashboard.jsx` | **Main Dashboard**. Shows stats heatmaps and quick links. |
| `/app/education` | `Education.jsx` | **Learning Hub**. Video courses and progress tracking. (Frontend Mock) |
| `/app/dsa` | `DSATracker.jsx` | **DSA Tracker**. Striver's A2Z DSA sheet progress. (Frontend Mock) |
| `/app/interview` | `InterviewPrep.jsx` | **Interview Prep**. Guides for system design & behavioral. (Frontend Mock) |
| `/app/connect` | `DeveloperConnect.jsx` | **Community Chat**. Real-time developer chat interface. (Frontend Mock) |
| `/app/jobs` | `Jobs.jsx` | **Job Board**. Listings with filtering. **Implementation:** Uses hardcoded `JOBS` array. |
| `/app/posts` | `Posts.jsx` | **Feed**. Developer news and articles. (Frontend Mock) |
| `/app/profile` | `Profile.jsx` | **User Profile**. **Implementation:** FULLY CONNECTED. Fetches/Updates via API. |
| `/app/settings` | `Settings.jsx` | **Settings**. App preferences (Theme, etc). |

---

## 6. Backend Implementation & Connectivity

### API Endpoints
The backend is currently focused on **User Management** and **Profile Persistence**. It exposes the following REST endpoints under `/api`:

| Method | Endpoint | Controller Function | Description |
|--------|----------|---------------------|-------------|
| **GET** | `/sign-cloudinary` | `getCloudinarySignature` | Generates secure signature for client-side image uploads. |
| **GET** | `/users/:email` | `getUserProfile` | Fetches full user profile (bio, skills, xp) from PostgreSQL. |
| **POST** | `/users/profile` | `updateUserProfile` | Upserts (Insert/Update) user profile data in Postgres. |
| **GET** | `/init-db` | `initDb` | **Admin Utility:** Drops and Re-creates the `users` table. |

### Database Schema
The application uses a relational schema in PostgreSQL.

#### Table: `users`
| Column | Type | Details |
|--------|------|---------|
| `id` | SERIAL | Primary Key |
| `email` | VARCHAR | Unique, Not Null |
| `name` | VARCHAR | Display Name |
| `role` | VARCHAR | Job Title (e.g. "Frontend Dev") |
| `location` | VARCHAR | City/State |
| `bio` | TEXT | About Me section |
| `avatar` | TEXT | Cloudinary URL |
| `banner` | TEXT | Cloudinary URL (Profile header) |
| `experience` | JSONB | Array of work history objects |
| `skills` | JSONB | Array of skills/tags |
| `socials` | JSONB | Social media links |
| `resume_url`| TEXT | Link to uploaded resume |
| `timestamps`| TIMESTAMP | `created_at`, `updated_at` |

### Connectivity
1.  **Client-Side State:** `useUserStore.js` (Zustand) manages the user state.
2.  **Data Fetching:** When `Profile.jsx` loads, it calls `fetchProfile(email)` from the store.
3.  **API Call:** The store makes an HTTP GET request to `/api/users/:email`.
4.  **Database:** The Express server queries the specific user in PostgreSQL.
5.  **Updates:** When saving profile changes, the store sends a POST to `/api/users/profile`, which writes to the database.

## 7. Current Implementation Status Summary

- **Authentication:** ✅ **Working.** (Firebase Auth handles login/signup).
- **Profile System:** ✅ **Working.** Full persistent profile with avatar uploads (Cloudinary) and data storage (Postgres).
- **Navigation/Routing:** ✅ **Working.** Smooth client-side routing with layout persistence.
- **UI/UX:** ✅ **Working.** High-fidelity "Glassmorphism" UI with dark mode and animations.
- **Jobs/Education/DSA:** ⚠️ **Partially Implemented.** The UI and interactions are built, but they utilize **mock data** on the frontend and are not yet connected to a backend database table.

## 8. How to Run

1.  **Backend:**
    ```bash
    cd server
    npm install
    npm run dev
    # Runs on http://localhost:3000
    ```

2.  **Frontend:**
    ```bash
    cd client
    npm install
    npm run dev
    # Runs on http://localhost:5173
    ```

Ensure `.env` files are set up in both directories with PostgreSQL credentials, Cloudinary keys, and Firebase config.
