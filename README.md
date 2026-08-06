# MAYA — Executive Intelligent Workstation

> *Doesn't act without you.*

MAYA is an AI-powered executive workstation — a thought partner with no agenda. It surfaces intelligence, drafts everything, and waits for your call. Every exec lens, every vault, every session is built around one principle: the exec decides, MAYA prepares.

---

## What MAYA Is

MAYA is not a chatbot. It is an **executive intelligent workstation** — a full operating layer for executive decision-making. Think Sim City for the C-suite: you build the conditions, MAYA monitors the systems, surfaces what matters, and holds until you act.

**Core pillars:**
- **Executive Suite** — Dedicated AI lenses for CEO, COO, CFO, CMO, CTO, CIO, CRO, CD, HR, Legal, and Office Admin. Each lens is trained for its role's priorities, risks, and vocabulary.
- **Strategy Room** — Bring multiple exec lenses into a single session. MAYA synthesizes across roles.
- **Decisions Layer** — Log, track, and audit every exec decision. Decisions become org assets, not lost context.
- **Library** — Sessions, Documents, Knowledge Vault, and Intel Vault. Everything queryable, everything owned by your org.
- **Intel Vault** — Connect professional sources (Westlaw, LexisNexis, Bloomberg, PubMed, IEEE, JSTOR, HBR, PitchBook, FactSet, and more) directly into your exec lens. Each connector is an in-app add-on — beta users get all sources free.
- **Titans Council** *(Phase 2)* — Assemble a cross-industry advisory board on demand. Per-decision, dissolved when done.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| AI | OpenAI GPT-4o via `openai` SDK |
| Styling | Tailwind CSS |
| Storage | Vercel KV (cloud) + localStorage (local fallback) |
| Auth | Beta invite gate + server-side access tokens |
| Billing | Stripe *(setup required — see below)* |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/cre8veheart-ai/Maya_with_sidebar.git
cd Maya_with_sidebar
npm ci
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key — get from [platform.openai.com](https://platform.openai.com/api-keys) |
| `NEXTAUTH_SECRET` | ✅ Yes | Random 32-byte hex string |
| `NEXTAUTH_URL` | ✅ Yes | `http://localhost:3000` for local dev |
| `MAYA_USERS` | ✅ Yes | JSON array of org users (see `.env.example`) |
| `BETA_INVITE_CODES` | ✅ Beta | Comma-separated invite codes |
| `KV_REST_API_URL` | ☁️ Cloud | Vercel KV — required for cross-device persistence |
| `KV_REST_API_TOKEN` | ☁️ Cloud | Vercel KV token |
| `STRIPE_SECRET_KEY` | 💳 Billing | Stripe secret key — required to charge for source connectors |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 💳 Billing | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | 💳 Billing | Stripe webhook signing secret |
| `NEXT_PUBLIC_ADMIN_PIN` | 🔐 Admin | PIN for `/admin` dashboard (change from default) |

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

---

## Beta Program

MAYA ships invite-only. The beta gate lives at `/` — users enter an invite code before accessing the workstation.

**To manage the beta program:**

1. Navigate to `/admin` in your deployment
2. Enter your `NEXT_PUBLIC_ADMIN_PIN`
3. Generate invite codes (format: `MAYA-XXXX-XXXX`)
4. Copy generated codes into your `BETA_INVITE_CODES` env var (comma-separated)
5. Distribute codes to your beta participants

Beta users get all source connector add-ons free. Billing activates post-beta.

---

## Intel Vault — Professional Sources

Connect domain-specific knowledge bases directly into MAYA. Sources available:

| Source | Category | Beta |
|---|---|---|
| PubMed / NCBI | Medical & Life Sciences | Free |
| Westlaw | Legal | Free (beta) |
| LexisNexis | Legal & News | Free (beta) |
| Bloomberg Terminal | Finance | Free (beta) |
| FactSet | Finance | Free (beta) |
| IEEE Xplore | Engineering & Technology | Free (beta) |
| JSTOR | Academic / Humanities | Free (beta) |
| Harvard Business Review | Business Strategy | Free (beta) |
| PitchBook | Venture & M&A | Free (beta) |
| Employment Law Guide | HR / Compliance | Free (beta) |
| Custom Source | User-defined | Free |

Credentials are stored locally in the browser vault. MAYA never transmits or stores org API keys.

---

## Cloud Storage (Vercel KV)

Without Vercel KV, all data (sessions, decisions, vault entries, beta profiles) lives in browser `localStorage` — it works for local dev but doesn't persist across devices or deployments.

**To enable cloud persistence:**

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) → your project → **Storage**
2. Click **Create KV Store**
3. Copy the env vars from the `.env.local` tab into your Vercel project's Environment Variables
4. Redeploy

---

## Billing (Stripe)

Source connector add-ons are purchasable per org via Stripe. Beta users bypass billing entirely.

**To set up Stripe:**

1. Create a [Stripe account](https://dashboard.stripe.com)
2. Create Products + Prices for each source connector in your Stripe Dashboard
3. Add `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` to your env vars
4. Add per-source price IDs (`STRIPE_PRICE_WESTLAW`, etc.) — see `.env.example`
5. Set up a webhook endpoint pointing to `/api/webhooks/stripe`

Full billing implementation is scaffolded and ready to wire once Stripe is configured.

---

## Deployment

MAYA deploys to Vercel with zero configuration:

```bash
vercel deploy
```

The `vercel.json` is intentionally minimal (`{"framework":"nextjs"}`). All configuration is handled via environment variables.

**Live deployment:** [https://maya-with-sidebar-wgvu.vercel.app](https://maya-with-sidebar-wgvu.vercel.app)

---

## Roadmap

| Phase | Feature |
|---|---|
| ✅ Beta | Executive lenses (CEO/COO/CFO/CMO/CTO/CIO/CRO/CD/HR/Legal/Office Admin) |
| ✅ Beta | Strategy Room, Decisions, Library |
| ✅ Beta | Intel Vault with professional source connectors |
| ✅ Beta | Invite-only beta gate + admin dashboard |
| ✅ Beta | Billing scaffolding (Stripe) |
| 🔄 Post-beta | Vercel KV persistence fully wired |
| 🔄 Post-beta | Stripe billing live |
| 🔄 Phase 2 | Titans Council — on-demand cross-industry advisory board |
| 🔄 Phase 2 | VPN + org authentication for Intel Vault |
| 🔄 Future | Apple CarPlay voice-first adaptation |
| 🔄 Future | Founders Edition |

---

## Design Principles

- **Doesn't act without you** — MAYA drafts, surfaces, and prepares. The exec executes.
- **Guardrails yes, boxes no** — Structure and accountability built in. Rigid workflows are anti-patterns.
- **Architecture over administration** — Build the operating conditions. MAYA monitors the systems.
- **Thought partner with no agenda** — Human thinks, MAYA synthesizes and reflects back, human decides.

