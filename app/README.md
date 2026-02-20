# Fraction Comparison Workout

A React prototype for high-school fraction comparison practice. Designed for 9th–10th graders who may be behind in fraction fundamentals but are sensitive to being perceived as "behind."

The experience feels like a mature skill workout — simple, calm, and non-remedial — while quietly adapting to each student's performance underneath the surface.

## Design Principles

- **Dignity first.** No remedial vibes, no levels, no cartoon visuals. The UI is calm, minimal, and professional.
- **Stealth adaptation.** The system adapts question difficulty and category targeting based on performance. This is never announced to the student.
- **Non-assumptive feedback.** When a student answers incorrectly, the system provides a strategy — it never guesses why they chose their answer.
- **Controlled progress visibility.** "Skill Growth" summaries appear only at natural checkpoints, using growth-oriented language. No deficit labels like "weak" or "needs improvement."
- **Zero-correct safeguard.** If a student has no correct answers at a checkpoint, the system shows strategy guidance instead of hollow praise — respecting the student's awareness of their own performance.

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Other Commands

```bash
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

## How It Works

### User Flow

1. **Start** — Clean entry screen with a single "Start Workout" button
2. **Workout** — 6 fraction comparison questions, one at a time:
   - Select fraction A or B → click "Check" → see feedback → click "Next"
   - At checkpoints (after Q3 and Q6), a Skill Growth or Strategy Review panel appears
3. **Summary** — Final score and skill growth recap with a "Restart Workout" option

### Adaptive Engine

The engine runs entirely client-side with no backend. Under the hood:

- **Weighted category selection** — Categories where the student struggles appear more frequently (up to 3× more likely). The student never sees this.
- **Dynamic difficulty (1–3)** — Difficulty scales up with accuracy and drops after 2 consecutive misses in the same category.
- **Deterministic sessions** — A seeded PRNG (Mulberry32, seed: 1337) makes question sequences reproducible for testing.
- **No repeat questions** — The same question ID never appears twice in a session.

### Question Categories

| Category | What It Tests | Example |
|---|---|---|
| Same denominator | Compare numerators directly | 3/7 vs 5/7 |
| Same numerator | Smaller denominator = larger pieces | 3/5 vs 3/8 |
| Benchmark (½) | Position relative to ½ | 4/9 vs 5/8 |
| Unlike denominator | Cross-multiply or find common denominator | 2/3 vs 3/5 |

32 questions total (8 per category, spanning difficulties 1–3). All correct answers have been verified.

### Feedback Behavior

| Scenario | What the Student Sees |
|---|---|
| Correct answer | "Correct." + 30% chance of a strategy reinforcement line |
| Incorrect answer | "Not quite." + strategy line + optional "See Why" visual for benchmark questions |
| Checkpoint with ≥1 correct | Skill Growth panel with growth-oriented phrases |
| Checkpoint with 0 correct | Strategy Review panel with actionable strategies (no false praise) |
| End of session, 0 correct | Strategy Review with "Try Again" button (skips summary) |

### On-Demand Strategies

A "View Strategies" link at the bottom of the workout page lets students revisit all four strategy lines and their current progress at any time.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| State | React Context + `useReducer` (headless) |
| Build | Vite 7 |

No external math libraries, no backend, no API calls.

## Project Structure

```
src/
├── state/                  # Headless state layer (all logic lives here)
│   ├── types.ts            # TypeScript types, constants, category/strategy definitions
│   ├── questionBank.ts     # 32 verified fraction comparison questions
│   ├── engine.ts           # Adaptive selection algorithm + seeded PRNG
│   └── store.ts            # Reducer, actions, selectors, React context
│
├── pages/                  # Route-level page components
│   ├── StartPage.tsx       # Entry screen
│   ├── WorkoutPage.tsx     # Main workout orchestration
│   └── SummaryPage.tsx     # End-of-session summary
│
├── components/             # Reusable UI components
│   ├── ProgressBar.tsx     # Thin progress bar with question counter
│   ├── FractionOptionCard.tsx  # Stacked fraction display (A/B selection)
│   ├── FeedbackCard.tsx    # Correct/incorrect feedback with strategy lines
│   ├── MinimalNumberLine.tsx   # 0—½—1 visual for benchmark questions
│   ├── SkillGrowthPanel.tsx    # Checkpoint modal (growth or strategy mode)
│   └── StrategyReferencePanel.tsx  # On-demand strategy reference
│
├── App.tsx                 # Router + state provider
├── main.tsx                # Entry point
└── index.css               # Tailwind import
```

### Architecture Rule

All adaptation logic, session state, and question selection live in `src/state/`. UI components read state and dispatch actions — they contain zero adaptation logic.

## Deployment

### Vercel

1. Push the `app/` directory to a GitHub repo
2. Import the repo on [vercel.com](https://vercel.com)
3. Set **Root Directory** to `app`
4. Deploy — Vercel auto-detects Vite

A `vercel.json` is included to handle client-side routing rewrites.

### GitHub Pages

1. Set `base: '/<repo-name>/'` in `vite.config.ts`
2. Run `npm run build`
3. Deploy the `dist/` folder via `gh-pages` or manually

## Extending the Prototype

| To do this | Change this |
|---|---|
| Add more questions | `src/state/questionBank.ts` — follow the existing schema |
| Change session length | `src/state/store.ts` → `createInitialState()` → `config.totalQuestions` and `config.checkpointIndices` |
| Adjust adaptation aggressiveness | `src/state/engine.ts` → weight formula and accuracy thresholds |
| Change reinforcement frequency | `src/state/engine.ts` → `shouldShowReinforcement` (currently 30%) |
| Modify copy/tone | `src/state/types.ts` → `STRATEGY_LINES` and `CATEGORY_DISPLAY_NAMES` |
| Add a new question category | Add to `Category` type, `ALL_CATEGORIES`, display names, strategy lines, and question bank |

## License

Prototype — not licensed for production use.
