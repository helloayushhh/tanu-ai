# tanu
![react](https://img.shields.io/badge/react-18-blue)
![typescript](https://img.shields.io/badge/typescript-5-blue)
![fastify](https://img.shields.io/badge/fastify-node-black)
![vercel](https://img.shields.io/badge/deployed-vercel-black)
![render](https://img.shields.io/badge/backend-render-46E3B7)
![openrouter](https://img.shields.io/badge/ai-openrouter-purple)

🌐 **live demo:** https://tanu-ai.vercel.app/
⚙️ **backend api:** https://tanu-api-z8ei.onrender.com

an ai career companion built to simplify the job search.

instead of managing applications across spreadsheets, job portals and random notes, tanu brings everything into one place and helps you stay focused on what matters most.

---

## why i built this

job hunting can get messy very quickly.

while preparing for internships and placements, i realized i was spending more time organizing information than actually applying or preparing.

i wanted a workspace that could track every application, manage resumes, recommend relevant jobs and use ai to make the entire process smarter.

that's how tanu came to life.

---

## features

- application tracking with complete status workflow
- ai-powered career assistant
- resume upload and skill extraction
- personalized job recommendations
- smart job matching
- application notes and history
- progress dashboard with analytics
- responsive and modern interface

---

## tech stack

### frontend
- react
- typescript
- vite
- tailwind css
- tanstack react query

### backend
- fastify
- node.js
- typescript

### ai & integrations
- openrouter
- langchain
- adzuna api

### deployment
- vercel
- render

---

## project structure

```text
tanu-ai/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── lib/
│   │   └── assets/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── lib/
│   │   ├── data/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── Tanu_BRD_v1.0.docx
│   ├── Tanu_PRD_v1.0.docx
│   └── Tanu_TRD_v1.0.docx
│
├── .gitignore
├── README.md
└── project_journey.md
```

---

## getting started

clone the repository

```bash
git clone https://github.com/helloayushhh/tanu-ai.git
cd tanu-ai
```

install dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

run backend

```bash
cd backend
npm run dev
```

run the frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

frontend

```
http://localhost:5173
```

backend

```
http://localhost:3001
```

environment variables are required for the external services used by the application.

---

## documentation

the project is documented beyond this readme.

- **brd** — business problem, users and product scope
- **prd** — product requirements and user flows
- **trd** — technical requirements and implementation direction
- **project journey** — phase-by-phase development journey

the detailed documentation is available in the `docs/` folder and `project_journey.md`.

---

## deployment

the current version is deployed with:

- **frontend:** vercel
- **backend:** render
- **ai:** openrouter
- **job data:** adzuna api

---

## current status

**completed and deployed.**

the current version represents the completed scope of the project. future ideas are listed separately and are not presented as existing features.

---

## next possibilities

these are future ideas, not current features:

- ats resume scoring
- ai resume feedback
- cover letter generation
- interview preparation
- company insights
- personalized career roadmap

---

see you in the next build.

— aps