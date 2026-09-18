# tanu ai — project journey

> an ai career companion built to make job hunting a little less overwhelming.

---

## project goal

tanu ai started with a simple problem: job searching often means managing information across job portals, resumes, spreadsheets, notes and interview preparation tools.

the goal was to bring the most important parts of that workflow into a single workspace.

the project combines job discovery, resume management, application tracking and ai-powered career assistance in one full-stack application.

---

## phase 1 — problem & product planning

status: completed

activities:

* identified the problem of scattered job-search information.

* defined students and job seekers as the primary users.

* focused on practical job-search workflows rather than building only an ai chatbot.

* defined the core product areas: applications, resumes, jobs, dashboard and ai assistance.

* translated the initial problem into product requirements and user flows.

---

## phase 2 — product & technical documentation

status: completed

documentation:

```text
docs/

├── Tanu_BRD_v1.0.docx
├── Tanu_PRD_v1.0.docx
└── Tanu_TRD_v1.0.docx
```

activities:

* documented the business problem and product scope.

* defined product requirements and primary user flows.

* documented the technical direction and implementation requirements.

* kept the documentation alongside the project as the product evolved.

---

## phase 3 — frontend foundation

status: completed

technology:

```text
react
typescript
vite
tailwind css
tanstack react query
wouter
zustand
```

activities:

* built the application interface using react and typescript.

* created the main application pages and reusable components.

* added responsive layouts for desktop and mobile.

* implemented client-side data fetching and application state management.

* added interactive ui elements, animations and feedback states.

---

## phase 4 — backend foundation

status: completed

technology:

```text
node.js
fastify
typescript
```

activities:

* built the backend as a separate fastify service.

* created api routes for authentication, jobs, resumes, applications and ai chat.

* added multipart support for resume uploads.

* added cors configuration for frontend-backend communication.

* configured the server to use the deployment-provided port and host.

* separated backend functionality into routes and supporting modules.

main api areas:

```text
/api/auth/login
/api/jobs
/api/resume
/api/upload-resume
/api/applications
/api/applications/:id/status
/api/applications/:id
/api/ai-chat
```

---

## phase 5 — application tracking

status: completed

objective:

give users one place to manage the applications they are actively pursuing.

implemented:

* application listing and tracking.

* kanban-style application workflow.

* application creation and editing.

* application status updates.

* application notes.

* status history and timeline handling.

* dashboard statistics based on application activity.

application workflow:

```text
applied → interview scheduled → interview completed → offer / rejected
```

application statuses can be updated as the application progresses.

---

## phase 6 — resume management

status: completed

implemented:

* pdf resume upload.

* resume text extraction on the backend.

* skill extraction from the uploaded resume.

* resume information exposed through the application api.

* resume data used as an input for job matching.

---

## phase 7 — job discovery & matching

status: completed

integration:

```text
adzuna api
```

implemented:

* job search through the adzuna api.

* job listing display.

* filtering by role, location, job type, work mode and skills.

* date-posted filtering.

* minimum match-score filtering.

* job recommendation and matching flow using resume skills.

---

## phase 8 — ai integration

status: completed

technology:

```text
openrouter
langchain
openai-compatible api
```

activities:

* integrated ai capabilities through openrouter using an openai-compatible api.

* implemented an ai career assistant.

* added ai-based job matching logic.

* used resume skills and job information to generate matching insights.

* added conversational support for job-search and career-related questions.

* configured ai credentials through environment variables instead of committing secrets.

---

## phase 9 — production configuration

status: completed

activities:

* separated frontend and backend deployment configuration.

* moved api endpoints and credentials to environment variables.

* configured the frontend to use the production backend url.

* configured ai and job-api credentials on the backend.

* kept api keys out of the repository.

frontend environment variable:

```text
VITE_API_URL
```

backend environment variables:

```text
ai provider credentials
adzuna api credentials
ai provider base url
```

---

## phase 10 — deployment

status: completed

frontend:

```text
vercel
```

backend:

```text
render
```

production architecture:

```text
user
  │
  ▼
react frontend
  │
  │ https requests
  ▼
fastify backend
  │
  ├── adzuna api
  │
  └── openrouter
       │
       └── ai model
```

production frontend:

```text
https://tanu-ai.vercel.app
```

production backend:

```text
https://tanu-api-z8ei.onrender.com
```

activities:

* deployed the react frontend to vercel.

* deployed the fastify backend to render.

* connected the production frontend to the deployed backend.

* configured production environment variables.

* verified that the deployed application loads and communicates with the backend.

* verified that adzuna job search works in production.

---

## phase 11 — testing & completion

status: completed

activities:

* tested the deployed frontend.

* verified frontend-to-backend communication.

* verified the backend health endpoint.

* verified adzuna integration after production configuration.

* checked the main application flows during deployment.

* fixed production api configuration so frontend requests correctly target the deployed render backend instead of a hardcoded local endpoint.

---

## final product

tanu ai is a deployed full-stack ai career companion that brings several parts of the job-search workflow into one application.

current capabilities include:

* job discovery through adzuna.

* resume pdf upload and skill extraction.

* ai-powered career assistance.

* ai-based job matching.

* application tracking.

* kanban-style application workflow.

* application notes and status history.

* dashboard statistics.

* responsive react interface.

* fastify backend api.

* production deployment on vercel and render.

---

## current architecture

```text
tanu ai
│
├── frontend
│   ├── react
│   ├── typescript
│   ├── vite
│   ├── tailwind css
│   ├── tanstack react query
│   ├── wouter
│   └── zustand
│
├── backend
│   ├── fastify
│   ├── typescript
│   ├── authentication api
│   ├── resume parsing
│   ├── application api
│   ├── jobs api
│   └── ai api
│
└── integrations
    ├── adzuna
    ├── openrouter
    └── langchain
```
