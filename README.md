# AI Spend Audit SaaS

AI Spend Audit is a SaaS landing experience for startups that want better visibility into AI tooling costs.
It helps teams analyze AI software spending across tools like ChatGPT, Claude, Cursor, Gemini, and Copilot, and generates actionable optimization recommendations with estimated monthly and annual savings.
This repository currently contains the production-style frontend UI, recommendation engine, backend persistence flow, AI-generated summaries, and shareable audit result workflow.

## Features Implemented (So Far)

* Modern SaaS landing page UI (navbar, hero, benefits, how-it-works, footer)
* Responsive, mobile-first layout with improved navigation UX
* AI spend audit form UI built with React Hook Form + Zod validation
* Pricing configuration system for major AI tools and plans
* Core recommendation engine with downgrade + alternative suggestions
* Monthly and annual savings calculations with confidence scoring
* Responsive results dashboard (savings hero + recommendation cards)
* AI-generated personalized audit summaries with graceful fallback handling
* Supabase-based audit persistence and lead storage
* Lead capture flow with optional company + role information
* Transactional email confirmation flow using Resend
* Public shareable audit result pages
* Open Graph + Twitter metadata support for shared audits
* Typed audit result models and reusable calculation interfaces
* Reusable component architecture using shadcn-style UI primitives
* Type-safe codebase structure with modular sections and validation schema

## Tech Stack

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui-style component patterns
* React Hook Form
* Zod
* Supabase
* OpenAI API
* Resend

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   SUPABASE_URL=
   SUPABASE_SERVICE_ROLE_KEY=
   OPENAI_API_KEY=
   OPENAI_MODEL=gpt-4.1-mini
   RESEND_API_KEY=
   RESEND_FROM_EMAIL=
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Run lint checks:

   ```bash
   npm run lint
   ```

5. Run TypeScript validation:

   ```bash
   npm run typecheck
   ```

6. Run test suite:

   ```bash
   npm run test
   ```

7. Open:
   http://localhost:3000

## CI Status

- GitHub Actions workflow: `.github/workflows/ci.yml`
- Trigger: push to `main`
- Checks: dependency install, lint, strict TypeScript validation, and test execution

## Pricing Verification

- Pricing assumptions are documented and date-stamped in `PRICING_DATA.md`.
- Sources are official pricing URLs for each supported platform.
- Recommendation logic in `lib/audit-engine.ts` is constrained to avoid unrealistic savings outputs.

## Business and Strategy Docs

- `METRICS.md`: North Star metric, input metrics, instrumentation, pivot thresholds
- `GTM.md`: target user, channel strategy, first 100 users plan, traction expectations
- `ECONOMICS.md`: unit economics assumptions and path to $1M ARR
- `LANDING_COPY.md`: production-ready landing copy draft
- `REFLECTION.md`: assignment reflection and self-rating

## Folder Structure (Overview)

```text
app/                  # App Router pages, layout, global styles
components/
  layout/             # Navbar, Footer
  sections/           # Hero, Benefits, How It Works, Form section wrappers
  forms/              # Audit form UI
  audit/              # Results summary and recommendation rendering components
  ui/                 # Reusable UI primitives
lib/
  validations/        # Zod schemas and validation logic
  pricing.ts          # Pricing definitions + pricing helpers
  audit-engine.ts     # Recommendation rules and savings engine
services/
  supabase.ts         # Supabase client + persistence helpers
  openai.ts           # AI summary generation logic
  resend.ts           # Transactional email integration
types/                # Shared TypeScript types
```

## Audit Engine Overview

The audit workflow currently follows this pipeline:

1. Users submit AI tooling spend information through the audit form.
2. Tool + plan metadata are resolved from `lib/pricing.ts`.
3. `lib/audit-engine.ts` evaluates:

   * downgrade opportunities
   * over-provisioned plans
   * alternative stack suggestions
   * optimization opportunities based on team size and use case
4. Monthly + annual savings estimates are generated.
5. OpenAI generates a concise personalized audit summary.
6. Audit results and lead capture data are persisted to Supabase.
7. Public shareable audit URLs are generated for viral sharing.

## Current Progress

**Milestone:** Day 4 quality and readiness pass completed.

Completed:

* Landing + navigation system
* Form + schema validation
* Pricing model + recommendation engine
* Savings and confidence rendering
* AI-generated summaries
* Supabase persistence
* Lead capture flow
* Transactional email integration
* Public shareable audit pages
* Open Graph metadata support
* Deterministic unit tests for pricing and audit rules
* GitHub Actions CI pipeline
* Pricing source verification documentation
* Recommendation safety constraints for low-spend and zero-seat anomalies
* Business strategy and unit economics documentation

Next milestone:

* production deployment hardening
* auth + role-scoped internal views
* analytics dashboard instrumentation
* recommendation calibration from live usage
* outbound and referral experiments

## Architecture Maturity Updates

- Core engine remains deterministic and typed.
- Recommendation outputs now include stronger fallback messaging when no material savings are detected.
- Aggregate savings logic applies safety constraints to prevent over-promising.
- Abuse prevention strategy is documented in `ARCHITECTURE.md` (rate limits + anti-spam tradeoffs for MVP).

## Deployment URL

*TBD — add production/staging URL after deployment.*

## Screenshots

*TBD — add landing page, results dashboard, and shareable audit screenshots after UI stabilization.*
