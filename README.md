# MAYA

**Executive Intelligence for Better Decisions.**

MAYA is an executive intelligence workspace designed to help leaders think more clearly, evaluate complex decisions, and preserve organizational knowledge.

Rather than acting as another AI chatbot, MAYA serves as a structured decision environment where specialized executive perspectives work together to analyze challenges, identify risks, surface opportunities, and document reasoning before action is taken.

Every recommendation is designed to be transparent, reviewable, and grounded in evidence.

---

## Why MAYA Exists

Modern organizations generate more information than people can effectively process.

Ideas become scattered across documents, conversations, emails, and meetings. Critical reasoning is often lost, decisions are repeated, and institutional knowledge disappears over time.

MAYA was created to solve that problem.

It provides a single workspace where strategy, operations, finance, marketing, risk, creativity, and execution converge into one living system.

---

## Core Principles

- Think before acting.
- Evidence over assumptions.
- Transparency over black boxes.
- Preserve organizational memory.
- Improve decision quality through structured collaboration.
- Keep humans in control.

---

## What Makes MAYA Different

MAYA is not another conversational AI assistant.

It is an operating system for executive thinking.

Its purpose is to help organizations:

- Organize knowledge
- Evaluate important decisions
- Compare multiple executive viewpoints
- Capture institutional memory
- Build repeatable decision frameworks
- Execute with confidence

---

## Architecture

MAYA is a Next.js 14 App Router application. The intelligence layer is designed to be modular and swappable at every level.

```
app/
├── api/ari/route.ts          # Streaming LLM endpoint — model-agnostic
├── ari/page.tsx              # Chat UI with session memory + dictation
├── [executive]/page.tsx      # CEO, CFO, COO, CRO, CMO, Creative Director
├── workflows/                # Workflow canvas (list, create, manage)
└── decisions, projects, ...  # Executive workspace modules

lib/
├── ari/
│   ├── types.ts              # AriMessage, AriSession, IAriStorage interface
│   ├── LocalStorageAriAdapter.ts  # Phase 1 — swappable to any backend
│   └── systemPrompt.ts       # Executive reasoning prompt + workspace context
├── storage/
│   ├── IWorkflowStorage.ts   # Storage abstraction (same pattern as Ari)
│   └── LocalStorageWorkflowAdapter.ts
└── hooks/
    ├── useDictation.ts       # Web Speech API — no external dependency
    └── useLocalStorage.ts    # Typed localStorage with SSR safety
```

Every storage layer is behind an interface. Phase 1 uses `localStorage` for zero-latency, zero-infrastructure beta testing. Phase 2 swaps in a backend adapter without touching the UI.

---

## Getting Started

### Prerequisites

- Node.js 18.17+
- An OpenAI API key ([platform.openai.com](https://platform.openai.com))

### Setup

```bash
npm install
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | OpenAI API key — powers Ari's responses |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | OpenAI GPT-4o via streaming API |
| Voice | Web Speech API (native browser, no dependency) |
| Storage | localStorage (Phase 1) / swappable via interface (Phase 2) |
| Deployment | Vercel |

---

## Status

MAYA is currently in active beta development.

The platform is evolving through iterative testing, user feedback, and continuous refinement as we build toward a comprehensive Executive Intelligence Platform.
