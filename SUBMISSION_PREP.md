# Submission preparation

Concise checklist for reviewers and for your own final pass before handoff.

---

## 1. Final submission checklist

- [ ] **Repository:** `main` is clean; README matches what the app actually does.
- [ ] **Secrets:** no API keys in git; Vercel/GitHub env vars set for production only.
- [ ] **Quality gates:** `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` all pass locally (mirrors CI).
- [ ] **Live demo:** production URL loads; run one full audit → share page → lead capture.
- [ ] **Share preview:** paste a public `/audit/{id}` URL into a messaging app; OG title/description look reasonable.
- [ ] **Docs:** `PRICING_DATA.md` dates and sources still credible; `ARCHITECTURE.md` reflects deployment story.
- [ ] **Artifacts:** screenshots + short Loom linked from README (see below).

---

## 2. Remaining risks / issues (honest MVP list)

| Risk | Impact | Mitigation (now or next) |
| --- | --- | --- |
| Heuristic recommendations | Medium | Confidence + caps in engine; tests; pricing doc; no “guaranteed savings” copy |
| Shared / inaccurate spend inputs | Medium | Low-spend anomaly handling; copy about estimates |
| Abuse / spam on public endpoints | Medium–High | Documented plan in `ARCHITECTURE.md`; add managed rate limits when traffic appears |
| Vendor pricing drift | Low–Medium | Date-stamped sources in `PRICING_DATA.md`; periodic refresh |
| Email deliverability | Medium | Verified domain in Resend; monitor bounces; DKIM/SPF on domain |
| Single-region Supabase | Low for MVP | Acceptable; revisit for latency + DR for paid tier |

---

## 3. Recommended screenshots

1. **Landing — hero:** full-width headline + primary CTA (shows positioning).
2. **Audit form — filled:** realistic but anonymized numbers (shows input surface area).
3. **Results — savings + cards:** at least one downgrade or alternative + confidence badges.
4. **AI summary block:** shows model-assisted narrative *after* deterministic savings.
5. **Share link UI:** copy-link control with URL visible (distribution story).
6. **Lead capture — success state:** green confirmation (trust + funnel).
7. **Public share page:** `/audit/...` rendered as a recipient would see it.
8. **Mobile — audit section:** single vertical scroll through form + first result card.

---

## 4. Recommended Loom walkthrough flow (~3–4 minutes)

1. **Problem frame (20s):** who the tool is for (small teams, AI subscription sprawl).
2. **Landing (30s):** scroll past hero → one benefits card → “how it works.”
3. **Audit (60s):** submit a plausible scenario; call out deterministic engine vs AI summary loading state.
4. **Results (45s):** point to savings line, confidence, and one recommendation’s reasoning.
5. **Share (30s):** copy link; open incognito `/audit/{id}` to prove public view.
6. **Lead capture (30s):** submit email → success state; mention transactional email dependency on env vars.
7. **Engineering (30s):** quick tour: tests + CI (`README`), pricing verification doc.

---

## 5. Suggested order for reviewer exploration

1. **README** — scope, setup, CI, deployment, pricing verification pointers.
2. **Live app** — run one audit end-to-end (happy path trust).
3. **`lib/audit-engine.ts`** + **`tests/`** — determinism and safety constraints.
4. **`PRICING_DATA.md`** — sourcing discipline.
5. **`ARCHITECTURE.md`** — data flow, persistence, deployment mental model.
6. **Business docs** (`METRICS`, `GTM`, `ECONOMICS`) — separates product judgment from code.
7. **`REFLECTION.md`** — process honesty and tradeoffs.
