# MAYA — Executive Intelligence OS

> *The speed of leadership should be measured by decisions, not keystrokes.*

MAYA is an Executive Intelligence Operating System — a workspace built for senior business leaders who need strategic intelligence at their fingertips without sacrificing the space to lead.

---

## What MAYA is

Most productivity tools are built for workers. MAYA is built for executives.

The distinction matters. An executive's leverage isn't in doing more tasks — it's in making better decisions faster, with less cognitive overhead. MAYA is designed around that reality: a collapsible sidebar that stays out of the way until it's needed, an AI assistant that thinks at the level of consequence, and a workspace that remembers context without demanding it be re-entered.

The interface takes its cues from Apple's design language: dense information when you need it, nothing when you don't. The sidebar collapses to a 56px icon rail. The canvas expands. The executive stays in flow.

---

## Ari — The Intelligence Behind the Interface

At the center of MAYA is **Ari**, an executive AI built to think with you — not at you.

Ari is not a general-purpose chatbot. It is a strategic thought partner embedded in your workspace. It knows the difference between a CEO question and a CFO question. It leads with the bottom line. It applies frameworks without announcing them. It gives direct answers when there are direct answers, and lays out tradeoffs when there aren't.

Every conversation with Ari is a focused working session. Session memory persists within MAYA so context doesn't need to be rebuilt. Future versions will carry memory across sessions, across devices, and across the executive team.

---

## Voice — Because Thought Should Never Wait for a Keyboard

Thought should never wait for a keyboard.

The moment an executive has a question, that question has value. Every second spent unlocking a phone, opening an app, finding a cursor, and typing is friction between insight and action.

MAYA eliminates that friction. Speak naturally. Keep walking. Keep leading. Ari captures the thought, performs the analysis, and returns an answer before the moment is lost.

Because the speed of leadership should be measured by decisions — not keystrokes.

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

MAYA is in active development, approaching executive beta.

The foundational intelligence layer — Ari's reasoning engine, session memory, streaming responses, and voice input — is complete. Executive workspace modules (CEO, CFO, COO, CRO, CMO, Creative Director) are scaffolded and ready for content. Cross-device sync and persistent session history are the next infrastructure milestone.
