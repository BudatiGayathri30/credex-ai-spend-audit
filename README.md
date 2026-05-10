# AI Spend Audit SaaS (Credex)

Credex is a lean B2B lead-gen MVP: a founder-friendly **AI spend audit** that turns self-serve inputs into **deterministic savings estimates**, an **optional OpenAI narrative summary**, **Supabase persistence**, **shareable public audit URLs**, and a **lightweight lead + Resend confirmation** flow.

The product is designed to feel **launchable** (clear value, believable numbers, shareable output) without pretending to be enterprise procurement software.

---

## Production-ready feature summary

- **Landing experience:** responsive hero, benefits, how-it-works, sticky nav with sensible scroll offset.
- **Audit engine:** downgrade, alternative stack, and optimization paths with **savings caps**, **low-spend anomaly handling**, and **confidence scoring** (`lib/audit-engine.ts`).
- **Results UI:** savings hero, recommendation cards, AI summary block with loading skeleton while the server responds.
- **Persistence:** Supabase insert for audits; lead fields updated post-capture (`services/supabase.ts`).
- **AI summaries:** OpenAI JSON-mode prompt with deterministic fallback (`services/openai.ts`). See `PROMPTS.md`.
- **Email:** Resend transactional confirmation when keys are configured (`services/resend.ts`).
- **Share pages:** `/audit/[id]` with dynamic **Open Graph** metadata (title, description, canonical `openGraph.url` when `NEXT_PUBLIC_APP_URL` is set).
- **Quality:** ESLint, strict TypeScript, Vitest suites, GitHub Actions **including production build**.

---

## Live demo & media (placeholders)

| Asset | Link / location |
| --- | --- |
| **Production URL** | *TBD — e.g. `https://credex-ai-spend-audit.vercel.app`* |
| **Screenshots** | Add PNGs after deploy: landing, results + AI summary, share URL row, mobile audit, public share preview. See `SUBMISSION_PREP.md`. |
| **Loom walkthrough** | *TBD — follow the script in `SUBMISSION_PREP.md` (~3–4 min).* |

---

## Tech stack

- Next.js 15 (App Router), TypeScript (strict), Tailwind CSS  
- React Hook Form + Zod  
- Supabase (`@supabase/supabase-js`)  
- OpenAI + Resend  
- Vitest + GitHub Actions CI  

---

## Local setup

1. **Install**

   ```bash
   npm install
   ```

2. **Environment** — copy `.env.example` to `.env.local` and fill values (never commit secrets):

   | Variable | Required for | Notes |
   | --- | --- | --- |
   | `NEXT_PUBLIC_APP_URL` | OG URLs, absolute links | In prod, set to your canonical site URL (no trailing slash recommended). |
   | `SUPABASE_URL` | Save audits, share pages, leads | Required at **runtime** for API/share routes (not imported at module top). |
   | `SUPABASE_SERVICE_ROLE_KEY` | Same | Service role stays **server-only**; never expose to the client. |
   | `OPENAI_API_KEY` | Model-generated summaries | Optional: falls back to template summary if missing. |
   | `OPENAI_MODEL` | Same | Defaults to `gpt-4.1-mini` in code. |
   | `RESEND_API_KEY` | Confirmation email | Optional: lead still saves if email fails. |
   | `RESEND_FROM_EMAIL` | Same | Verified sender identity in Resend. |

3. **Run**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000  

4. **Quality gates**

   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```

---

## Testing & CI

- **How to run tests:** `npm run test` (Vitest). Philosophy and case coverage live in **`TESTS.md`**.
- **CI:** `.github/workflows/ci.yml` on push to `main` — `npm ci` → `lint` → `typecheck` → `test` → **`build`** (validates production compile without requiring secrets in GitHub; server env validation runs when routes execute).

---

## Deployment (Vercel)

1. Import the GitHub repo into [Vercel](https://vercel.com).
2. **Framework preset:** Next.js (default).
3. **Environment variables:** add every variable from the table above (Production + Preview as needed).
4. **Root directory:** repository root (default).
5. **Deploy:** first deploy should succeed if CI passes locally.
6. **Post-deploy checks:** follow **Production verification** below.

---

## Production verification checklist

- [ ] `NEXT_PUBLIC_APP_URL` matches the deployed hostname (fixes OG URL and metadata base).
- [ ] Submit audit → persistence succeeds (Supabase rows created).
- [ ] Open **`/audit/{public_share_id}`** from the response; page renders and matches dashboard numbers.
- [ ] Share URL in Slack/iMessage shows a sensible **title + description** (OG).
- [ ] Lead capture saves and, with Resend configured, sends email (check spam folder once).
- [ ] Mobile: complete audit without horizontal scroll; sticky header does not trap focus.
- [ ] Browser console: no React hydration errors on landing and share pages.

**Build note:** Supabase and Resend clients validate env at **request time**, so `next build` and CI can run without production secrets while keeping runtime failures explicit if keys are missing.

---

## Pricing verification

Assumptions, official sources, and verification dates are centralized in **`PRICING_DATA.md`**. Recommendation logic intentionally stays conservative—see **`lib/audit-engine.ts`** and tests.

---

## Business, product & submission docs

| File | Contents |
| --- | --- |
| `METRICS.md` | North Star, inputs, instrumentation, pivot thresholds |
| `GTM.md` | ICP, channels, first 100 users |
| `ECONOMICS.md` | Unit economics, path to $1M ARR (rough, honest math) |
| `LANDING_COPY.md` | Hero, FAQ, social proof draft |
| `USER_INTERVIEWS.md` | Three realistic discovery-style interviews |
| `SUBMISSION_PREP.md` | Checklist, risks, screenshot list, Loom script, reviewer order |
| `REFLECTION.md` | Assignment reflection (bugs, reversals, AI usage honesty) |

---

## Architecture maturity (Day 5)

- **Deterministic core:** pricing + rules stay in TypeScript; the model only narrates.
- **Safety rails:** savings ratio cap, anomaly guardrails, transparent fallback copy.
- **Deployment-friendly:** lazy env validation for server services; production build in CI.
- **UX/a11y pass:** landmark-friendly headings, form `aria-invalid` / `role="alert"`, live regions for async states, scroll targets for in-page nav.

High-level flow is described in **`ARCHITECTURE.md`**.

---

## Folder structure (overview)

```text
app/                  # App Router, API routes, share pages
components/           # Layout, sections, forms, audit UI, primitives
lib/                  # pricing, audit engine, validations
services/             # Supabase, OpenAI, Resend (server-only modules)
tests/                # Vitest
types/                # Shared TS types
```

---

## License / usage

Private assignment / portfolio repository — adjust as needed for your program’s submission rules.
