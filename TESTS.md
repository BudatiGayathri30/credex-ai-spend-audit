# Test Coverage Guide

## Testing philosophy

- Keep core pricing and recommendation logic deterministic, rule-based, and independently testable.
- Favor small scenario tests with explicit inputs/outputs over snapshot-heavy tests.
- Validate trust-critical edge cases first: invalid seat counts, low-spend anomalies, and unrealistic savings.
- Treat recommendations as advisory: tests verify safety constraints and confidence bounds, not marketing copy.

## Test files

### `tests/audit-engine.test.ts`

- Savings calculation consistency (monthly and annual totals).
- Downgrade recommendation trigger logic for low-seat premium plans.
- Alternative stack recommendation eligibility for larger teams.
- Confidence score floor/cap behavior.
- Zero-seat and zero-team defensive handling with fallback messaging.
- Low-spend anomaly suppression to avoid unrealistic recommendations.

### `tests/pricing.test.ts`

- Tool alias resolution to canonical keys.
- Plan resolution by both key and display name.
- Monthly per-seat pricing math helpers.
- Sanity check that each supported tool includes at least one paid plan.

## Edge cases validated

- Seat count of `0` and team size of `0` do not crash calculations.
- Very low spend per seat does not produce inflated savings claims.
- Unknown tool aliases default to a safe fallback tool key.
- Missing plan lookups return `undefined` and do not break helper behavior.

## How to run tests

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run all tests:

   ```bash
   npm run test
   ```

3. Run lint + typecheck + tests (local CI parity):

   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```
