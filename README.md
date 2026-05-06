# AI Spend Audit SaaS

AI Spend Audit is a SaaS landing experience for startups that want better visibility into AI tooling costs.  
It helps teams organize spend inputs across tools like ChatGPT, Claude, Cursor, Gemini, and Copilot, and prepares the foundation for actionable optimization recommendations.  
This repository currently contains the production-style frontend UI and form workflow.

## Features Implemented (So Far)

- Modern SaaS landing page UI (navbar, hero, benefits, how-it-works, footer)
- Responsive, mobile-first layout with improved navigation UX
- AI spend audit form UI built with React Hook Form + Zod validation
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
  ui/                 # Reusable UI primitives (button, card, input, select, etc.)
lib/
  validations/        # Zod schemas and form validation logic
types/                # Shared TypeScript types
```

## Deployment URL

_TBD — add production/staging URL after first deployment._

## Screenshots

_TBD — add landing page and form screenshots after UI stabilization._
