# Gamification V1 — Design Spec

**Date:** 2026-04-21
**Status:** Approved (brainstorm), pending implementation plan
**Scope:** V1 launch-blocker. Turns Journey to Hashem's lessons from content-heavy reading into interactive, Duolingo-style question-led learning.

## Problem

User feedback from prospective users and friends/family: the app doesn't feel "gamified enough" compared to Duolingo. The root cause identified: lessons are *content-heavy and question-light* — "read, read, read, then one question." Duolingo's pull is the opposite: you're almost always *doing* something, and the app celebrates every small win.

Existing gamification (XP, 6 levels, 11 badges, streaks, flat leaderboard, 3-lessons/day goal) is structurally present but under-delivered because the moment-to-moment lesson loop is passive.

## Guiding Principles

1. **Teach through questions, not lectures.** Frame this as the Talmudic method — authentically Jewish pedagogy, not a Duolingo clone.
2. **Soft failure, not punishment.** Wrong answers explain and let you continue. Running out of hearts costs XP, not access. This is Torah learning, not a commercial game.
3. **Celebrate constantly.** Every correct answer, every lesson completion, every streak milestone gets visible and audible feedback.
4. **Ship fast, polish later.** V1 uses emoji icons (routed through a single component) so the SVG swap is one later refactor.
5. **English by default, Hebrew optional.** Users without a Hebrew keyboard can complete everything. Hebrew typers get credit if they type in Hebrew.

## V1 Scope

### 1. Lesson Format Restructure

**Current (per lesson):** 3–5 reading slides → 1 question. ~1 question per lesson.

**New (per lesson):** 1 hook slide + 8 questions + optional "Read More" + wrap slide. Target 3–5 minutes.

```
[Hook slide]             ~2 sentences introducing the concept
[Question 1]             easiest — recognition
[Question 2]             slightly harder
[Teach slide]            ≤40 words, adds a layer
[Question 3]             applies the new layer
[Question 4]             recall (typed)
[Teach slide]            ≤40 words, Hebrew term + source
[Question 5]             tests the source
[Question 6]             harder synthesis
[Question 7]             typed translation
[Question 8]             review — ties it together
[Wrap slide]             1 sentence + source citation
[Read More — optional]   extra written context, commentaries, sources
```

**Rules:**
- Every teach slide ≤40 words. If longer, split with a question in between.
- Maximum 2 teach slides in a row before a question.
- Hebrew may appear in teach slides (שבת) as reference, but is never required as input.
- "Read More" is text + sources only in V1 (no rabbi audio).

### 2. Question Types (6 for V1)

| # | Type | Description | Grading |
|---|------|-------------|---------|
| 1 | Multiple choice | 4 options, 1 correct | Exact match |
| 2 | True / False | Statement + T/F | Exact match |
| 3 | Fill the blank (typed) | Sentence with `___`, user types the missing word | Case-insensitive, trim, variants list, 1-char typo tolerance on 6+ letter words |
| 4 | Type the translation | "Type the English meaning of _X_" | Same typed grading as #3 |
| 5 | Match the pairs | Tap to pair Hebrew terms with English meanings | All pairs correct |
| 6 | Order the steps | Drag 4 cards into correct sequence | Exact order |

**Per lesson mix:** 4 multiple choice, 1 T/F, 1 fill-blank, 1 match, 1 order. Tunable per lesson based on content.

**Typed-answer grading details:**
- Each question has an `answer_variants: string[]` — e.g., `["challah", "hallah", "chalah"]`.
- Case-insensitive compare, whitespace trimmed.
- 1-character Levenshtein distance on answers of 6+ characters → "Almost! You typed _X_, the answer is _Y_" and counts as correct.
- If the user types in Hebrew (detected via Unicode range `\u0590-\u05FF`), check against `answer_variants_he: string[]` if present. Never required — English always accepted.

**Wrong answer flow (all types):**
- Red border shake animation on the option/input.
- Short explanation appears inline below the question (≤2 sentences).
- "Continue" button — never dead-ends.
- Costs exactly 1 heart per wrong submission (not per wrong option / wrong pair / wrong step — one submission = one heart max, regardless of how many micro-errors it contains).
- The user does **not** get a retry attempt on the same question in the same iteration — they see the correct answer, then continue. The question is re-inserted at the end of the lesson for re-testing (spaced recall within the session).
- For **match** and **order**: a submission is "wrong" if any pair/step is wrong. The correct pairing/order is shown before continuing.

### 3. Micro-celebrations

**Per correct answer:**
- Green pulse on the answer element
- Subtle chime sound (respects device silent mode)
- Animated XP shard flies from answer to XP counter in header
- Streak of 3+ correct in a row → "On fire! 🔥" banner + 2 bonus XP

**Per lesson completion:**
- Confetti burst
- XP total animates up to new value
- Haptic feedback on mobile
- CongratsScreen (existing) shows: XP earned, hearts remaining, badges unlocked, perfect-lesson bonus

### 4. Hearts System

- User starts with **5 hearts**.
- Lose 1 per wrong answer within a lesson.
- Running out of hearts mid-lesson: user may still finish the lesson but earns **0 XP** for that lesson (no base XP, no bonuses, no streak multiplier applied). Streak and streak-of-correct are **not** broken by running out of hearts — it still counts as a lesson completed for streak/daily-goal purposes. (Soft failure — never locked out.)
- Hearts regenerate at **1 per 30 minutes**, and fully refill to 5 at the start of a new day (local midnight).
- Perfect lesson (0 wrong answers) = +5 bonus XP.
- Shown in the header next to XP.

