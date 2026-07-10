Smart AI Job Tracker

A modern, intelligent job application tracking system built with React, TypeScript, and Fastify. Features AI-powered job recommendations, comprehensive application tracking, and a clean UI design.

Features
Core Features
Application Tracking Pipeline with status flow from Applied to Interview to Offer or Rejected
Add and update applications with detailed information
Status change history with timeline tracking
Notes section for each application
AI job recommendations based on resume skills
Modern UI with smooth interactions
Technical Features
Responsive design for desktop and mobile
Real-time updates
Smart filtering by skills, location, job type
Statistics dashboard for tracking progress
AI assistant for job insights and interview tips
Quick Start
Prerequisites
Node.js 18+
Installation
Clone the repository
git clone <repository-url>
cd smart-match
Install dependencies
npm install

cd backend/src
npm install

cd ../../
npm install
Running the Application
Start backend
cd backend/src
npm run dev

Backend runs on:

http://localhost:3001
Start frontend
npm run dev

Frontend runs on:

http://localhost:5173
Open in browser
http://localhost:5173
smart-match/
├── backend/src/
│   ├── src/
│   │   ├── lib/
│   │   ├── routes/
│   │   └── index.ts
│   ├── .env
│   └── package.json
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── store/
│   └── App.tsx
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── README.md
Usage Guide
Upload Resume
Go to Resume page
Upload PDF resume
Skills are extracted automatically
Browse Jobs
Go to Jobs page
View recommendations
Apply filters
Track Applications
Use Applications page
Add or track applications
Manage Status
Update application status
Add notes
Monitor Progress
View dashboard statistics
Track progress over time
Technology Stack
Frontend
React 18
TypeScript
Vite
Tailwind CSS
Framer Motion
React Query
Wouter
Lucide React
Backend
Fastify
TypeScript
PDF-parse
Axios
OpenAI API
Adzuna API
Application Status Flow
Applied → Interview Scheduled → Interview Completed → Offer / Rejected
API Endpoints
Authentication
POST /api/auth/login
Jobs
GET /api/jobs
Resume
GET /api/resume
POST /api/upload-resume
Applications
GET /api/applications
POST /api/applications
PATCH /api/applications/:id/status
PATCH /api/applications/:id
AI Assistant
POST /api/ai-chat
