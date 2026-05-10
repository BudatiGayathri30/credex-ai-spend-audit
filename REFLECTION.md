# Assignment Reflection

## Hardest bug

The hardest bug was recommendation **overcounting** in aggregate savings: two suggestions could look great in isolation but were not simultaneously applicable, so the headline “total savings” became promotional instead of honest. Fixing it required tightening the engine (caps + choosing what to realize in the summary) **and** updating tests so the behavior could not regress quietly.

A close second during the Day 5 hardening pass was a **silent `next build` failure** from the App Router’s evolving `params` typing (sync vs `Promise`), which only showed up in production builds—not in day-to-day `dev`. That reinforced why CI must include `next build`, not just typecheck.

## Reversed decision

I initially considered making recommendation rules more dynamic with weighted heuristics per tool. I reversed that decision because it would reduce explainability and increase risk this late in MVP. I kept deterministic rule gates with explicit thresholds instead.

## Week 2 plan

- Add telemetry-backed calibration for confidence and recommendation thresholds.
- Add basic auth and role-aware internal dashboard for saved audits.
- Expand test depth with service-layer integration tests around Supabase + email flow.
- Run 10 real founder interviews and tune copy/CTA based on objections.

## AI usage honesty

I used AI heavily for draft copy, implementation acceleration, and documentation structure. I manually reviewed and edited all pricing assumptions, recommendation safeguards, and tests to keep outputs deterministic and believable. Final logic decisions and tradeoffs were made deliberately, not auto-accepted.

**Limitations I still respect:** models are good at narrative and scaffolding, but they will happily “confirm” a savings story if you let them. This project keeps **numbers out of the model’s hands** (inputs are structured; pricing is in `lib/pricing.ts`) and uses JSON-only output + validation + fallback summaries to avoid brittle formatting.

## Self-rating

- Product thinking: **8/10** (clear user value and funnel intent)
- Engineering quality: **8.5/10** (strict TS, CI + build, tests, deployment-minded env handling)
- Execution speed: **9/10** (full-stack MVP in staged increments)
- Reliability mindset: **8/10** (fallback paths, anomaly handling, deterministic tests; still needs real rate limits)
- Communication/documentation: **9/10** (architecture, prompts, economics, GTM, metrics, submission prep)

## What still needs improvement

- **Observability:** structured logs + basic funnel events (anonymous) to validate drop-off between audit → share → lead.  
- **Abuse controls:** move from documented intent to managed rate limiting + bot friction that survives serverless cold starts.  
- **Calibration:** confidence thresholds should be tuned from real audit distributions, not only synthetic fixtures.