### 5. XP Bonuses

- First lesson of the day: **+5 XP**.
- Perfect lesson (0 wrong answers): **+5 XP**.
- Streak multiplier applied to all XP earned:
  - 7-day streak: ×1.2
  - 30-day streak: ×1.5
  - 100-day streak: ×2.0
- Streak-of-correct (3+ in a row within a lesson): +2 XP per correct after the 3rd.

Base XP per lesson remains **10**, so a perfect-first-of-day lesson on a 30-day streak = `(10 + 5 + 5) × 1.5 = 30 XP`.

### 6. Streak Freeze

- Every user gets **1 free streak freeze per week** (resets Sunday).
- Auto-applies if the user misses a full day.
- Shown on the home tab when available ("🧊 Streak freeze ready").
- Shown consumed ("🧊 Streak freeze used on [date]") when applied.
- Existing Shabbat streak-pause logic is kept and is separate from streak freeze.

### 7. Icon Component

- Single `<Icon name="heart" />` (or equivalent) component with an `ICONS` map.
- V1 uses emoji strings as values (`heart: "❤️"`, `streak: "🔥"`, etc.).
- All existing emoji usage in the codebase migrates to use this component.
- Post-V1 SVG swap = edit the `ICONS` map and the component's render.
- No scattered emoji literals in JSX.

### 8. Content Rewrite — All 25 Lessons

All existing lessons in `LEARNING_PATH` must be rewritten to the new format.

**Rewrite process (chunked):**
- Work in **chunks of 5 lessons** (one unit) per implementation session to avoid context limits.
- Each chunk: produce hook slide, 8 questions with answer variants, wrap slide, Read More content, source citations.
- Preserve all existing source citations (Talmud, Rambam, Zohar, etc.) — they move to the wrap slide or Read More.
- No rabbi audio references in the rewritten lessons.

## V1 Non-Goals (Explicit Cuts)

- Sign-in, accounts, cross-device sync (keep localStorage)
- Push notifications
- Payments / paid features
- Daily Quests (V1.1)
- Leagues / tiered leaderboard (V1.1 — keep existing flat leaderboard for now)
- Custom SVG icons (V1.1)
- Animated Magen David "companion" reactions (V1.1)
- Rabbi audio, live, video
- Hebrew typing as required input
- Friend streaks / social features
- Purchasable gems / heart refills / streak freezes
- Custom mascot character

## V1.1 (post-launch, fast follow)

1. Daily Quests — 3 varied quests per day from a pool of ~10, bonus chest on all-complete
2. Leagues — Bronze/Silver/Gold/Sapphire/Ruby/Diamond (naming: Talmid/Chaver/Chacham/Maggid/Moreh/Rav), weekly promotion/demotion, 20 users per cohort
3. Custom SVG icon set replacing all emojis
4. Animated Magen David "companion" — glows/pulses on correct answers, bigger reaction on lesson complete

## Data Shape (sketch, not binding)

```js
// Lesson
{
  id: "1.1",
  title: "Who is Hashem?",
  hook: "Shabbat is the Jewish day of rest…",
  teachSlides: [
    { body: "≤40 words…" },
    { body: "≤40 words with Hebrew: שבת — 'to rest'" }
  ],
  questions: [
    { type: "multiple_choice", prompt: "...", options: [...], correct: 2, explanation: "..." },
    { type: "fill_blank", prompt: "...", answer_variants: ["fourth", "4th"], explanation: "..." },
    { type: "typed_translation", prompt: "Type the English meaning of Shabbat", answer_variants: ["rest", "to rest"], answer_variants_he: ["מנוחה"], explanation: "..." },
    // ...
  ],
  wrap: "1 sentence + source",
  sources: ["Talmud, Shabbat 10b", "Rambam, Hilchot Shabbat 1:1"],
  readMore: "extra text…"
}

// User state additions
{
  hearts: 5,
  heartsLastRegen: <timestamp>,
  streakFreezeAvailable: true,
  streakFreezeUsedAt: null,
  perfectLessons: 3,
  dailyQuests: [],  // V1.1
  league: null      // V1.1
}
```

## Success Criteria

V1 is done when:
- All 25 lessons are in new format with 8 questions each
- All 6 question types work end-to-end
- Hearts, XP bonuses, streak freeze, micro-celebrations all functional
- Typed answers accept variants and 1-char typos
- Hebrew Unicode input accepted but not required
- All icons route through `<Icon>` component
- Existing users can migrate localStorage state without data loss
- Existing features (onboarding, badges, profile, flat leaderboard, Shabbat pause, community tab) still work

## Open Questions (for implementation plan)

- Exact sound effects — source a small free library or commission? (Probably free library for V1.)
- Confetti library — existing JS library (canvas-confetti) or hand-rolled CSS?
- Typo tolerance — Levenshtein distance implementation: inline utility or tiny npm package?
- State migration — localStorage schema version bump and migration function for existing users with old lesson-completed state.

## References

- Duolingo gamification: streaks drive 60% engagement, 7-day streakers are 3.6× more likely to stay long-term; streak freeze reduced churn 21%; leagues launched after positive 2018 A/B test.
- Manna (Bible Duolingo): uses hearts, streaks, Manna Points, evolving lamb character, friend streaks, AI-personalized paths.
- Talmudic pedagogy: question → answer → challenge → resolution. Justifies question-first learning as authentically Jewish, not a pure Duolingo copy.
