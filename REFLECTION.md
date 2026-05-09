# Assignment Reflection

## Hardest bug

The hardest bug was recommendation overcounting in aggregate savings. Multiple recommendations were individually valid but could not all be applied at once, which produced inflated total savings in some scenarios. I fixed this by introducing savings safety constraints and only realizing one recommendation path in summary math while still showing alternatives.

## Reversed decision

I initially considered making recommendation rules more dynamic with weighted heuristics per tool. I reversed that decision because it would reduce explainability and increase risk this late in MVP. I kept deterministic rule gates with explicit thresholds instead.

## Week 2 plan

- Add telemetry-backed calibration for confidence and recommendation thresholds.
- Add basic auth and role-aware internal dashboard for saved audits.
- Expand test depth with service-layer integration tests around Supabase + email flow.
- Run 10 real founder interviews and tune copy/CTA based on objections.

## AI usage honesty

I used AI heavily for draft copy, implementation acceleration, and documentation structure. I manually reviewed and edited all pricing assumptions, recommendation safeguards, and tests to keep outputs deterministic and believable. Final logic decisions and tradeoffs were made deliberately, not auto-accepted.

## Self-rating

- Product thinking: **8/10** (clear user value and funnel intent)
- Engineering quality: **8/10** (strict TypeScript, CI, tests, safety constraints)
- Execution speed: **9/10** (full-stack MVP in staged increments)
- Reliability mindset: **8/10** (fallback paths, anomaly handling, deterministic tests)
- Communication/documentation: **9/10** (architecture, prompts, economics, GTM, metrics)
