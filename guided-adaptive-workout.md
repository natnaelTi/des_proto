# Amp Build Prompt — Guided Adaptive Workout Prototype (React + Headless State)

## Goal
Build a clickable, engineer-ready React prototype for a high-school fraction comparison practice product.
The UX direction is **Guided Adaptive Workout**:
- Feels like a mature skill workout (not remedial)
- Quietly adaptive (adaptation not explicitly announced)
- Provides controlled, subtle visibility into progress ("Skill Growth") without labeling weaknesses
- Calm, neutral tone (no childish visuals, no gamified fireworks)

Prototype scope: client-side only. No backend. Use mock data + headless state.

- You can find the detailed outline of the **Guided Adaptive Workout** UX direction on the file **ux_outline.md** found in the same directory as this file.
---

## Primary Users & Constraints (must shape UI/UX)
Audience: 9th–10th graders behind in fraction comparison fundamentals.

Key constraints:
1) Dignity: Avoid remedial vibes. No levels. No "weak/low" labels. No cartoon UI.
2) Trust: Avoid "fake easy" progress. Progress should feel earned.
3) Help should not assume intent behind wrong answers; it should clarify concept + offer a reliable strategy.
4) Simple flow (Jordan): drill-like loop, high completion.
5) Adaptive practice + strategy feedback (Maya): targeted practice by comparison type, but subtle.

---

## Prototype Experience Overview
App name: **Fraction Comparison Workout**
Main flow:
- Start screen → Workout → End summary
Workout structure:
- Session length default: 12 questions (configurable)
- Student answers one question at a time
- Immediate feedback after each answer
- After natural checkpoints (after Q6 and Q12), show a compact **Skill Growth** panel
- Student can dismiss Skill Growth panel; it should not block progress for long

Core screens (routes):
- `/` Start
- `/workout` Practice
- `/summary` End of session

---

## UX & Visual Design Requirements
- Minimalist, calm, modern UI
- No bright celebratory animation
- Use clear typography, whitespace, simple card layouts
- Avoid childish iconography
- Keep copy concise and respectful
- Small, subtle progress bar + question count
- "Skill Growth" is small, positive, and non-judgmental (no red/yellow, no "needs improvement")

---

## Content Types (Question Categories)
The adaptive engine should tag questions into comparison types:
- `same_denominator`
- `same_numerator`
- `benchmark_half`
- `unlike_denominator`

Notes:
- Category labels should NOT be shown explicitly as these names in the UI.
- If you must show category context, use neutral phrases like:
  - "Same denominator comparisons"
  - "Benchmark comparisons"
  - "Unlike denominators"
But keep it subtle and optional. Prefer NOT showing categories per-question.

---

## Controlled "Help" Behavior
### When Correct
- Show brief confirmation: “Correct.”
- Occasionally (not every time) add a short reinforcement line:
  - “Benchmarks can make these faster.”
  - “Same denominators: compare numerators.”
Use a probabilistic trigger, e.g. 30% chance, but avoid feeling random/noisy.

### When Incorrect (must be non-assumptive)
Feedback card includes:
1) Calm statement: “Not quite.”
2) A concept clarification that does NOT guess their reasoning.
3) A reliable strategy suggestion.
4) Minimal visual support when helpful:
   - For `benchmark_half`: show a 0–1 number line with 1/2 marked.
   - For others: show a minimal hint block (optional) without heavy diagrams.

Example incorrect feedback copy:
- “When denominators differ, the size of each piece changes. Try comparing with a common denominator, or use a benchmark like 1/2.”

### Repeated Errors Intervention
If student misses 2 times in the same category within the session:
- Next question in that category should be a slightly simpler variant (but same concept).
- After that question, if correct, show: “Nice—this strategy works reliably. Keep using it.”

Do not say: “We’re making it easier.”

---

## Controlled Skill Visibility ("Skill Growth")
At checkpoints (after Q6 and Q12), show a small panel:
Title: “Skill Growth”
Bullets should be growth-oriented:
- “Strong consistency in ___ comparisons.”
- “Improving accuracy in ___.”
- “Making progress in ___.”

Rules:
- Never show “weak”, “low”, “poor”
- Avoid rank ordering like “best/worst”
- Don’t show percentages unless needed for prototype; prefer simple phrases.
- If you must include numbers, use neutral forms like “4/6 correct so far”.

Skill Growth should be dismissible with “Continue”.

