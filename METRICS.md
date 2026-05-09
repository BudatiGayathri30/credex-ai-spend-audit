# Metrics Plan (B2B Lead-Gen SaaS)

## North Star metric

- **Qualified audit leads per week**: number of submitted audits with business email + savings estimate >= $200/month.

## Input metrics (3)

- **Audit completion rate**: completed audits / started audits.
- **Lead capture conversion**: leads submitted / completed audits.
- **High-intent share rate**: public audit links copied / completed audits.

## Instrumentation plan

- Track funnel events at each step:
  - `landing_view`
  - `audit_started`
  - `audit_completed`
  - `lead_submitted`
  - `share_link_copied`
- Store event timestamp, anonymous session id, and tool/plan metadata.
- Add weekly reporting snapshot query in Supabase for:
  - completion rate trend
  - channel-tagged conversion (from UTM)
  - median estimated monthly savings by segment
- Review metrics every Monday with a single KPI dashboard and 30-minute ops review.

## Pivot thresholds

- If audit completion rate is **<35%** after 300 started audits, simplify form friction and reduce required fields.
- If lead conversion is **<18%** after 200 completed audits, tighten value proposition and post-result CTA.
- If qualified leads are **<12/week** by week 6, shift channel mix toward founder partnerships and community demos.
