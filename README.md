<p align="center">
  <img src="docs/assets/tanuai-banner.png" alt="TanuAI Banner" width="600" />
</p>

<p align="center">
  <strong>An AI career companion built to simplify the job search.</strong>
</p>

<p align="center">
  <a href="https://react.dev/"><img alt="React" src="https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/typescript-5-3178C6?logo=typescript&logoColor=white" /></a>
  <a href="https://fastify.dev/"><img alt="Fastify" src="https://img.shields.io/badge/fastify-node-black?logo=fastify&logoColor=white" /></a>
  <a href="https://vercel.com/"><img alt="Vercel" src="https://img.shields.io/badge/frontend-vercel-black?logo=vercel&logoColor=white" /></a>
  <a href="https://render.com/"><img alt="Render" src="https://img.shields.io/badge/backend-render-46E3B7?logo=render&logoColor=white" /></a>
  <a href="https://openrouter.ai/"><img alt="AI: OpenRouter" src="https://img.shields.io/badge/ai-openrouter-purple" /></a>
</p>

<p align="center">
  <a href="https://tanu-ai.vercel.app/">live demo</a> ·
  <a href="#-overview">overview</a> ·
  <a href="#-features">features</a> ·
  <a href="#-technology">technology</a> ·
  <a href="#-quick-start">quick start</a> ·
  <a href="#-documentation">documentation</a>
</p>

---

## 📌 overview

**TanuAI** is an AI-powered career companion that brings the job-search workflow into one focused workspace.

It combines application tracking, resume management, job discovery, job matching, and AI assistance so users can spend less time organizing their search and more time applying and preparing.

---

## ✨ highlights

|    | Feature                  | Description                                                 |
| -- | ------------------------ | ----------------------------------------------------------- |
| 📋 | **Application tracking** | Manage applications through a structured status workflow    |
| 🤖 | **AI career assistant**  | AI-powered assistance throughout the career-search workflow |
| 📄 | **Resume intelligence**  | Upload resumes and extract relevant skills                  |
| 🔎 | **Job discovery**        | Discover opportunities through the Adzuna API               |
| 🎯 | **Smart matching**       | Match opportunities with career information                 |
| 📝 | **Application history**  | Keep notes and application information organized            |
| 📊 | **Progress dashboard**   | Track application activity and progress                     |
| 📱 | **Responsive UI**        | Modern interface across screen sizes                        |

---

## 🛠️ technology

| Layer             | Technology                               |
| ----------------- | ---------------------------------------- |
| **Frontend**      | React 18, TypeScript, Vite, Tailwind CSS |
| **Data fetching** | TanStack React Query                     |
| **Backend**       | Fastify, Node.js, TypeScript             |
| **AI**            | OpenRouter, LangChain                    |
| **Job data**      | Adzuna API                               |
| **Deployment**    | Vercel + Render                          |

---

## 🖥️ web dashboard

The dashboard brings the core job-search workflow into one place — applications, opportunities, career information, progress, and AI assistance.

<p align="center">
  <img src="docs/assets/web-dashboard.png" alt="TanuAI Web Dashboard" width="850" />
</p>

**Live demo:** https://tanu-ai.vercel.app/

---

## 🚀 quick start

### prerequisites

* Node.js
* npm
* API credentials for the external services used by the application

### 1. clone

```bash
git clone https://github.com/helloayushhh/tanu-ai.git
cd tanu-ai
```

### 2. install dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 3. configure environment variables

Add the required API credentials to the backend environment.

> Keep API keys out of source control.

### 4. run backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:3001
```

### 5. run frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 📁 project structure

```text
tanu-ai/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── store/
│       ├── lib/
│       └── assets/
│
├── backend/
│   └── src/
│       ├── routes/
│       ├── lib/
│       ├── data/
│       └── index.ts
│
├── docs/
│   ├── assets/
│   ├── Tanu_BRD_v1.0.docx
│   ├── Tanu_PRD_v1.0.docx
│   └── Tanu_TRD_v1.0.docx
│
├── README.md
└── project_journey.md
```

---

## 📚 documentation

The project is documented beyond this README:

* **BRD** — business problem, users, objectives, and scope
* **PRD** — product requirements and user flows
* **TRD** — technical requirements and implementation direction
* **Project Journey** — phase-by-phase development process
* **Assets** — dashboard and project visuals

Detailed documentation is available in `docs/` and `project_journey.md`.

---

## ☁️ deployment

| Component    | Platform   |
| ------------ | ---------- |
| **Frontend** | Vercel     |
| **Backend**  | Render     |
| **AI**       | OpenRouter |
| **Job data** | Adzuna API |

**Live application:** https://tanu-ai.vercel.app/

**Backend API:** https://tanu-api-z8ei.onrender.com

---

## 📈 current status

**Completed and deployed.**

The current version represents the completed project scope. Future ideas are listed separately and are not presented as existing features.

---

## 🔭 next possibilities

* ATS resume scoring
* AI resume feedback
* Cover letter generation
* Interview preparation
* Company insights
* Personalized career roadmaps

---

## 🔗 project links

* **Live:** https://tanu-ai.vercel.app/
* **Repository:** https://github.com/helloayushhh/tanu-ai
* **Backend:** https://tanu-api-z8ei.onrender.com

---

see you in the next build.

**— aps**
