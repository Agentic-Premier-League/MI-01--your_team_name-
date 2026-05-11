# 🚀 TalentPlatform AI — Autonomous Hiring & Talent Intelligence Platform

> An AI-powered hiring platform that automates candidate screening, talent ranking, interview workflows, AI communication, recruitment analytics, and intelligent rejection feedback.

🌐 **Live Demo:** [https://talent-platform-ai.vercel.app/login](https://talent-platform-ai.vercel.app/login)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture & Workflow](#architecture--workflow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Test Credentials](#test-credentials)
- [Deployment](#deployment)
- [Innovative Feature](#innovative-feature)

---

## Overview

TalentPlatform AI is a full-stack web application designed to streamline the end-to-end recruitment process. It serves two types of users — **Recruiters** and **Candidates** — each with a dedicated dashboard and workflow. The platform leverages **OpenAI GPT-4o** to automate resume screening, generate rejection feedback, and power a context-aware candidate chatbot.

---

## Key Features

### 1. 🔍 AI Candidate Screening
When a candidate applies for a job, their resume is automatically evaluated against the job description using GPT-4o. A **match score (0–100)** is generated. Candidates scoring below 70% are auto-rejected with a 50-word AI-generated feedback explaining the skill gaps.

### 2. 📊 Talent Ranking
Recruiters can view all applicants for a job, **ranked by AI match score** from highest to lowest. This enables quick identification of the best-fit candidates.

### 3. 📋 Interview Workflow Management
Full application lifecycle tracking with status transitions:
```
Applied → Shortlisted → InInterview → Hired / Rejected
                ↘ ScreeningRejected (auto, if score < 70%)
                                      ↘ InterviewRejected (manual, with AI feedback)
```

### 4. 🤖 AI Communication (Chatbot)
Candidates can open a **context-aware AI chatbot** on any application. The chatbot has access to the specific job description and the candidate's resume, providing personalized answers about the role, requirements, and fit.

### 5. 📈 Recruitment Analytics
Interactive **Pie Chart** on the Recruiter Dashboard showing real-time breakdown of all application statuses (Applied, Shortlisted, InInterview, Hired, ScreeningRejected, InterviewRejected).

### 6. 💡 Innovative Feature: AI-Assisted Rejection Feedback
When a recruiter rejects a candidate after an interview, they provide three simple inputs:
- **Technical Score** (1–5)
- **Knowledge Gap** (1–5)
- **Brief Comment**

The AI transforms these terse data points into a **professional, empathetic, and constructive 3-paragraph rejection summary** that the candidate can view on their dashboard. This bridges the feedback gap that exists in most hiring processes.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite 8, React Router v7  |
| Backend    | Node.js, Express 5                 |
| Database   | MongoDB Atlas (Mongoose ODM)        |
| AI         | OpenAI GPT-4o                       |
| Auth       | JWT (JSON Web Tokens)               |
| Charts     | Recharts                            |
| Icons      | Lucide React                        |
| Deployment | Vercel (Serverless Functions)       |

---

## Architecture & Workflow

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Login Page   │  │  Recruiter   │  │  Candidate   │  │
│  │  (Auth)       │  │  Dashboard   │  │  Dashboard   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│         └─────────────────┼──────────────────┘          │
│                           │ API Calls (Axios)           │
└───────────────────────────┼─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                BACKEND (Express + Node.js)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Auth    │  │  Jobs    │  │  Applications        │  │
│  │  Routes  │  │  Routes  │  │  Routes + AI Agents  │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
│       │              │                   │              │
│       ▼              ▼                   ▼              │
│  ┌─────────────────────────────────────────────────┐    │
│  │          MongoDB Atlas (Mongoose)               │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │          OpenAI GPT-4o (3 AI Agents)            │    │
│  │  • Screening Agent (resume vs JD scoring)       │    │
│  │  • Feedback Agent  (rejection summaries)        │    │
│  │  • Chat Agent      (candidate Q&A chatbot)      │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### User Flow

#### Recruiter Flow
1. **Register/Login** as a Recruiter
2. **Post Jobs** with title, description, and requirements
3. **View Analytics** — Pie chart showing application status distribution
4. **View Candidates** — Ranked by AI match score
5. **Manage Workflow** — Move candidates through stages (Shortlist → Interview → Hire/Reject)
6. **Reject with AI Feedback** — Provide scores, AI generates professional rejection letter

#### Candidate Flow
1. **Register/Login** as a Candidate
2. **Browse Jobs** — View all available positions
3. **Apply** — Submit resume text and notes
4. **AI Screening** — Instant scoring and feedback
5. **Track Applications** — View status and feedback on dashboard
6. **AI Chatbot** — Ask questions about any role you've applied to

---

## Project Structure

```
MI-01--your_team_name-/
├── api/
│   └── index.js              # Vercel serverless entry point
├── backend/
│   ├── models/
│   │   ├── User.js            # User schema (username, password, role)
│   │   ├── Job.js             # Job schema (title, description, requirements)
│   │   └── Application.js     # Application schema (status, matchScore, feedback)
│   ├── app.js                 # Express app (routes, middleware, AI integration)
│   ├── ai.js                  # OpenAI GPT-4o integration (3 AI agents)
│   ├── server.js              # Local dev entry point (app.listen)
│   ├── seed.js                # MongoDB seeder script
│   ├── data.json              # Local JSON database (for offline testing)
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx # JWT auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login/Register page
│   │   │   ├── RecruiterDashboard.jsx  # Analytics + Job posting
│   │   │   ├── CandidateDashboard.jsx  # Job browsing + Applications + Chatbot
│   │   │   └── JobDetails.jsx          # Candidate ranking + Status management
│   │   ├── config.js           # API base URL (auto-detects dev vs prod)
│   │   ├── App.jsx             # React Router setup
│   │   └── index.css           # Dark theme styling
│   └── package.json
├── vercel.json                 # Vercel deployment configuration
├── package.json                # Root dependencies (for Vercel serverless)
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- OpenAI API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/Agentic-Premier-League/MI-01--your_team_name-.git
cd MI-01--your_team_name-

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `backend/.env` file:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
USE_JSON_DB=true   # Set to 'false' to use MongoDB
```

### Seed Dummy Data

```bash
# For JSON mode (no MongoDB needed)
cd backend
node generateJsonData.js

# For MongoDB mode
node seed.js
```

### Run Locally

```bash
# Terminal 1: Start backend
cd backend
node server.js

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Endpoint                              | Auth | Description                          |
|--------|---------------------------------------|------|--------------------------------------|
| POST   | `/api/auth/register`                  | No   | Register a new user                  |
| POST   | `/api/auth/login`                     | No   | Login and receive JWT token          |
| GET    | `/api/jobs`                           | Yes  | List jobs (filtered by role)         |
| POST   | `/api/jobs`                           | Yes  | Create a new job (recruiter only)    |
| GET    | `/api/jobs/:id`                       | Yes  | Get job details                      |
| GET    | `/api/jobs/:id/candidates`            | Yes  | Get ranked candidates for a job      |
| POST   | `/api/applications`                   | Yes  | Apply for a job (triggers AI screen) |
| GET    | `/api/applications/my`                | Yes  | Get candidate's own applications     |
| PUT    | `/api/applications/:id/status`        | Yes  | Update application status            |
| POST   | `/api/applications/:id/interview-reject` | Yes | Reject with AI feedback           |
| GET    | `/api/analytics`                      | Yes  | Get recruitment analytics            |
| POST   | `/api/chat`                           | Yes  | AI chatbot conversation              |

---

## Test Credentials

**Password for all accounts: `password123`**

| Role       | Usernames                                                                                   |
|------------|---------------------------------------------------------------------------------------------|
| Recruiter  | `recruiter_alice`, `recruiter_bob`, `recruiter_carol`                                       |
| Candidate  | `candidate_john`, `candidate_jane`, `candidate_alex`, `candidate_sarah`, `candidate_mike`   |
| Candidate  | `candidate_emily`, `candidate_david`, `candidate_lisa`, `candidate_tom`, `candidate_emma`   |

---

## Deployment

The application is deployed on **Vercel** as a single project:

- **Frontend** → Static build served from `frontend/dist`
- **Backend** → Vercel Serverless Function via `api/index.js`
- **Database** → MongoDB Atlas (cloud)

### Deploy Your Own

```bash
npm install -g vercel
vercel login
vercel --yes --prod
```

Set environment variables in Vercel dashboard:
- `MONGO_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `USE_JSON_DB=false`

---

## Innovative Feature

### 🧠 AI-Assisted Rejection Feedback System

Most hiring platforms end the process at "Rejected" — leaving candidates with no insight into why they were passed over. Our platform transforms this with an **AI Feedback Loop**:

1. **Recruiter inputs** 3 simple data points (Technical Score, Knowledge Gap, Comment)
2. **GPT-4o processes** these into a professional, empathetic rejection letter
3. **Candidate receives** actionable feedback on their dashboard

This creates a **win-win**: recruiters save time (no manual letter writing), and candidates gain valuable career development insights.

---

## License

ISC

---

Built with ❤️ for the Agentic Premier League Hackathon
