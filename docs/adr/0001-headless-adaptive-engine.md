# ADR 0001: Keep adaptive logic independent from the interface

- **Status:** Accepted
- **Date:** 2026-09-08

## Context

The workout must adapt question category and difficulty without coupling that
behaviour to React components. The selection algorithm also needs to be
repeatable in automated tests, while the interface should remain easy to change.

## Decision

Keep session rules, question selection and progress calculations in the
headless `src/state` layer. React components may read state and dispatch typed
actions, but they must not contain adaptation logic.

Use a seeded pseudo-random number generator for question selection. Production
behaviour remains varied, while a known seed makes the same session reproducible
for debugging and tests. Validate the domain layer with fast Vitest unit tests;
run those tests together with linting and the production build in GitHub Actions.

## Consequences

### Positive

- Domain behaviour can be tested without rendering the interface.
- The same rules can support a different UI or delivery channel later.
- Reproducible sessions make regressions easier to diagnose.
- CI blocks changes that fail linting, tests or the production build.

### Trade-offs

- React Context is sufficient at the prototype's current scale but may cause
  broad rerenders as state grows.
- The session RNG is process-local; persistence or concurrent sessions would
  require moving it into explicit session state.
- End-to-end browser tests are still needed before treating the prototype as a
  production learning product.

Revisit this decision if the product introduces server-side sessions,
cross-device persistence or substantially more complex state coordination.