---

## Headless State Requirements
Implement state separate from UI. Use a store or reducer (e.g., Zustand, Redux Toolkit, or React Context + useReducer).
No UI component should contain adaptation logic beyond calling store actions/selectors.

State should include:
- session config: totalQuestions, checkpointIndices, seed
- question queue + current index
- current question
- user answers history
- per-category stats: attempts, correct, recentWrongCount
- UI state: showingFeedback, showingSkillGrowth, lastFeedbackType, reinforcementShown

Actions should include:
- startSession()
- submitAnswer(choice)
- continueAfterFeedback()
- dismissSkillGrowth()
- restart()

Selectors should include:
- getProgress()
- getSkillGrowthSummary()
- getNextQuestion() (internal engine)

---

## Adaptive Engine (simple, credible MVP)
Implement an in-memory question bank with metadata:
- id, a, b, correctChoice (A/B), category, difficulty (1-3), optional visuals
Each question asks: “Which is larger?” with two fractions A and B.

Adaptive selection algorithm (must be deterministic with seed if possible):
1) Maintain weights per category based on accuracy:
   - Start equal weights
   - If accuracy low in a category, increase weight
2) Choose next category by weighted random.
3) Choose difficulty:
   - If category accuracy high, increase difficulty
   - If repeated wrongs in category, reduce difficulty by 1 (min 1) for the next item
4) Avoid repeating the same exact question

Session length: 6.

---

## Fraction Display & Interaction
Fraction display:
- Render fraction as numerator over denominator (stacked)
- Each option in a selectable card: “A” and “B”
Prompt: “Which is larger?”

Interaction:
- Selecting A/B and clicking “Check”
- Or allow single-click selection that immediately checks (choose one; default to explicit “Check” for calm pacing)

Feedback:
- Show correct answer, short explanation, and optional hint toggle “See why”
- Provide “Next” button

---

## Screens / Components
### Pages
- StartPage
  - Title, 1–2 line description
  - Button: “Start”
  - Optional settings (session length) but keep minimal

- WorkoutPage
  - Top bar: progress bar, “Question X of 12”
  - Main card: prompt + two fraction option cards (A/B)
  - Primary CTA: “Check”
  - Feedback drawer/card after submission
  - Skill Growth modal/panel at checkpoints

- SummaryPage
  - Calm completion message
  - Skill Growth summary (same style)
  - “Restart” button

### Reusable Components
- FractionCard (for A/B)
- FeedbackCard
- SkillGrowthPanel
- ProgressBar
- MinimalNumberLine (for benchmark_half)

---

## Copy Deck (use these exact strings or close variants)
Start:
- Title: “Fraction Comparison”
- Subtitle: “A short workout to sharpen your fraction comparison skills.”

Buttons:
- “Start”
- “Check”
- “Next”
- “Continue”
- “Restart”

Feedback:
- Correct: “Correct.”
- Incorrect: “Not quite.”

Example strategy lines by category:
- same_denominator: “Same denominators: compare the numerators.”
- same_numerator: “Same numerator: the smaller denominator is larger pieces.”
- benchmark_half: “Use 1/2 as a benchmark. Is each fraction above or below 1/2?”
- unlike_denominator: “When denominators differ, compare using a common denominator or a benchmark like 1/2.”

Skill Growth phrases:
- “Strong consistency in ____ comparisons.”
- “Improving accuracy in ____.”
- “Making steady progress in ____.”

---

## Data: Provide a Seed Question Bank
Include at least:
- 8 questions per category (32 total)
- Each category spans difficulty 1–3
Examples:
- same_denominator: 3/7 vs 5/7 (easy)
- same_numerator: 3/5 vs 3/8 (easy)
- benchmark_half: 4/9 vs 5/8 (medium)
- unlike_denominator: 2/3 vs 3/5 (medium)

Ensure correctChoice is accurate.

---

## Implementation Notes
- Use React + TypeScript if possible.
- Use a simple router (React Router).
- Keep styling simple (Tailwind or CSS modules).
- No external math libraries required.
- Ensure components are accessible (keyboard focus for choices).
- The prototype should be runnable via `npm install && npm run dev` (or similar).

Deliverables:
- Source code implementing the above
- Clear separation: `src/state/*` for store/engine, `src/components/*`, `src/pages/*`
- Deterministic session behavior if a seed is set (optional but preferred)

Build it now.
