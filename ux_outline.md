# UX Direction — Guided Adaptive Workout (Hybrid of Stealth Adaptation + Controlled Skill Visibility)

## Summary
**Guided Adaptive Workout** is a hybrid UX direction designed for high-school students who are behind in fraction fundamentals but are highly sensitive to being perceived as “behind.” The experience must feel like a mature skill workout—simple, calm, and non-remedial—while still providing enough guidance and progress visibility to build trust, confidence, and sustained engagement.

This direction combines:
- **Stealth Adaptation (Direction 1):** Keep the practice loop simple and avoid explicitly announcing adaptation or labeling ability.
- **Controlled Skill Visibility (Direction 2):** Provide subtle, growth-oriented indications of improvement so the experience does not feel emotionally flat and students can see proof of progress.

The result: an experience that *feels like a drill* but *behaves like adaptive instruction* underneath the surface.

---

## Core Philosophy
1. **Protect dignity first.** Students disengage when the product feels remedial, childish, or patronizing.
2. **Keep the flow simple.** A straightforward question → answer → feedback loop supports completion and reduces cognitive friction.
3. **Make progress legible, not loud.** Students want real improvement, but explicit skill labeling can trigger shame or ego defense.
4. **Help without mind-reading.** Feedback must be non-assumptive—guide correct reasoning without claiming why the student chose an answer.

---

## Experience Overview
The student enters **“Fraction Comparison Workout”**—a neutral, clean UI with no levels or skill labels.

The core loop is intentionally simple:
1. One comparison problem
2. Choose A or B
3. Immediate feedback
4. Continue

Under the hood, the system:
- tags each problem by comparison type,
- tracks performance by type,
- adapts what comes next.

Crucially, **adaptation is never announced**.

At natural checkpoints (e.g., mid-session and end), the experience surfaces a small **Skill Growth** panel to provide controlled visibility into improvement.

---

## Approach to Help

### Correct Answers
- Brief confirmation (“Correct.”)
- Occasional strategy reinforcement (lightweight and intermittent)
  - Example: “Benchmarks can make these faster.”
- Reinforcement is intentionally not constant to avoid noise and maintain a calm tone.

### Incorrect Answers (Non-Assumptive)
When the student is wrong, feedback should:
- Avoid assuming intent (“you chose X because…”).
- Clarify the key concept involved.
- Provide one reliable strategy.
- Offer minimal visual support where helpful (clean number line for benchmark, optional hints elsewhere).

Example:
> “When denominators differ, the size of each piece changes. Try comparing using a common denominator or a benchmark like 1/2.”

### Repeated Error Intervention (Supportive, Not Corrective)
If the student misses twice in the same conceptual category:
- Slightly reduce complexity for the next problem in that category.
- Offer a “Try one like this” follow-up problem to reinforce the strategy.
- Do **not** say: “We’re making it easier.”
- Keep tone neutral and supportive.

This approach prevents disengagement while maintaining the student’s sense of competence and autonomy.

---

## Controlled Skill Visibility (“Skill Growth”)
Pure stealth adaptation can feel emotionally flat: students may not feel progress and may disengage even if learning is occurring.

To fix that, this direction introduces **small, growth-oriented progress visibility** at checkpoints only (not after every question).

Skill Growth is:
- **Positive and neutral**, never deficit-labeled
- **Subtle**, not dominating the flow
- **Dismissible**, not a “report card”

Example:
**Skill Growth**
- Strong consistency in same-denominator comparisons  
- Improving accuracy in unlike denominators  

Rules:
- Never use “weak/low/poor/needs improvement.”
- Avoid red/yellow warning color semantics.
- Prefer phrases over percentages; if numbers are needed, use neutral counts (e.g., “4/6 correct so far”).

This provides proof of progress without broadcasting weakness.

---

## Key Guardrails (To Preserve Dignity)
- No levels or visible remediation signals.
- No “skill diagnosis” language.
- No gamified celebrations that draw attention.
- No category labels per question (optional at checkpoints only).
- Feedback must be concise, calm, and respectful.

---

## Intention & Reasoning Behind the Hybrid
This hybrid intentionally resolves a core tension:

- If adaptation becomes **visible**, students may feel categorized or “placed,” which triggers shame or ego defense.
- If progress remains **invisible**, the experience can feel emotionally flat and unmotivating, reducing trust and persistence.

**Guided Adaptive Workout** keeps adaptation quiet while making improvement visible in a controlled way. It builds earned confidence by:
- preserving identity and autonomy,
- providing strategy-based help without mind-reading,
- showing progress as growth (not deficiency),
- maintaining a simple, completion-friendly flow.

In short:
- It *feels* like a skill workout (simple, mature, not remedial),
- It *functions* like adaptive instruction (targeted practice + strategy feedback),
- It *communicates* growth without broadcasting weakness.
