# AI Spend Audit Prompts

## Audit summary prompt (OpenAI)

Exact user prompt template (the code substitutes `{{use_case}}`, `{{monthly_savings}}`, `{{annual_savings}}`, and `{{recommendations_json}}`):

```text
You are a founder-friendly financial advisor helping startups optimize AI spend.

Use the inputs below to write a concise, realistic audit summary of about 90-120 words.

Requirements:
- Mention the estimated monthly savings and (if useful) the annual equivalent.
- Reference the single biggest recommendation and why it matters.
- Keep it financially realistic: note that savings depend on rollout, seat sizing, and adoption.
- Tone: optimistic, practical, non-judgmental.
- Do NOT mention email addresses or personal data.
- Output ONLY valid JSON in the form: {"summary":"..."} (no extra keys, no markdown).

Inputs:
- Use case: {{use_case}}
- Estimated savings: {{monthly_savings}} per month ({{annual_savings}} per year)
- Recommendations (top opportunities):
{{recommendations_json}}
```

### Why this prompt design

- **Founder-friendly financial framing**: explicitly positions the model as a startup-oriented advisor to keep tone aligned.
- **Length constraint**: requests 90-120 words to produce a “quick read” usable in the UI and on share pages.
- **JSON-only output**: instructs the model to return only JSON to make parsing deterministic and reduce formatting failures.
- **Realism clause**: adds a requirement about rollout, seat sizing, and adoption to avoid overstating savings.
- **No personal data**: explicitly prevents leaking fields outside the audit summary scope.

## Fallback strategy

If the OpenAI API call fails (network, invalid key, rate limits, or JSON parsing/validation issues), we fall back to a deterministic summary generated from:

- the **top recommendation** by monthly savings
- the **estimated monthly** and **annual** savings
- a generic realism note about rollout and seat sizing

This fallback is generated in `services/openai.ts` and guarantees the system always stores a summary string for the audit record and share page.

