You are required to build Prototype from Spec Files (Safe + Deterministic)

You are Amp (Sourcegraph). Your job is to generate a runnable React prototype from the provided spec artifacts:
- ~/Downloads/des_prototype/guided-adaptive-workout.md (text spec)
- ~/Downloads/des_prototype/guided-adaptive-workout.json (structured build spec)

## 1) Source of Truth & Precedence Rules
1. The JSON file is the **system-of-record** for architecture, routes, state shape, engine rules, copy, and components.
2. The Markdown file provides **additional narrative constraints** and clarifications. If there is any conflict:
   - Prefer JSON for implementation details.
   - Prefer Markdown for UX tone rules and behavioral nuance.
3. Do not invent product requirements beyond these files. If you must make a choice for implementation (minor UI/layout), choose the simplest option that preserves dignity + subtle progress visibility.

## 2) Hard Constraints (Do Not Violate)
- Build a **React + TypeScript** app.
- Use **headless state**: all adaptation logic and session logic must live outside UI components (in `src/state/*`).
- No backend. No network calls. No external services.
- No ML. Use the specified simple adaptive engine rules.
- UI must be calm, minimalist, mature. No childish visuals, no gamified fireworks.
- No explicit deficit labeling (“weak”, “low”, “poor”, “needs improvement”).
- Feedback must be **non-assumptive**: never claim why the student chose an answer.
- Controlled “Skill Growth” appears only at checkpoints (after Q6 and Q12), is dismissible, and uses growth-oriented phrasing.

## 3) Build Plan
### Step A — Scaffold
Create a Vite React + TS project structure (or equivalent) and implement routes:
- `/` → StartPage
- `/workout` → WorkoutPage
- `/summary` → SummaryPage

### Step B — State Layer (Headless)
Implement `src/state/types.ts`, `questionBank.ts`, `engine.ts`, `store.ts` exactly per JSON spec:
- store shape, actions, selectors
- deterministic seeded random (mulberry32 or equivalent)
- adaptive selection:
  - weighted category selection based on accuracy
  - difficulty selection (1–3) based on category performance and recent wrongs
  - repeated-error intervention (recentWrongCount >= 2 → next in category reduces difficulty by 1, min 1)
  - avoid repeating question IDs in session
- checkpoint logic and UI flags handled by store, not pages

### Step C — Question Bank
Implement at least 32 questions:
- 8+ per category
- difficulties 1–3 represented per category
- correctChoice must be accurate
- include benchmark_half questions that can optionally display MinimalNumberLine (0, 1/2, 1)

### Step D — UI Layer
Build components from spec:
- ProgressBar
- FractionOptionCard
- FeedbackCard
- SkillGrowthPanel
- MinimalNumberLine
Pages:
- StartPage: title, subtitle, “Start workout”
- WorkoutPage: progress + question, options, “Check”, feedback, checkpoint growth panel
- SummaryPage: completion message + skill growth recap + restart

Styling:
- Use Tailwind (preferred per JSON), minimal and mature.

Interaction design:
- Use explicit “Check” button for calm pacing.
- After checking, show FeedbackCard with “Next”.
- At checkpoint indices, show SkillGrowthPanel with “Continue” and block advancement only until dismissed (briefly).

### Step E — Copy & Tone
Use the copy deck from JSON:
- Titles, subtitles, button labels
- Feedback: “Correct.” / “Not quite.”
- Strategy lines by category
- Skill Growth phrases (strong/improving/steady)

Reinforcement on correct:
- 30% probability (per JSON). Keep it subtle and short.

## 4) Determinism Requirement
If `session.seed` exists, the session’s question sequence should be deterministic given that seed.
Use the seeded RNG in all random choices (category selection, reinforcement probability).

## 5) Safety & Scope Boundaries
- Do not add authentication, persistence, analytics, database, or API calls.
- Do not add AI/LLM features.
- Do not add extra gamification layers.
- Do not introduce explicit skill diagnostics or labels.

## 6) Output Expectations
Deliver a codebase with the file structure specified in JSON `deliverables.file_structure`:
- `src/pages/*`
- `src/components/*`
- `src/state/*`

The prototype must run with:
- `npm install`
- `npm run dev`

## 7) Validation Checklist (before finishing)
- [ ] Adaptation logic lives only in `src/state/*`
- [ ] No deficit labels anywhere
- [ ] Skill Growth appears only at Q3 and Q6, is dismissible, max 3 bullets
- [ ] Incorrect feedback is non-assumptive and strategy-based
- [ ] At least 32 questions, 8+ per category, difficulty 1–3 present
- [ ] No repeated question IDs in a session
- [ ] Seeded determinism works
- [ ] UI feels mature and calm

Now implement the prototype strictly following the two spec files. If a micro-decision is needed, choose the simplest UI that preserves dignity and controlled progress visibility.
