# AI Spend Audit SaaS

AI Spend Audit is a SaaS landing experience for startups that want better visibility into AI tooling costs.  
It helps teams organize spend inputs across tools like ChatGPT, Claude, Cursor, Gemini, and Copilot, and prepares the foundation for actionable optimization recommendations.  
This repository currently contains the production-style frontend UI, local audit engine, and recommendation results workflow.

## Features Implemented (So Far)

- Modern SaaS landing page UI (navbar, hero, benefits, how-it-works, footer)
- Responsive, mobile-first layout with improved navigation UX
- AI spend audit form UI built with React Hook Form + Zod validation
- Pricing configuration system for major AI tools and plans
- Core recommendation engine with downgrade + alternative suggestions
- Monthly and annual savings calculations with confidence scoring
- Responsive results dashboard (savings hero + recommendation cards)
- Typed audit result models and reusable calculation interfaces
- Reusable component architecture using shadcn-style UI primitives
- Type-safe codebase structure with modular sections and validation schema

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-style component patterns
- React Hook Form
- Zod

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Run lint checks:
   ```bash
   npm run lint
   ```
4. Open:
   [http://localhost:3000](http://localhost:3000)

## Folder Structure (Overview)

```text
app/                  # App Router pages, layout, global styles
components/
  layout/             # Navbar, Footer
  sections/           # Hero, Benefits, How It Works, Form section wrappers
  forms/              # Audit form UI
  audit/              # Results summary and recommendation rendering components
  ui/                 # Reusable UI primitives (button, card, input, select, etc.)
lib/
  validations/        # Zod schemas and form validation logic
  pricing.ts          # Plan pricing definitions + pricing helpers
  audit-engine.ts     # Recommendation rules and savings computation pipeline
types/                # Shared TypeScript types
```

## Audit Engine Overview

The current audit system runs fully on the client for rapid iteration:

1. Form values are validated and submitted from `components/forms/audit-form.tsx`.
2. Tool + plan metadata are resolved from `lib/pricing.ts`.
3. `lib/audit-engine.ts` applies recommendation rules:
   - downgrade opportunities for over-provisioned plans
   - alternative stack suggestions for larger teams
   - seat-level optimization fallback
4. A typed `AuditResult` is returned and rendered in:
   - `components/audit/savings-hero.tsx`
   - `components/audit/tool-recommendation-card.tsx`
   - `components/audit/results-summary.tsx`

## Current Progress

**Milestone:** Day 2 core audit engine completed.

- Landing + navigation system complete
- Form + schema validation complete
- Pricing model + recommendation logic complete
- Savings and confidence result rendering complete
- Next milestone: expand recommendation depth and calibration with real usage scenarios

## Deployment URL

_TBD — add production/staging URL after first deployment._

## Screenshots

_TBD — add landing page and form screenshots after UI stabilization._
