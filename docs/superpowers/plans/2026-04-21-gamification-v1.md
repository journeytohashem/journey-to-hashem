# Gamification V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the lesson experience from content-heavy reading to Duolingo-style question-led learning, with hearts, XP bonuses, streak freeze, micro-celebrations, an icon component, and 25 rewritten lessons.

**Architecture:** The codebase is currently one 1,870-line file (`pages/index.jsx`). We extract pure gameplay logic into `lib/` (testable with Vitest), move lesson data into `data/lessons/<unit>.js`, add reusable UI components under `components/`, and leave the main `App` / routing in `pages/index.jsx`. localStorage schema bumps from `jth-v3` to `jth-v4` with a migration function — existing users keep their progress.

**Tech Stack:** Next.js 14.2.3, React 18.3.1, Vitest (new), canvas-confetti (new). No TypeScript. No CSS framework — styles remain in `styles/globals.css`.

**Spec:** [docs/superpowers/specs/2026-04-21-gamification-v1-design.md](../specs/2026-04-21-gamification-v1-design.md)

---

## File Structure

### New files
- `vitest.config.js` — test runner config
- `lib/grading.js` — typed-answer grading, Levenshtein, Hebrew detection
- `lib/grading.test.js` — tests for grading
- `lib/gameplay.js` — hearts regen, XP bonuses, streak logic, streak freeze
- `lib/gameplay.test.js` — tests for gameplay
- `lib/celebrations.js` — Web Audio chime/buzz + canvas-confetti wrapper
- `lib/migrate.js` — localStorage migration `jth-v3` → `jth-v4`
- `lib/migrate.test.js` — tests for migration
- `components/Icon.jsx` — `<Icon name="..." />` with `ICONS` map
- `components/Hearts.jsx` — header hearts display
- `components/Question.jsx` — dispatcher + all 6 question-type renderers
- `components/LessonPlayer.jsx` — new lesson flow (hook, questions, teach slides, wrap, spaced recall)
- `data/lessons/index.js` — exports `LEARNING_PATH`
- `data/lessons/unit1.js` … `data/lessons/unit5.js` — rewritten lessons (one per unit)

### Modified files
- `package.json` — add `vitest`, `canvas-confetti`, add `"test"` script
- `pages/index.jsx` — remove LEARNING_PATH/Exercise/LessonScreen/CongratsScreen (move to modules); update `App`, `DEFAULT_STATE`, `handleLessonComplete`; remove rabbi audio UI; swap emoji literals for `<Icon>`
- `styles/globals.css` — add classes for hearts, new question types, celebrations, shake animation

---

## Conventions

- **Line width:** follow existing style (no strict limit, but keep readable).
- **Imports:** use relative paths from the file (`../lib/gameplay`).
- **Testing framework:** Vitest. Run tests with `npm test`.
- **Commit message format:** Conventional Commits (matches existing history: `feat:`, `fix:`, `test:`, `chore:`, `docs:`, `refactor:`).
- **Commit every task.** Each task ends with a commit step.
- **No behavior change between phases:** after each task, `npm run dev` must still boot. Keep the old Exercise/LessonScreen code in place until the new LessonPlayer is wired in (Task 22).

---

## Phase 1: Test Infra & Icon Component

### Task 1: Install Vitest and add test script

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`

- [ ] **Step 1: Install Vitest and canvas-confetti**

Run:
```bash
cd /Users/salomonelie/Projects/journey-to-hashem
npm install --save-dev vitest @vitest/ui jsdom
npm install --save canvas-confetti
```

Expected: dependencies added, no errors.

- [ ] **Step 2: Add `test` script to `package.json`**

In `package.json`, inside `"scripts"`, add:
```json
"test": "vitest",
"test:run": "vitest run"
```

Final `"scripts"` block:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "deploy": "next build && netlify deploy --prod --dir=out",
  "test": "vitest",
  "test:run": "vitest run"
}
```

- [ ] **Step 3: Create `vitest.config.js`**

Create `vitest.config.js` at the project root:
```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['lib/**/*.test.js', 'components/**/*.test.{js,jsx}'],
  },
});
```

- [ ] **Step 4: Sanity-check the test runner**

Create a throwaway file `lib/_sanity.test.js`:
```js
import { describe, it, expect } from 'vitest';
describe('sanity', () => {
  it('adds numbers', () => { expect(1 + 1).toBe(2); });
});
```

Run: `npm run test:run`
Expected: 1 test passes. Delete `lib/_sanity.test.js` afterwards.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.js
git commit -m "chore: add Vitest and canvas-confetti for gamification V1"
```

---

### Task 2: Build the Icon component

**Files:**
- Create: `components/Icon.jsx`
- Create: `components/Icon.test.jsx`

- [ ] **Step 1: Write failing test**

Install `@testing-library/react` first if needed. Actually, for Icon we only need to verify the emoji map renders correctly — we can do this without React Testing Library by calling the component as a function.

Create `components/Icon.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { ICONS, iconFor } from './Icon.jsx';

describe('ICONS map', () => {
  it('contains required V1 icon names', () => {
    const required = ['heart', 'streak', 'xp', 'star', 'freeze', 'check', 'close', 'fire', 'trophy', 'torah', 'star_of_david', 'bookmark', 'sparkle', 'lock', 'first_step'];
    for (const name of required) {
      expect(ICONS[name]).toBeDefined();
    }
  });

  it('iconFor returns the emoji for a known name', () => {
    expect(iconFor('heart')).toBe(ICONS.heart);
  });

  it('iconFor returns empty string for unknown name', () => {
    expect(iconFor('nonexistent')).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- components/Icon`
Expected: FAIL — "Failed to resolve import './Icon.jsx'".

- [ ] **Step 3: Create `components/Icon.jsx`**

```jsx
import React from 'react';

export const ICONS = {
  // V1 gamification
  heart: '❤️',
  heart_empty: '🤍',
  streak: '🔥',
  fire: '🔥',
  xp: '⭐',
  star: '⭐',
  freeze: '🧊',
  check: '✓',
  close: '✕',
  trophy: '🏆',
  sparkle: '✨',
  lock: '🔒',
  bookmark: '🔖',
  bookmark_outline: '🏷️',

  // Badges / existing
  first_step: '🌱',
  shabbat_soul: '🕯️',
  lightning: '⚡',
  scholar: '💫',
  books: '📚',
  calendar: '📅',
  star_of_david: '✡️',
  torah: '📜',
  synagogue: '🕍',
  note: '📝',

  // Lesson icons
  candle: '🕯️',
  havdalah: '🌟',
  prayer: '🙏',
  holiday: '🎉',

  // UI
  search: '🔍',
  pencil: '✏️',
};

export function iconFor(name) {
  return ICONS[name] || '';
}

export default function Icon({ name, size = 'inherit', title, style = {}, className = '' }) {
  const char = iconFor(name);
  if (!char) return null;
  return (
    <span
      className={className}
      role="img"
      aria-label={title || name}
      style={{ fontSize: size === 'inherit' ? undefined : size, lineHeight: 1, ...style }}
    >
      {char}
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- components/Icon`
Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/Icon.jsx components/Icon.test.jsx
git commit -m "feat: add Icon component with V1 emoji map"
```

---

## Phase 2: Gameplay Pure Logic (TDD)

### Task 3: Grading module — Levenshtein + Hebrew detection

**Files:**
- Create: `lib/grading.js`
- Create: `lib/grading.test.js`

- [ ] **Step 1: Write failing tests**

Create `lib/grading.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { levenshtein, containsHebrew, normalize, gradeTyped, gradeMatchPairs, gradeOrderSteps } from './grading.js';

describe('levenshtein', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshtein('challah', 'challah')).toBe(0);
  });
  it('returns 1 for single substitution', () => {
    expect(levenshtein('challah', 'challat')).toBe(1);
  });
  it('returns 2 for two edits', () => {
    expect(levenshtein('cat', 'dog')).toBe(3);
  });
});

describe('containsHebrew', () => {
  it('returns true for Hebrew characters', () => {
    expect(containsHebrew('שבת')).toBe(true);
    expect(containsHebrew('hello שבת')).toBe(true);
  });
  it('returns false for English-only strings', () => {
    expect(containsHebrew('shabbat')).toBe(false);
  });
});

describe('normalize', () => {
  it('lowercases and trims', () => {
    expect(normalize('  Challah  ')).toBe('challah');
  });
  it('collapses internal whitespace', () => {
    expect(normalize('to   rest')).toBe('to rest');
  });
});

describe('gradeTyped', () => {
  it('accepts exact match against variants', () => {
    expect(gradeTyped('challah', ['challah', 'hallah'])).toEqual({ correct: true, typo: false });
  });
  it('accepts case/whitespace-insensitive match', () => {
    expect(gradeTyped('  CHALLAH  ', ['challah'])).toEqual({ correct: true, typo: false });
  });
  it('accepts any listed variant', () => {
    expect(gradeTyped('hallah', ['challah', 'hallah', 'chalah']).correct).toBe(true);
  });
  it('accepts 1-char typo on 6+ letter words', () => {
    expect(gradeTyped('challat', ['challah'])).toEqual({ correct: true, typo: true });
  });
  it('rejects 1-char typo on short words', () => {
    expect(gradeTyped('cap', ['cat'])).toEqual({ correct: false, typo: false });
  });
  it('rejects wrong answer', () => {
    expect(gradeTyped('bagel', ['challah'])).toEqual({ correct: false, typo: false });
  });
  it('checks Hebrew variants when input is Hebrew', () => {
    expect(gradeTyped('מנוחה', ['rest'], ['מנוחה'])).toEqual({ correct: true, typo: false });
  });
  it('falls back to English when Hebrew variants absent', () => {
    expect(gradeTyped('שבת', ['rest'])).toEqual({ correct: false, typo: false });
  });
});

describe('gradeMatchPairs', () => {
  it('accepts when every pair is correct', () => {
    const correct = { a: 1, b: 2, c: 3 };
    expect(gradeMatchPairs({ a: 1, b: 2, c: 3 }, correct)).toBe(true);
  });
  it('rejects when any pair is wrong', () => {
    const correct = { a: 1, b: 2, c: 3 };
    expect(gradeMatchPairs({ a: 1, b: 3, c: 2 }, correct)).toBe(false);
  });
});

describe('gradeOrderSteps', () => {
  it('accepts exact order', () => {
    expect(gradeOrderSteps(['a','b','c','d'], ['a','b','c','d'])).toBe(true);
  });
  it('rejects any out-of-order', () => {
    expect(gradeOrderSteps(['a','c','b','d'], ['a','b','c','d'])).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- lib/grading`
Expected: FAIL — "Failed to resolve import './grading.js'".

- [ ] **Step 3: Create `lib/grading.js`**

```js
// Hebrew Unicode block: \u0590-\u05FF
const HEBREW_RE = /[\u0590-\u05FF]/;

export function containsHebrew(s) {
  return HEBREW_RE.test(s);
}

export function normalize(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g, ' ');
}

export function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev = new Array(b.length + 1);
  const cur = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(
        cur[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j];
  }
  return prev[b.length];
}

/**
 * Grade a typed answer against a list of English and optional Hebrew variants.
 * Returns { correct: boolean, typo: boolean }. typo=true means 1-char off on a 6+ letter word — still correct.
 */
export function gradeTyped(input, variantsEn = [], variantsHe = []) {
  const raw = String(input);
  const useHebrew = containsHebrew(raw);
  const variants = useHebrew && variantsHe.length > 0 ? variantsHe : variantsEn;
  const user = normalize(raw);
  if (!user) return { correct: false, typo: false };

  for (const v of variants) {
    const target = normalize(v);
    if (user === target) return { correct: true, typo: false };
  }
  // Typo tolerance: only for answers where target length >= 6
  for (const v of variants) {
    const target = normalize(v);
    if (target.length >= 6 && levenshtein(user, target) === 1) {
      return { correct: true, typo: true };
    }
  }
  return { correct: false, typo: false };
}

/**
 * Grade pair-matching question. userPairs and correctPairs are objects like {leftId: rightId}.
 */
export function gradeMatchPairs(userPairs, correctPairs) {
  const keys = Object.keys(correctPairs);
  if (Object.keys(userPairs).length !== keys.length) return false;
  return keys.every(k => userPairs[k] === correctPairs[k]);
}

/**
 * Grade ordering question. Both are arrays of step IDs in the user's chosen order.
 */
export function gradeOrderSteps(userOrder, correctOrder) {
  if (userOrder.length !== correctOrder.length) return false;
  return userOrder.every((s, i) => s === correctOrder[i]);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- lib/grading`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/grading.js lib/grading.test.js
git commit -m "feat: add typed-answer grading with Levenshtein and Hebrew detection"
```

---

### Task 4: Gameplay module — hearts, XP bonuses, streak, streak freeze

**Files:**
- Create: `lib/gameplay.js`
- Create: `lib/gameplay.test.js`

- [ ] **Step 1: Write failing tests**

Create `lib/gameplay.test.js`:
```js
import { describe, it, expect } from 'vitest';
import {
  MAX_HEARTS, HEART_REGEN_MS,
  regenerateHearts, consumeHeart,
  streakMultiplier, computeLessonXP,
  shouldAutoFreeze, applyStreakFreeze, maybeRefreshWeeklyFreeze,
  isNewDay, isSameDay, getTodayKey
} from './gameplay.js';

const HOUR = 3600_000;

describe('hearts', () => {
  it('MAX_HEARTS is 5 and HEART_REGEN_MS is 30 minutes', () => {
    expect(MAX_HEARTS).toBe(5);
    expect(HEART_REGEN_MS).toBe(30 * 60 * 1000);
  });

  it('regenerateHearts refills to MAX on a new day', () => {
    const now = new Date('2026-04-21T09:00:00Z').getTime();
    const yesterday = new Date('2026-04-20T09:00:00Z').getTime();
    const result = regenerateHearts({ hearts: 0, heartsLastRegen: yesterday }, now);
    expect(result.hearts).toBe(5);
  });

  it('regenerateHearts adds 1 per 30 minutes elapsed, capped at MAX', () => {
    const now = 1_000_000_000_000;
    const lastRegen = now - 65 * 60 * 1000; // 65 min ago → 2 hearts earned
    const result = regenerateHearts({ hearts: 2, heartsLastRegen: lastRegen }, now);
    expect(result.hearts).toBe(4);
    // Leftover 5 minutes retained by setting heartsLastRegen = now - 5min
    expect(result.heartsLastRegen).toBe(now - 5 * 60 * 1000);
  });

  it('regenerateHearts does not exceed MAX', () => {
    const now = 1_000_000_000_000;
    const result = regenerateHearts({ hearts: 5, heartsLastRegen: now - 10 * HOUR }, now);
    expect(result.hearts).toBe(5);
    expect(result.heartsLastRegen).toBe(now);
  });

  it('consumeHeart decrements and sets last regen to now if was full', () => {
    const now = 1000;
    const r1 = consumeHeart({ hearts: 5, heartsLastRegen: 0 }, now);
    expect(r1.hearts).toBe(4);
    expect(r1.heartsLastRegen).toBe(now);
  });

  it('consumeHeart does not set last regen when not full (regen clock continues)', () => {
    const r = consumeHeart({ hearts: 3, heartsLastRegen: 500 }, 1000);
    expect(r.hearts).toBe(2);
    expect(r.heartsLastRegen).toBe(500);
  });

  it('consumeHeart never goes below 0', () => {
    const r = consumeHeart({ hearts: 0, heartsLastRegen: 0 }, 1000);
    expect(r.hearts).toBe(0);
  });
});

describe('streakMultiplier', () => {
  it('returns 1.0 below 7 days', () => {
    expect(streakMultiplier(0)).toBe(1);
    expect(streakMultiplier(6)).toBe(1);
  });
  it('returns 1.2 at 7-29 days', () => {
    expect(streakMultiplier(7)).toBe(1.2);
    expect(streakMultiplier(29)).toBe(1.2);
  });
  it('returns 1.5 at 30-99 days', () => {
    expect(streakMultiplier(30)).toBe(1.5);
    expect(streakMultiplier(99)).toBe(1.5);
  });
  it('returns 2.0 at 100+ days', () => {
    expect(streakMultiplier(100)).toBe(2);
    expect(streakMultiplier(365)).toBe(2);
  });
});

describe('computeLessonXP', () => {
  it('base 10 XP, no bonuses, no streak', () => {
    expect(computeLessonXP({ wrongAnswers: 2, isFirstOfDay: false, streak: 0, ranOutOfHearts: false })).toBe(10);
  });
  it('perfect lesson first-of-day on 30-day streak: (10 + 5 + 5) * 1.5 = 30', () => {
    expect(computeLessonXP({ wrongAnswers: 0, isFirstOfDay: true, streak: 30, ranOutOfHearts: false })).toBe(30);
  });
  it('returns 0 if ran out of hearts', () => {
    expect(computeLessonXP({ wrongAnswers: 3, isFirstOfDay: true, streak: 30, ranOutOfHearts: true })).toBe(0);
  });
  it('rounds down to integer', () => {
    // base 10, 7-day streak = x1.2 → 12
    expect(computeLessonXP({ wrongAnswers: 1, isFirstOfDay: false, streak: 7, ranOutOfHearts: false })).toBe(12);
  });
  it('perfect lesson adds +5', () => {
    // base 10 + 5 perfect = 15, no multiplier
    expect(computeLessonXP({ wrongAnswers: 0, isFirstOfDay: false, streak: 0, ranOutOfHearts: false })).toBe(15);
  });
  it('first-of-day adds +5', () => {
    expect(computeLessonXP({ wrongAnswers: 1, isFirstOfDay: true, streak: 0, ranOutOfHearts: false })).toBe(15);
  });
});

describe('date helpers', () => {
  it('getTodayKey returns YYYY-MM-DD in local time', () => {
    const d = new Date('2026-04-21T15:00:00Z');
    // Key is "2026-04-21" regardless of TZ if we use local date
    expect(getTodayKey(d)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it('isSameDay true for same calendar day', () => {
    expect(isSameDay('2026-04-21', '2026-04-21')).toBe(true);
  });
  it('isSameDay false for different days', () => {
    expect(isSameDay('2026-04-21', '2026-04-22')).toBe(false);
  });
  it('isNewDay true when lastActiveDate missing', () => {
    expect(isNewDay(null, '2026-04-21')).toBe(true);
  });
  it('isNewDay false when same day', () => {
    expect(isNewDay('2026-04-21', '2026-04-21')).toBe(false);
  });
});

describe('streak freeze', () => {
  it('shouldAutoFreeze returns true when missed exactly 1 day and freeze available', () => {
    expect(shouldAutoFreeze({ lastActiveDate: '2026-04-19', streakFreezeAvailable: true }, '2026-04-21')).toBe(true);
  });
  it('shouldAutoFreeze returns false when missed 2+ days', () => {
    expect(shouldAutoFreeze({ lastActiveDate: '2026-04-18', streakFreezeAvailable: true }, '2026-04-21')).toBe(false);
  });
  it('shouldAutoFreeze returns false when freeze unavailable', () => {
    expect(shouldAutoFreeze({ lastActiveDate: '2026-04-19', streakFreezeAvailable: false }, '2026-04-21')).toBe(false);
  });
  it('shouldAutoFreeze returns false when lastActive is today or yesterday', () => {
    expect(shouldAutoFreeze({ lastActiveDate: '2026-04-20', streakFreezeAvailable: true }, '2026-04-21')).toBe(false);
    expect(shouldAutoFreeze({ lastActiveDate: '2026-04-21', streakFreezeAvailable: true }, '2026-04-21')).toBe(false);
  });
  it('applyStreakFreeze marks unavailable and records usedAt', () => {
    const r = applyStreakFreeze({ streakFreezeAvailable: true, streakFreezeUsedAt: null }, '2026-04-21');
    expect(r.streakFreezeAvailable).toBe(false);
    expect(r.streakFreezeUsedAt).toBe('2026-04-21');
  });
  it('maybeRefreshWeeklyFreeze re-grants freeze on Sunday if not already refreshed this week', () => {
    // Sunday 2026-04-19
    const r = maybeRefreshWeeklyFreeze({ streakFreezeAvailable: false, streakFreezeRefreshedWeek: null }, '2026-04-19');
    expect(r.streakFreezeAvailable).toBe(true);
  });
  it('maybeRefreshWeeklyFreeze does nothing on non-Sunday', () => {
    const r = maybeRefreshWeeklyFreeze({ streakFreezeAvailable: false, streakFreezeRefreshedWeek: null }, '2026-04-21');
    expect(r.streakFreezeAvailable).toBe(false);
  });
  it('maybeRefreshWeeklyFreeze idempotent for same week', () => {
    const initial = maybeRefreshWeeklyFreeze({ streakFreezeAvailable: false, streakFreezeRefreshedWeek: null }, '2026-04-19');
    const r2 = maybeRefreshWeeklyFreeze({ ...initial, streakFreezeAvailable: false }, '2026-04-19');
    expect(r2.streakFreezeAvailable).toBe(false); // already refreshed this Sunday
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- lib/gameplay`
Expected: FAIL — module missing.

- [ ] **Step 3: Create `lib/gameplay.js`**

```js
export const MAX_HEARTS = 5;
export const HEART_REGEN_MS = 30 * 60 * 1000;
export const BASE_LESSON_XP = 10;
export const FIRST_OF_DAY_BONUS = 5;
export const PERFECT_LESSON_BONUS = 5;

// ── date helpers ─────────────────────────────────────
export function getTodayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isSameDay(a, b) {
  return a === b;
}

export function isNewDay(lastActiveDate, todayKey) {
  if (!lastActiveDate) return true;
  return !isSameDay(lastActiveDate, todayKey);
}

function parseDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function daysBetween(a, b) {
  const da = parseDate(a);
  const db = parseDate(b);
  return Math.round((db - da) / (24 * 3600_000));
}

// ── hearts ───────────────────────────────────────────
export function regenerateHearts(state, now = Date.now()) {
  const { hearts, heartsLastRegen } = state;
  // New-day refill: if heartsLastRegen's calendar day < today's calendar day, refill to MAX
  const lastDay = getTodayKey(new Date(heartsLastRegen || now));
  const todayKey = getTodayKey(new Date(now));
  if (lastDay !== todayKey) {
    return { hearts: MAX_HEARTS, heartsLastRegen: now };
  }
  if (hearts >= MAX_HEARTS) {
    return { hearts: MAX_HEARTS, heartsLastRegen: now };
  }
  const elapsed = now - (heartsLastRegen || now);
  const earned = Math.floor(elapsed / HEART_REGEN_MS);
  const newHearts = Math.min(MAX_HEARTS, hearts + earned);
  const leftover = elapsed - earned * HEART_REGEN_MS;
  const newLast = newHearts >= MAX_HEARTS ? now : now - leftover;
  return { hearts: newHearts, heartsLastRegen: newLast };
}

export function consumeHeart(state, now = Date.now()) {
  const wasFull = state.hearts >= MAX_HEARTS;
  return {
    hearts: Math.max(0, state.hearts - 1),
    heartsLastRegen: wasFull ? now : state.heartsLastRegen,
  };
}

// ── streak / XP ──────────────────────────────────────
export function streakMultiplier(streak) {
  if (streak >= 100) return 2;
  if (streak >= 30) return 1.5;
  if (streak >= 7) return 1.2;
  return 1;
}

export function computeLessonXP({ wrongAnswers, isFirstOfDay, streak, ranOutOfHearts }) {
  if (ranOutOfHearts) return 0;
  let xp = BASE_LESSON_XP;
  if (wrongAnswers === 0) xp += PERFECT_LESSON_BONUS;
  if (isFirstOfDay) xp += FIRST_OF_DAY_BONUS;
  xp = Math.floor(xp * streakMultiplier(streak));
  return xp;
}

// ── streak freeze ────────────────────────────────────
export function shouldAutoFreeze(state, todayKey) {
  if (!state.streakFreezeAvailable) return false;
  if (!state.lastActiveDate) return false;
  const gap = daysBetween(state.lastActiveDate, todayKey);
  return gap === 2;
}

export function applyStreakFreeze(state, todayKey) {
  return {
    ...state,
    streakFreezeAvailable: false,
    streakFreezeUsedAt: todayKey,
  };
}

function getWeekKey(dateKey) {
  // Week key = the Sunday of the week containing the date, as YYYY-MM-DD
  const d = parseDate(dateKey);
  const day = d.getDay(); // 0=Sunday
  d.setDate(d.getDate() - day);
  return getTodayKey(d);
}

export function maybeRefreshWeeklyFreeze(state, todayKey) {
  const d = parseDate(todayKey);
  if (d.getDay() !== 0) return state; // only refresh on Sunday
  const weekKey = getWeekKey(todayKey);
  if (state.streakFreezeRefreshedWeek === weekKey) return state;
  return {
    ...state,
    streakFreezeAvailable: true,
    streakFreezeRefreshedWeek: weekKey,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- lib/gameplay`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/gameplay.js lib/gameplay.test.js
git commit -m "feat: add gameplay module (hearts, XP, streak freeze)"
```

---

### Task 5: Celebrations module — Web Audio + confetti

**Files:**
- Create: `lib/celebrations.js`

No tests — this is thin-wrapper glue around Web Audio and canvas-confetti, both tested by their maintainers. We verify by using it in Task 17 and visually confirming.

- [ ] **Step 1: Create `lib/celebrations.js`**

```js
import confetti from 'canvas-confetti';

let audioCtx = null;
function getCtx() {
  if (typeof window === 'undefined') return null;
  if (audioCtx) return audioCtx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  audioCtx = new AC();
  return audioCtx;
}

function tone({ freq = 880, duration = 0.12, type = 'sine', volume = 0.08 }) {
  const ctx = getCtx();
  if (!ctx) return;
  // Some browsers suspend until a user gesture. Resume on each call; harmless if already running.
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playCorrect() {
  tone({ freq: 880, duration: 0.1 });
  setTimeout(() => tone({ freq: 1175, duration: 0.12 }), 90);
}

export function playWrong() {
  tone({ freq: 220, duration: 0.18, type: 'square', volume: 0.05 });
}

export function playLessonComplete() {
  tone({ freq: 523, duration: 0.12 });
  setTimeout(() => tone({ freq: 659, duration: 0.12 }), 110);
  setTimeout(() => tone({ freq: 784, duration: 0.22 }), 220);
}

export function hapticLight() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
}

export function hapticSuccess() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10, 40, 10]);
}

export function burstConfetti() {
  if (typeof window === 'undefined') return;
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#c9a84c', '#ffffff', '#f5d173', '#0d1b2a'],
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/celebrations.js
git commit -m "feat: add celebrations module (Web Audio tones + confetti + haptics)"
```

---

### Task 6: State migration — jth-v3 → jth-v4

**Files:**
- Create: `lib/migrate.js`
- Create: `lib/migrate.test.js`

- [ ] **Step 1: Write failing tests**

Create `lib/migrate.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { migrate, CURRENT_SCHEMA } from './migrate.js';

describe('migrate', () => {
  it('returns defaults for empty state', () => {
    const out = migrate(null);
    expect(out.schemaVersion).toBe(CURRENT_SCHEMA);
    expect(out.hearts).toBe(5);
    expect(out.streakFreezeAvailable).toBe(true);
    expect(out.completedLessons).toEqual([]);
  });

  it('preserves existing v3 data and adds v4 fields', () => {
    const v3 = {
      completedLessons: ['u1l1', 'u1l2'],
      totalXP: 35,
      currentStreak: 4,
      userName: 'Sol',
      // no schemaVersion → assumed v3
    };
    const out = migrate(v3);
    expect(out.schemaVersion).toBe(CURRENT_SCHEMA);
    expect(out.completedLessons).toEqual(['u1l1', 'u1l2']);
    expect(out.totalXP).toBe(35);
    expect(out.currentStreak).toBe(4);
    expect(out.userName).toBe('Sol');
    expect(out.hearts).toBe(5);
    expect(out.streakFreezeAvailable).toBe(true);
    expect(out.streakFreezeUsedAt).toBe(null);
    expect(out.perfectLessons).toBe(0);
  });

  it('is idempotent for v4 state', () => {
    const v4 = migrate({ completedLessons: [] });
    const out = migrate(v4);
    expect(out).toEqual(v4);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- lib/migrate`
Expected: FAIL — module missing.

- [ ] **Step 3: Create `lib/migrate.js`**

```js
export const CURRENT_SCHEMA = 4;

export const DEFAULT_V4_STATE = {
  schemaVersion: CURRENT_SCHEMA,
  // Existing fields (preserved if present in older state)
  onboardingComplete: false,
  onboardingStep: 'welcome',
  selectedPath: null,
  pathName: null,
  quizAnswers: [],
  completedLessons: [],
  currentStreak: 0,
  totalXP: 0,
  dailyLessonsCompleted: 0,
  lastActiveDate: null,
  activeTab: 'home',
  bookmarks: [],
  userName: '',
  earnedBadges: [],
  // V4 additions
  hearts: 5,
  heartsLastRegen: null,
  streakFreezeAvailable: true,
  streakFreezeUsedAt: null,
  streakFreezeRefreshedWeek: null,
  perfectLessons: 0,
};

export function migrate(stored) {
  if (!stored || typeof stored !== 'object') return { ...DEFAULT_V4_STATE };
  return { ...DEFAULT_V4_STATE, ...stored, schemaVersion: CURRENT_SCHEMA };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- lib/migrate`
Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/migrate.js lib/migrate.test.js
git commit -m "feat: add state migration v3 to v4 with hearts and streak freeze fields"
```

---

## Phase 3: Lesson Data Schema

### Task 7: Extract current LEARNING_PATH into data/lessons/ (no content changes yet)

**Files:**
- Create: `data/lessons/index.js`
- Create: `data/lessons/unit1.js`, `unit2.js`, `unit3.js`, `unit4.js`, `unit5.js`
- Modify: `pages/index.jsx`

Move the existing data unchanged, just to establish the module layout. The content rewrite happens in Phase 7.

- [ ] **Step 1: Copy current Unit 1 to `data/lessons/unit1.js`**

From `pages/index.jsx:103-137` (the `{ id:'unit1', …}` object), create `data/lessons/unit1.js`:
```js
// Unit 1 — existing V3 format. Will be rewritten in Task 24.
const unit1 = { id:'unit1', title:'Foundations of Faith', level:'Beginner', lessons:[
  // ...paste all lessons from index.jsx:104-136 exactly as-is...
]};
export default unit1;
```

Open `pages/index.jsx`, find the `LEARNING_PATH` constant, and copy the `unit1` object literal into the new file. Preserve every character including HTML in `body` fields.

- [ ] **Step 2: Repeat for Units 2-5**

Create `data/lessons/unit2.js`, `unit3.js`, `unit4.js`, `unit5.js` — one for each unit object in the existing array.

- [ ] **Step 3: Create aggregator `data/lessons/index.js`**

```js
import unit1 from './unit1.js';
import unit2 from './unit2.js';
import unit3 from './unit3.js';
import unit4 from './unit4.js';
import unit5 from './unit5.js';

export const LEARNING_PATH = [unit1, unit2, unit3, unit4, unit5];
```

- [ ] **Step 4: Update `pages/index.jsx` to import from the new module**

At the top of `pages/index.jsx`, add:
```js
import { LEARNING_PATH } from '../data/lessons';
```

Then delete the entire inline `const LEARNING_PATH = [ ... ]` block (lines ~102-278).

- [ ] **Step 5: Boot and smoke-test**

Run: `npm run dev`

Expected: the app loads identically to before — all 25 lessons accessible, content unchanged. Kill the server.

- [ ] **Step 6: Commit**

```bash
git add data/lessons pages/index.jsx
git commit -m "refactor: extract LEARNING_PATH into data/lessons modules"
```

---

### Task 8: Document the new lesson schema in a JSDoc comment

**Files:**
- Create: `data/lessons/schema.js`

- [ ] **Step 1: Create `data/lessons/schema.js`**

```js
/**
 * Lesson schema — V1 gamification format.
 * Every lesson is an object matching this shape. No runtime validation; this is a reference.
 *
 * @typedef {Object} Lesson
 * @property {string} id           e.g. "u1l1"
 * @property {string} title        Short lesson title
 * @property {string} iconName     Key into ICONS map (see components/Icon.jsx)
 * @property {boolean} [isQuiz]    True for unit-quiz lessons (all questions, no teach slides)
 * @property {Slide}   hook        Opening slide — 2 sentences max
 * @property {Slide[]} teachSlides Additional teaching slides interleaved with questions (see ordering below)
 * @property {Question[]} questions 8 questions for regular lessons, more for quiz lessons
 * @property {Slide}   wrap        Closing slide with source citations
 * @property {string[]} sources    Array of citation strings (Talmud, Rambam, Zohar, etc.)
 * @property {string}  [readMore]  Optional extra context (HTML)
 *
 * Question ordering for regular lessons (teachSlides interleave with questions as defined by `ordering`):
 *   [hook, Q1, Q2, teach[0], Q3, Q4, teach[1], Q5, Q6, Q7, Q8, wrap]
 *
 * @typedef {Object} Slide
 * @property {string} [title]
 * @property {string} body         HTML. Keep ≤40 words for teachSlides.
 * @property {string} [hebrew]
 * @property {string} [transliteration]
 * @property {string} [translation]
 * @property {string} [concept]    Key concept callout
 *
 * @typedef {Object} Question
 * @property {'multiple_choice'|'true_false'|'fill_blank'|'typed_translation'|'match_pairs'|'order_steps'} type
 * @property {string} prompt
 * @property {string} [explanation] Shown on wrong answer
 *
 * For multiple_choice:
 * @property {string[]} options
 * @property {number} correct      Index into options
 *
 * For true_false:
 * @property {boolean} correct
 *
 * For fill_blank / typed_translation:
 * @property {string[]} answer_variants
 * @property {string[]} [answer_variants_he]
 *
 * For match_pairs:
 * @property {{id: string, text: string}[]} left    (Hebrew terms)
 * @property {{id: string, text: string}[]} right   (English meanings)
 * @property {{[leftId: string]: string}} correct  Mapping left.id → right.id
 *
 * For order_steps:
 * @property {{id: string, text: string}[]} steps   Shown shuffled to user
 * @property {string[]} correctOrder               Array of step.id values in the right order
 */
```

- [ ] **Step 2: Commit**

```bash
git add data/lessons/schema.js
git commit -m "docs: add JSDoc schema for V1 lesson format"
```

---

## Phase 4: Question Components

### Task 9: Question dispatcher + multiple_choice renderer

**Files:**
- Create: `components/Question.jsx`
- Create: `components/Question.test.jsx` (optional — skip unless `@testing-library/react` is already installed; the UI is exercised in Task 22)
- Modify: `styles/globals.css`

- [ ] **Step 1: Add shake + pulse CSS**

Append to `styles/globals.css`:
```css
/* ── Question animations ───────────────────────── */
@keyframes jth-shake {
  0%,100% { transform: translateX(0); }
  20%     { transform: translateX(-6px); }
  40%     { transform: translateX(6px); }
  60%     { transform: translateX(-4px); }
  80%     { transform: translateX(4px); }
}
.q-shake { animation: jth-shake 0.35s ease-in-out; }

@keyframes jth-pulse-green {
  0%   { box-shadow: 0 0 0 0 rgba(80, 200, 120, 0.6); }
  70%  { box-shadow: 0 0 0 10px rgba(80, 200, 120, 0); }
  100% { box-shadow: 0 0 0 0 rgba(80, 200, 120, 0); }
}
.q-pulse-green { animation: jth-pulse-green 0.6s ease-out; }

.q-option {
  display: block; width: 100%; text-align: left;
  padding: 14px 16px; margin-bottom: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-lg);
  background: rgba(255,255,255,0.02);
  color: var(--text-body);
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.q-option:hover { background: rgba(255,255,255,0.04); }
.q-option.correct { border-color: #50c878; background: rgba(80,200,120,0.1); }
.q-option.wrong   { border-color: #e04848; background: rgba(224,72,72,0.1); }
.q-option.disabled { pointer-events: none; opacity: 0.7; }

.q-feedback { margin-top: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; line-height: 1.4; }
.q-feedback.correct { background: rgba(80,200,120,0.1); color: #8fd8a8; }
.q-feedback.wrong   { background: rgba(224,72,72,0.08); color: #f0a0a0; }

.q-input { width: 100%; padding: 12px 14px; border-radius: var(--radius-lg);
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
  color: var(--text-body); font-size: 16px; font-family: inherit; }
.q-input:focus { outline: none; border-color: var(--gold); }
.q-input.correct { border-color: #50c878; }
.q-input.wrong   { border-color: #e04848; }

.q-tf-row { display: flex; gap: 12px; }
.q-tf-row > button { flex: 1; }

.q-pair-row { display: flex; gap: 16px; align-items: stretch; }
.q-pair-col { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.q-pair-item { padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.02); cursor: pointer; font-family: inherit; color: var(--text-body); }
.q-pair-item.selected { border-color: var(--gold); background: rgba(201,168,76,0.1); }
.q-pair-item.paired   { opacity: 0.5; pointer-events: none; }

.q-order-list { display: flex; flex-direction: column; gap: 8px; }
.q-order-item { padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.02); display: flex; justify-content: space-between; align-items: center;
  color: var(--text-body); font-family: inherit; }
.q-order-controls button { background: none; border: none; color: var(--gold); font-size: 18px; padding: 0 4px; cursor: pointer; }
```

- [ ] **Step 2: Create `components/Question.jsx` with MC support**

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { gradeTyped, gradeMatchPairs, gradeOrderSteps, containsHebrew } from '../lib/grading';
import { playCorrect, playWrong, hapticLight } from '../lib/celebrations';

/**
 * A single question. Calls onAnswer({correct, typo}) once submitted.
 * Parent controls resetting by changing the `key` prop between iterations.
 */
export default function Question({ question, onAnswer }) {
  switch (question.type) {
    case 'multiple_choice': return <MultipleChoice q={question} onAnswer={onAnswer} />;
    // true_false / fill_blank / typed_translation / match_pairs / order_steps added in Tasks 10-14
    default: return <div>Unsupported question type: {question.type}</div>;
  }
}

function Feedback({ correct, typo, explanation, userTyped, answer }) {
  return (
    <div className={`q-feedback ${correct ? 'correct' : 'wrong'}`}>
      {correct && typo && userTyped
        ? <>Almost! You typed <em>{userTyped}</em>, the answer is <em>{answer}</em>. {explanation}</>
        : correct
          ? <>Correct! {explanation}</>
          : <>Not quite. {explanation}</>}
    </div>
  );
}

function MultipleChoice({ q, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => { setSelected(null); setAnswered(false); }, [q]);

  const submit = (i) => {
    if (answered) return;
    const correct = i === q.correct;
    setSelected(i);
    setAnswered(true);
    if (correct) { playCorrect(); hapticLight(); }
    else { playWrong(); setShake(true); setTimeout(() => setShake(false), 400); }
    onAnswer({ correct, typo: false });
  };

  return (
    <div>
      <div style={{ marginBottom: 12, fontSize: 18 }}>{q.prompt}</div>
      <div className={shake ? 'q-shake' : ''}>
        {q.options.map((opt, i) => {
          let cls = 'q-option';
          if (answered) {
            if (i === q.correct) cls += ' correct';
            else if (i === selected) cls += ' wrong';
            cls += ' disabled';
          }
          return <button key={i} className={cls} onClick={() => submit(i)}>{opt}</button>;
        })}
      </div>
      {answered && <Feedback correct={selected === q.correct} explanation={q.explanation} />}
    </div>
  );
}

export { Feedback };
```

- [ ] **Step 3: Visually verify**

Temporarily, in `pages/index.jsx`, at the top of `App()`, add:
```jsx
return <div style={{padding:30}}><Question question={{type:'multiple_choice',prompt:'Test?',options:['Yes','No'],correct:0,explanation:'Because.'}} onAnswer={console.log}/></div>;
```

Run `npm run dev`, check `http://localhost:3000`. Click an option — see correct pulse / wrong shake. Revert the temporary change.

- [ ] **Step 4: Commit**

```bash
git add components/Question.jsx styles/globals.css
git commit -m "feat: add Question component with multiple_choice renderer"
```

---

### Task 10: Add true_false renderer

**Files:**
- Modify: `components/Question.jsx`

- [ ] **Step 1: Add TrueFalse to the switch and implement**

In `components/Question.jsx`, add a `case 'true_false': return <TrueFalse q={question} onAnswer={onAnswer} />;` and the component:

```jsx
function TrueFalse({ q, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState(false);
  useEffect(() => { setSelected(null); setAnswered(false); }, [q]);

  const submit = (val) => {
    if (answered) return;
    const correct = val === q.correct;
    setSelected(val);
    setAnswered(true);
    if (correct) { playCorrect(); hapticLight(); }
    else { playWrong(); setShake(true); setTimeout(() => setShake(false), 400); }
    onAnswer({ correct, typo: false });
  };

  const optClass = (val) => {
    if (!answered) return 'q-option';
    if (val === q.correct) return 'q-option correct disabled';
    if (val === selected)  return 'q-option wrong disabled';
    return 'q-option disabled';
  };

  return (
    <div>
      <div style={{ marginBottom: 12, fontSize: 18 }}>{q.prompt}</div>
      <div className={`q-tf-row ${shake ? 'q-shake' : ''}`}>
        <button className={optClass(true)}  onClick={() => submit(true)}>True</button>
        <button className={optClass(false)} onClick={() => submit(false)}>False</button>
      </div>
      {answered && <Feedback correct={selected === q.correct} explanation={q.explanation} />}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Question.jsx
git commit -m "feat: add true_false question renderer"
```

---

### Task 11: Add fill_blank renderer (typed)

**Files:**
- Modify: `components/Question.jsx`

- [ ] **Step 1: Add FillBlank and register in switch**

Add `case 'fill_blank': return <FillBlank q={question} onAnswer={onAnswer} />;` and the component:

```jsx
function FillBlank({ q, onAnswer }) {
  const [value, setValue] = useState('');
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState({ correct: false, typo: false });
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { setValue(''); setAnswered(false); }, [q]);

  const submit = (e) => {
    e.preventDefault();
    if (answered || !value.trim()) return;
    const r = gradeTyped(value, q.answer_variants, q.answer_variants_he);
    setResult(r);
    setAnswered(true);
    if (r.correct) { playCorrect(); hapticLight(); }
    else { playWrong(); setShake(true); setTimeout(() => setShake(false), 400); }
    onAnswer(r);
  };

  const isHeb = containsHebrew(value);
  const inputDir = isHeb ? 'rtl' : 'ltr';

  return (
    <form onSubmit={submit}>
      <div style={{ marginBottom: 12, fontSize: 18 }}>{q.prompt}</div>
      <div className={shake ? 'q-shake' : ''}>
        <input
          ref={inputRef}
          className={`q-input ${answered ? (result.correct ? 'correct' : 'wrong') : ''}`}
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={answered}
          dir={inputDir}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
      {!answered && (
        <button type="submit" className="btn-primary" style={{ marginTop: 12 }} disabled={!value.trim()}>
          Check
        </button>
      )}
      {answered && (
        <Feedback
          correct={result.correct}
          typo={result.typo}
          userTyped={value}
          answer={q.answer_variants[0]}
          explanation={q.explanation}
        />
      )}
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Question.jsx
git commit -m "feat: add fill_blank typed question renderer"
```

---

### Task 12: Add typed_translation renderer

**Files:**
- Modify: `components/Question.jsx`

`typed_translation` has identical grading to `fill_blank`. We can reuse FillBlank.

- [ ] **Step 1: Register typed_translation in dispatcher**

In the `switch`, add:
```jsx
case 'typed_translation': return <FillBlank q={question} onAnswer={onAnswer} />;
```

- [ ] **Step 2: Commit**

```bash
git add components/Question.jsx
git commit -m "feat: reuse FillBlank for typed_translation"
```

---

### Task 13: Add match_pairs renderer

**Files:**
- Modify: `components/Question.jsx`

- [ ] **Step 1: Add MatchPairs and register**

Add `case 'match_pairs': return <MatchPairs q={question} onAnswer={onAnswer} />;` and:

```jsx
function MatchPairs({ q, onAnswer }) {
  // Each leftId selected then a rightId completes a pair
  const [pairs, setPairs] = useState({}); // {leftId: rightId}
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => { setPairs({}); setSelectedLeft(null); setAnswered(false); }, [q]);

  const allPaired = Object.keys(pairs).length === q.left.length;

  const onLeft = (id) => {
    if (answered || pairs[id]) return;
    setSelectedLeft(id === selectedLeft ? null : id);
  };
  const onRight = (rid) => {
    if (answered || !selectedLeft) return;
    if (Object.values(pairs).includes(rid)) return;
    setPairs(p => ({ ...p, [selectedLeft]: rid }));
    setSelectedLeft(null);
  };

  const submit = () => {
    if (answered || !allPaired) return;
    const correct = gradeMatchPairs(pairs, q.correct);
    setAnswered(true);
    if (correct) { playCorrect(); hapticLight(); }
    else { playWrong(); setShake(true); setTimeout(() => setShake(false), 400); }
    onAnswer({ correct, typo: false });
  };

  return (
    <div>
      <div style={{ marginBottom: 12, fontSize: 18 }}>{q.prompt}</div>
      <div className={`q-pair-row ${shake ? 'q-shake' : ''}`}>
        <div className="q-pair-col">
          {q.left.map(item => {
            const paired = !!pairs[item.id];
            const selected = selectedLeft === item.id;
            return (
              <button key={item.id}
                className={`q-pair-item${selected ? ' selected' : ''}${paired ? ' paired' : ''}`}
                onClick={() => onLeft(item.id)}>
                {item.text}{paired && ` → ${q.right.find(r => r.id === pairs[item.id]).text}`}
              </button>
            );
          })}
        </div>
        <div className="q-pair-col">
          {q.right.map(item => {
            const usedBy = Object.entries(pairs).find(([_, rid]) => rid === item.id);
            return (
              <button key={item.id}
                className={`q-pair-item${usedBy ? ' paired' : ''}`}
                onClick={() => onRight(item.id)}>
                {item.text}
              </button>
            );
          })}
        </div>
      </div>
      {!answered && (
        <button className="btn-primary" style={{ marginTop: 12 }} disabled={!allPaired} onClick={submit}>Check</button>
      )}
      {answered && (
        <Feedback correct={gradeMatchPairs(pairs, q.correct)} explanation={q.explanation} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Question.jsx
git commit -m "feat: add match_pairs question renderer"
```

---

### Task 14: Add order_steps renderer

**Files:**
- Modify: `components/Question.jsx`

Use up/down arrow buttons instead of HTML5 drag to stay reliable on mobile.

- [ ] **Step 1: Add OrderSteps and register**

Add `case 'order_steps': return <OrderSteps q={question} onAnswer={onAnswer} />;` and:

```jsx
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function OrderSteps({ q, onAnswer }) {
  const [order, setOrder] = useState(() => shuffle(q.steps.map(s => s.id)));
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => { setOrder(shuffle(q.steps.map(s => s.id))); setAnswered(false); }, [q]);

  const move = (idx, dir) => {
    if (answered) return;
    const next = order.slice();
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setOrder(next);
  };

  const submit = () => {
    if (answered) return;
    const correct = gradeOrderSteps(order, q.correctOrder);
    setAnswered(true);
    if (correct) { playCorrect(); hapticLight(); }
    else { playWrong(); setShake(true); setTimeout(() => setShake(false), 400); }
    onAnswer({ correct, typo: false });
  };

  const textFor = (id) => q.steps.find(s => s.id === id).text;
  const correct = answered ? gradeOrderSteps(order, q.correctOrder) : null;

  return (
    <div>
      <div style={{ marginBottom: 12, fontSize: 18 }}>{q.prompt}</div>
      <div className={`q-order-list ${shake ? 'q-shake' : ''}`}>
        {order.map((id, idx) => (
          <div key={id} className="q-order-item">
            <span>{idx + 1}. {textFor(id)}</span>
            {!answered && (
              <span className="q-order-controls">
                <button aria-label="Move up" onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                <button aria-label="Move down" onClick={() => move(idx, +1)} disabled={idx === order.length - 1}>↓</button>
              </span>
            )}
          </div>
        ))}
      </div>
      {answered && !correct && (
        <div style={{ fontSize: 13, color: '#8fa0b4', marginTop: 10 }}>
          Correct order: {q.correctOrder.map(id => textFor(id)).join(' → ')}
        </div>
      )}
      {!answered
        ? <button className="btn-primary" style={{ marginTop: 12 }} onClick={submit}>Check</button>
        : <Feedback correct={correct} explanation={q.explanation} />}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Question.jsx
git commit -m "feat: add order_steps question renderer"
```

---

## Phase 5: Lesson Player & Hearts UI

### Task 15: Hearts display component

**Files:**
- Create: `components/Hearts.jsx`
- Modify: `styles/globals.css`

- [ ] **Step 1: Add CSS**

Append to `styles/globals.css`:
```css
.hearts-row { display: inline-flex; align-items: center; gap: 3px; font-size: 16px; line-height: 1; }
.hearts-row .heart-slot { width: 16px; display: inline-block; }
.hearts-row .heart-slot.empty { opacity: 0.3; filter: grayscale(1); }
```

- [ ] **Step 2: Create `components/Hearts.jsx`**

```jsx
import React from 'react';
import Icon, { ICONS } from './Icon.jsx';

export default function Hearts({ count, max = 5 }) {
  return (
    <span className="hearts-row" role="img" aria-label={`${count} of ${max} hearts`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`heart-slot${i >= count ? ' empty' : ''}`}>{ICONS.heart}</span>
      ))}
    </span>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Hearts.jsx styles/globals.css
git commit -m "feat: add Hearts display component"
```

---

### Task 16: LessonPlayer component — core flow

**Files:**
- Create: `components/LessonPlayer.jsx`

Controls the new lesson sequence: hook → Q1 → Q2 → teach[0] → Q3 → Q4 → teach[1] → Q5-Q8 → wrap. Wrong questions are re-inserted at the end of the queue. Runs out of hearts → `ranOutOfHearts` flag, lesson still completable.

- [ ] **Step 1: Create `components/LessonPlayer.jsx`**

```jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Question from './Question.jsx';
import Hearts from './Hearts.jsx';
import Icon, { ICONS } from './Icon.jsx';
import { MAX_HEARTS } from '../lib/gameplay';
import { playLessonComplete, burstConfetti, hapticSuccess } from '../lib/celebrations';

const STATIC_SLIDE_TYPES = new Set(['hook', 'teach0', 'teach1', 'wrap']);

/**
 * Builds the initial sequence array for a lesson.
 * Uses question index from lesson.questions (0-based).
 * For quiz lessons (isQuiz=true), no teach slides — just hook → all questions → wrap.
 */
function buildSequence(lesson) {
  if (lesson.isQuiz) {
    return [
      { kind: 'hook' },
      ...lesson.questions.map((_, i) => ({ kind: 'question', qi: i })),
      { kind: 'wrap' },
    ];
  }
  return [
    { kind: 'hook' },
    { kind: 'question', qi: 0 },
    { kind: 'question', qi: 1 },
    { kind: 'teach', ti: 0 },
    { kind: 'question', qi: 2 },
    { kind: 'question', qi: 3 },
    { kind: 'teach', ti: 1 },
    { kind: 'question', qi: 4 },
    { kind: 'question', qi: 5 },
    { kind: 'question', qi: 6 },
    { kind: 'question', qi: 7 },
    { kind: 'wrap' },
  ];
}

/**
 * Renders a single slide (hook, teach, or wrap).
 */
function Slide({ slide }) {
  return (
    <div className="lesson-slide">
      {slide.title && <h2 className="lesson-slide-title">{slide.title}</h2>}
      {slide.body && <div className="lesson-slide-body" dangerouslySetInnerHTML={{ __html: slide.body }} />}
      {slide.hebrew && (
        <div className="lesson-hebrew-block">
          <div className="lesson-hebrew">{slide.hebrew}</div>
          {slide.transliteration && <div className="lesson-transliteration">{slide.transliteration}</div>}
          {slide.translation && <div className="lesson-translation">{slide.translation}</div>}
        </div>
      )}
      {slide.concept && (
        <div className="lesson-key-concept">
          <div className="lesson-key-label">Key Concept</div>
          <div className="lesson-key-text">{slide.concept}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Re-inserts a wrongly-answered question 2 slots before the wrap slide
 * (so it reappears within the same session for spaced recall).
 */
function reinsertWrong(queue, currentIdx, wrongItem) {
  const out = queue.slice();
  // Find the final wrap slide index; insert right before it.
  const wrapIdx = out.findIndex((x, i) => i > currentIdx && x.kind === 'wrap');
  const target = wrapIdx === -1 ? out.length : wrapIdx;
  out.splice(target, 0, wrongItem);
  return out;
}

export default function LessonPlayer({
  lesson, unit, hearts, onClose, onComplete, isBookmarked, onToggleBookmark,
}) {
  const baseSequence = useMemo(() => buildSequence(lesson), [lesson]);
  const [queue, setQueue] = useState(baseSequence);
  const [idx, setIdx] = useState(0);
  const [heartsLeft, setHeartsLeft] = useState(hearts);
  const [ranOut, setRanOut] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [seenFirstPass, setSeenFirstPass] = useState(new Set()); // question indices already answered once
  const contentRef = useRef(null);

  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [idx]);

  const step = queue[idx];
  const progress = ((idx + 1) / queue.length) * 100;

  const advance = () => setIdx(i => Math.min(i + 1, queue.length - 1));

  const handleAnswer = ({ correct }) => {
    const qItem = queue[idx];
    const firstPass = !seenFirstPass.has(qItem.qi);
    if (firstPass) setSeenFirstPass(s => new Set(s).add(qItem.qi));

    if (!correct && firstPass) {
      // Lose a heart on first-pass wrong only (re-inserted questions don't re-cost)
      setWrongCount(c => c + 1);
      setHeartsLeft(h => {
        const next = Math.max(0, h - 1);
        if (next === 0) setRanOut(true);
        return next;
      });
      // Re-insert this question before the wrap slide
      setQueue(q => reinsertWrong(q, idx, { kind: 'question', qi: qItem.qi, revisit: true }));
    }
  };

  const isLast = idx === queue.length - 1 && step.kind === 'wrap';

  const complete = () => {
    burstConfetti();
    playLessonComplete();
    hapticSuccess();
    onComplete({ wrongAnswers: wrongCount, ranOutOfHearts: ranOut });
  };

  // Render current step
  let body = null;
  if (step.kind === 'hook')   body = <Slide slide={lesson.hook} />;
  else if (step.kind === 'teach') body = <Slide slide={lesson.teachSlides[step.ti]} />;
  else if (step.kind === 'wrap')  body = <Slide slide={lesson.wrap} />;
  else if (step.kind === 'question') {
    const q = lesson.questions[step.qi];
    body = <Question key={`${step.qi}-${idx}`} question={q} onAnswer={handleAnswer} />;
  }

  // "Continue" button is shown on slides always, and on questions only after they've been answered.
  // We track this via a render-local state that re-mounts each slide (using `key`).
  return (
    <div className="screen-full lesson-screen fade-in">
      <div className="lesson-header">
        <button className="btn-icon" onClick={onClose}>{ICONS.close}</button>
        <div className="lesson-header-info">
          <p className="lesson-header-unit">{unit?.title}</p>
          <p className="lesson-header-title">{lesson.title}</p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <Hearts count={heartsLeft} max={MAX_HEARTS} />
          <button
            className={`lesson-bookmark-btn${isBookmarked ? ' bookmarked' : ''}`}
            onClick={onToggleBookmark}
          >{isBookmarked ? ICONS.bookmark : ICONS.bookmark_outline}</button>
        </div>
      </div>
      <div className="lesson-progress-bar">
        <div className="lesson-progress-fill" style={{ width: `${progress}%` }}/>
      </div>
      <div className="lesson-content" ref={contentRef}>
        {body}
      </div>
      <StepNav step={step} isLast={isLast} onAdvance={advance} onComplete={complete} />
    </div>
  );
}

/**
 * For slides: "Continue" is always enabled.
 * For questions: "Continue" is enabled only after the question has been answered —
 * we detect this via a child component that tracks whether onAnswer has fired.
 * We drive this by rendering a sibling that listens for a custom event, but simplest:
 * mount a StepNavQuestion that reads whether its parent's Question has rendered feedback.
 *
 * Simpler implementation: for slides, show Continue immediately. For questions, wrap in a stateful subcomponent.
 */
function StepNav({ step, isLast, onAdvance, onComplete }) {
  if (step.kind !== 'question') {
    return (
      <div className="lesson-nav">
        <span />
        <button className="btn-primary" onClick={isLast ? onComplete : onAdvance}>
          {isLast ? 'Complete ✓' : 'Continue →'}
        </button>
      </div>
    );
  }
  // Question: Continue button is rendered inline by the Question component via the "Check" submit for typed/match/order,
  // and multiple-choice advances immediately after answered. We render a Continue button that becomes active via DOM event.
  return <QuestionAdvancer isLast={isLast} onAdvance={onAdvance} onComplete={onComplete} />;
}

function QuestionAdvancer({ isLast, onAdvance, onComplete }) {
  // Listens for a global 'jth-question-answered' event which the Question component fires.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const h = () => setReady(true);
    window.addEventListener('jth-question-answered', h);
    return () => window.removeEventListener('jth-question-answered', h);
  }, []);
  return (
    <div className="lesson-nav">
      <span />
      <button className="btn-primary" disabled={!ready} onClick={() => {
        setReady(false); // reset for next question
        isLast ? onComplete() : onAdvance();
      }}>
        {isLast ? 'Complete ✓' : 'Continue →'}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Fire the `jth-question-answered` event from Question**

In `components/Question.jsx`, at the end of every `submit` function (MC, TF, FillBlank, MatchPairs, OrderSteps), after `onAnswer(...)`, add:
```js
if (typeof window !== 'undefined') window.dispatchEvent(new Event('jth-question-answered'));
```

There are 5 submit functions; add the line to each.

- [ ] **Step 3: Commit**

```bash
git add components/LessonPlayer.jsx components/Question.jsx
git commit -m "feat: add LessonPlayer with spaced recall and hearts tracking"
```

---

### Task 17: Update CongratsScreen — hearts, perfect, bonuses

**Files:**
- Modify: `pages/index.jsx`

- [ ] **Step 1: Find CongratsScreen in `pages/index.jsx`**

Look for `function CongratsScreen({` (around line 1063). Read the full function first.

- [ ] **Step 2: Replace with updated version**

Replace the entire `CongratsScreen` function body with:

```jsx
function CongratsScreen({lesson, xpEarned, streak, newBadges, totalXP, replay, heartsLeft, wrongAnswers, ranOutOfHearts, onContinue}){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVisible(true),80);return()=>clearTimeout(t);},[]);
  const level=getLevel(totalXP);
  const perfect = wrongAnswers === 0 && !ranOutOfHearts && !replay;

  return(
    <div className="screen-full congrats-screen fade-in">
      <div className={`congrats-card${visible?' visible':''}`}>
        <div className="congrats-sparkle">{perfect?'🎉':'✓'}</div>
        <h2 className="congrats-title">
          {replay ? 'Reviewed!' : ranOutOfHearts ? 'Lesson complete' : perfect ? 'Perfect Lesson!' : 'Lesson complete'}
        </h2>
        <p className="congrats-sub">
          {replay
            ? `You've already earned XP for "${lesson.title}".`
            : ranOutOfHearts
              ? `You ran out of hearts — no XP this time, but "${lesson.title}" is still marked complete. Hearts refill tomorrow.`
              : perfect
                ? `No mistakes on "${lesson.title}" — +${xpEarned} XP including bonuses!`
                : `+${xpEarned} XP on "${lesson.title}".`}
        </p>
        {!replay && !ranOutOfHearts && (
          <div className="congrats-stats">
            <div className="pitch-stat"><span className="pitch-stat-value">+{xpEarned}</span><span className="pitch-stat-label">XP</span></div>
            <div className="pitch-stat"><span className="pitch-stat-value">{streak}</span><span className="pitch-stat-label">Streak</span></div>
            <div className="pitch-stat"><span className="pitch-stat-value">{heartsLeft}</span><span className="pitch-stat-label">Hearts</span></div>
            <div className="pitch-stat"><span className="pitch-stat-value" style={{fontSize:14}}>{level.name}</span><span className="pitch-stat-label">Level</span></div>
          </div>
        )}
        {newBadges.length>0 && (
          <div className="congrats-badges">
            <p className="congrats-badges-label">New badge{newBadges.length>1?'s':''} unlocked!</p>
            <div className="congrats-badges-row">
              {newBadges.map(b=>(
                <div key={b.id} className="congrats-badge">
                  <div className="congrats-badge-icon">{b.icon}</div>
                  <div className="congrats-badge-name">{b.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button className="btn-primary btn-large" onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add pages/index.jsx
git commit -m "feat: update CongratsScreen with hearts, perfect-lesson, bonus display"
```

---

## Phase 6: App Integration

### Task 18: Wire LessonPlayer into App + update state handling

**Files:**
- Modify: `pages/index.jsx`

- [ ] **Step 1: Imports**

At the top of `pages/index.jsx` (after existing imports), add:
```jsx
import LessonPlayer from '../components/LessonPlayer';
import { migrate, CURRENT_SCHEMA } from '../lib/migrate';
import {
  MAX_HEARTS, regenerateHearts, consumeHeart, computeLessonXP,
  shouldAutoFreeze, applyStreakFreeze, maybeRefreshWeeklyFreeze,
  getTodayKey, isNewDay,
} from '../lib/gameplay';
import Icon from '../components/Icon';
```

- [ ] **Step 2: Replace DEFAULT_STATE**

Find `const DEFAULT_STATE = {` (around line 1665). Replace it with:
```jsx
import { DEFAULT_V4_STATE } from '../lib/migrate';
const DEFAULT_STATE = DEFAULT_V4_STATE;
```

Move the `DEFAULT_V4_STATE` import up with the other imports. Delete the inline `const DEFAULT_STATE = { ... };` block.

- [ ] **Step 3: Update `App()` state init to use migrate**

Find `const [state,setState]=useState(()=>{` (around line 1679). Replace:
```jsx
const [state,setState]=useState(()=>{
  try{
    const raw = localStorage.getItem('jth-v4');
    if (raw) return migrate(JSON.parse(raw));
    // Migrate from old jth-v3 if present
    const oldRaw = localStorage.getItem('jth-v3');
    if (oldRaw) {
      const migrated = migrate(JSON.parse(oldRaw));
      localStorage.setItem('jth-v4', JSON.stringify(migrated));
      return migrated;
    }
    return migrate(null);
  } catch { return migrate(null); }
});
```

- [ ] **Step 4: Update the localStorage write effect**

Find the effect that writes state to localStorage. Update the key from `'jth-v3'` to `'jth-v4'`:

```jsx
useEffect(()=>{
  try { localStorage.setItem('jth-v4', JSON.stringify(state)); } catch {}
}, [state]);
```

- [ ] **Step 5: Add hearts-regen + streak-freeze effect**

After the existing effects inside `App()`, add:
```jsx
// Hearts regen + streak freeze check — runs on every state load + every minute while mounted
useEffect(() => {
  const tick = () => {
    setState(prev => {
      const todayKey = getTodayKey();
      let next = { ...prev, ...regenerateHearts(prev) };
      next = maybeRefreshWeeklyFreeze(next, todayKey);
      if (shouldAutoFreeze(next, todayKey)) {
        next = applyStreakFreeze(next, todayKey);
      }
      return next;
    });
  };
  tick();
  const id = setInterval(tick, 60_000);
  return () => clearInterval(id);
}, []);
```

- [ ] **Step 6: Replace `handleLessonComplete`**

Find `const handleLessonComplete=lesson=>{` (around line 1739) and replace the whole function with:

```jsx
const handleLessonComplete = (lesson, { wrongAnswers, ranOutOfHearts }) => {
  const alreadyCompleted = state.completedLessons.includes(lesson.id);
  const todayKey = getTodayKey();

  if (alreadyCompleted) {
    setCurrentView({
      type: 'congrats', lesson, xpEarned: 0, streak: state.currentStreak,
      newBadges: [], replay: true, heartsLeft: state.hearts,
      wrongAnswers, ranOutOfHearts,
    });
    return;
  }

  // Streak
  let newStreak = state.currentStreak;
  if (!state.lastActiveDate) newStreak = 1;
  else if (state.lastActiveDate === todayKey) newStreak = state.currentStreak;
  else {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yKey = getTodayKey(y);
    newStreak = state.lastActiveDate === yKey ? state.currentStreak + 1 : 1;
  }
  const isFirstOfDay = state.lastActiveDate !== todayKey;
  const xpEarned = computeLessonXP({
    wrongAnswers, isFirstOfDay, streak: newStreak, ranOutOfHearts,
  });

  // Consume hearts: the player already deducted them visually; reflect in state
  const heartsAfter = Math.max(0, state.hearts - wrongAnswers);

  const newCompleted = [...new Set([...state.completedLessons, lesson.id])];
  const newDaily = state.lastActiveDate === todayKey ? state.dailyLessonsCompleted + 1 : 1;
  const newPerfect = (wrongAnswers === 0 && !ranOutOfHearts) ? state.perfectLessons + 1 : state.perfectLessons;

  const updates = {
    completedLessons: newCompleted,
    totalXP: state.totalXP + xpEarned,
    currentStreak: newStreak,
    dailyLessonsCompleted: newDaily,
    lastActiveDate: todayKey,
    hearts: heartsAfter,
    perfectLessons: newPerfect,
  };
  updateWithBadgeCheck(updates);
  const nextState = { ...state, ...updates };
  const newBadges = getNewBadges(state, nextState);
  setCurrentView({
    type: 'congrats', lesson, xpEarned, streak: newStreak, newBadges,
    replay: false, heartsLeft: heartsAfter, wrongAnswers, ranOutOfHearts,
  });
};
```

- [ ] **Step 7: Swap LessonScreen usage for LessonPlayer**

Find the block that renders `<LessonScreen …>` (around line 1807). Replace the whole `{currentView.type === 'lesson' …}` block with:

```jsx
if (currentView.type === 'lesson') return (
  <div className="app-container">
    <LessonPlayer
      lesson={currentView.lesson}
      unit={currentView.unit}
      hearts={state.hearts}
      onClose={() => setCurrentView(null)}
      onComplete={(result) => handleLessonComplete(currentView.lesson, result)}
      isBookmarked={(state.bookmarks || []).includes(currentView.lesson.id)}
      onToggleBookmark={() => handleToggleBookmark(currentView.lesson.id)}
    />
  </div>
);
```

- [ ] **Step 8: Update CongratsScreen render call to pass new props**

In the `if (currentView.type === 'congrats')` block, update the `<CongratsScreen>` JSX to pass the new props:

```jsx
<CongratsScreen
  lesson={currentView.lesson}
  xpEarned={currentView.xpEarned}
  streak={currentView.streak}
  newBadges={currentView.newBadges || []}
  totalXP={state.totalXP}
  replay={currentView.replay || false}
  heartsLeft={currentView.heartsLeft}
  wrongAnswers={currentView.wrongAnswers}
  ranOutOfHearts={currentView.ranOutOfHearts}
  onContinue={() => setCurrentView(null)}
/>
```

- [ ] **Step 9: Remove old LessonScreen and Exercise components**

Delete the following functions from `pages/index.jsx`:
- `Exercise` (around line 874-906)
- `AudioPlayer` (around line 922-986) — unused after rabbi audio cut
- `LessonScreen` (around line 987-1060)
- `RABBI_VOICES` const (around line 909-919)
- `WAVEFORM_HEIGHTS` const (around line 920)

Also remove the `hasAudio` / `showAudio` / `🎙️` button UI in `LessonScreen` — it's being deleted wholesale with the function.

Check that there are no remaining references to `Exercise`, `AudioPlayer`, `LessonScreen`, `RABBI_VOICES`, or `WAVEFORM_HEIGHTS` with grep:
```bash
grep -n "Exercise\|AudioPlayer\|LessonScreen\|RABBI_VOICES\|WAVEFORM_HEIGHTS" pages/index.jsx
```
Expected: no matches.

- [ ] **Step 10: Boot and smoke-test**

Run: `npm run dev`

Open `http://localhost:3000`. The app should boot. Because Unit 1 hasn't been rewritten yet, lessons will fail to render (the LessonPlayer expects the new shape). That's OK — we fix it in Phase 7.

For now, verify: onboarding works, home/profile/community tabs render, bookmark toggle persists, returning-user screen appears on reload. Kill the server.

- [ ] **Step 11: Commit**

```bash
git add pages/index.jsx
git commit -m "feat: wire LessonPlayer with hearts, XP bonuses, v4 state migration"
```

---

### Task 19: Streak-freeze indicator on home tab

**Files:**
- Modify: `pages/index.jsx`

- [ ] **Step 1: Find HomeTab**

Look for `function HomeTab({state,` (around line 684). Look for where streak and XP are rendered.

- [ ] **Step 2: Add streak freeze card below the streaks row**

Inside `HomeTab`, after the existing streak display, add:
```jsx
{state.streakFreezeAvailable && (
  <div style={{
    display:'flex', alignItems:'center', gap:10,
    padding:'10px 14px', marginTop:10,
    background:'rgba(120, 180, 220, 0.08)',
    border:'1px solid rgba(120, 180, 220, 0.2)',
    borderRadius:'var(--radius-lg)',
    fontSize:13, color:'var(--text-body)',
  }}>
    <span style={{fontSize:18}}>🧊</span>
    <span><strong>Streak freeze ready.</strong> We'll auto-apply it if you miss a day.</span>
  </div>
)}
{!state.streakFreezeAvailable && state.streakFreezeUsedAt && (
  <div style={{
    display:'flex', alignItems:'center', gap:10,
    padding:'10px 14px', marginTop:10,
    background:'rgba(255,255,255,0.03)',
    border:'1px solid rgba(255,255,255,0.08)',
    borderRadius:'var(--radius-lg)',
    fontSize:12, color:'var(--text-dim)',
  }}>
    <span style={{fontSize:16}}>🧊</span>
    <span>Streak freeze used on {state.streakFreezeUsedAt}. Refreshes Sunday.</span>
  </div>
)}
```

Put this in a sensible visual location — right after the streak row in the existing home tab card layout.

- [ ] **Step 3: Commit**

```bash
git add pages/index.jsx
git commit -m "feat: show streak freeze availability on home tab"
```

---

## Phase 7: Content Rewrite — All 25 Lessons

Each task in this phase rewrites one unit (5 lessons) to the new schema. This is the bulk of the remaining work; break into separate sessions if context runs low. **The lesson shape is defined in `data/lessons/schema.js` (Task 8).**

> **Template to follow for every lesson.** Use exactly this structure for every rewrite — deviations will break `LessonPlayer`.

```js
{
  id: 'u1l1',
  title: 'Who is Hashem?',
  iconName: 'star_of_david',
  hook: { title: 'Who is Hashem?', body: '<p>Two-sentence intro that sets up the lesson…</p>' },
  teachSlides: [
    { title: '…', body: '<p>≤40 words adding a layer…</p>', hebrew: 'שֵׁם', transliteration: 'Shem', translation: 'Name', concept: 'optional key concept' },
    { title: '…', body: '<p>≤40 words adding another layer…</p>' },
  ],
  questions: [
    { type: 'multiple_choice', prompt: '…', options: ['A','B','C','D'], correct: 1, explanation: '…' },
    { type: 'multiple_choice', prompt: '…', options: ['A','B','C','D'], correct: 2, explanation: '…' },
    { type: 'multiple_choice', prompt: '…', options: ['A','B','C','D'], correct: 0, explanation: '…' },
    { type: 'true_false', prompt: '…', correct: true, explanation: '…' },
    { type: 'fill_blank', prompt: 'The ___ commandment is to remember the Sabbath.', answer_variants: ['fourth','4th'], explanation: '…' },
    { type: 'typed_translation', prompt: 'Type the English meaning of "Shabbat Shalom".', answer_variants: ['peaceful sabbath','sabbath of peace','peaceful shabbat'], answer_variants_he: [], explanation: '…' },
    { type: 'match_pairs', prompt: 'Match each Hebrew term to its meaning.',
      left:  [{id:'a',text:'Shabbat'},{id:'b',text:'Havdalah'},{id:'c',text:'Kiddush'}],
      right: [{id:'1',text:'Sanctification'},{id:'2',text:'Separation'},{id:'3',text:'Rest'}],
      correct: { a:'3', b:'2', c:'1' }, explanation: '…' },
    { type: 'order_steps', prompt: 'Put these Friday night rituals in order.',
      steps: [{id:'a',text:'Light candles'},{id:'b',text:'Kiddush'},{id:'c',text:'Challah'},{id:'d',text:'Meal'}],
      correctOrder: ['a','b','c','d'], explanation: '…' },
  ],
  wrap: { title: 'In summary', body: '<p>One-sentence takeaway + source.</p>' },
  sources: ['Talmud Shabbat 10b', 'Rambam, Hilchot Shabbat 1:1'],
  readMore: '<p>Optional longer reading — commentaries, extra sources. No audio.</p>',
}
```

**Mix per regular lesson:** 3 multiple_choice, 1 true_false, 1 fill_blank, 1 typed_translation, 1 match_pairs, 1 order_steps = 8 questions. Tune to content.

**For quiz lessons (`isQuiz:true`):** 8 questions total, mostly multiple_choice, no teachSlides. The LessonPlayer skips teach slides when `isQuiz` is true.

---

### Task 20: Rewrite Unit 1 — Foundations of Faith (5 lessons)

**Files:**
- Modify: `data/lessons/unit1.js`

- [ ] **Step 1: Rewrite lesson u1l1 — "Who is Hashem?"**

Source content is in the current `data/lessons/unit1.js` (carried over from the old inline path). Preserve the theological content, move citations to `sources`, expand to 8 questions. Use the template above.

- [ ] **Step 2: Rewrite lesson u1l2 — "What is the Torah?"**

Same process. 8 questions. Preserve citations.

- [ ] **Step 3: Rewrite lesson u1l3 — "The Jewish People"**

Same.

- [ ] **Step 4: Rewrite lesson u1l4 — "What is a Mitzvah?"**

Same.

- [ ] **Step 5: Rewrite lesson u1l5 — "Foundations Quiz"**

Quiz lesson: `isQuiz: true`, no teachSlides, 8 questions total (mostly multiple_choice). No wrap celebration content — the post-unit CongratsScreen handles it.

- [ ] **Step 6: Smoke test Unit 1 in the browser**

Run: `npm run dev`. Open `http://localhost:3000`, complete onboarding, open u1l1. Work through all 8 questions, try one wrong answer (verify heart decrements + shake + explanation), try a typed question, then complete the lesson. Verify CongratsScreen shows `+XP`, hearts remaining, and any new badges.

- [ ] **Step 7: Commit**

```bash
git add data/lessons/unit1.js
git commit -m "feat: rewrite Unit 1 lessons to V1 gamification format"
```

---

### Task 21: Rewrite Unit 2 — Shabbat (5 lessons)

**Files:**
- Modify: `data/lessons/unit2.js`

- [ ] **Steps 1-5: Rewrite u2l1 through u2l5**

Source content is Shabbat-focused. u2l5 is a quiz (`isQuiz: true`). Follow the template from Phase 7 intro.

- [ ] **Step 6: Smoke test Unit 2**

Run `npm run dev`, complete u2l1. Verify lesson flow works.

- [ ] **Step 7: Commit**

```bash
git add data/lessons/unit2.js
git commit -m "feat: rewrite Unit 2 (Shabbat) lessons to V1 gamification format"
```

---

### Task 22: Rewrite Unit 3 — Prayer (5 lessons)

**Files:**
- Modify: `data/lessons/unit3.js`

- [ ] **Steps 1-5: Rewrite u3l1 through u3l5**

Prayer content. u3l5 is the unit quiz.

- [ ] **Step 6: Smoke test**

- [ ] **Step 7: Commit**

```bash
git add data/lessons/unit3.js
git commit -m "feat: rewrite Unit 3 (Prayer) lessons to V1 gamification format"
```

---

### Task 23: Rewrite Unit 4 — Jewish Holidays (5 lessons)

**Files:**
- Modify: `data/lessons/unit4.js`

- [ ] **Steps 1-5: Rewrite u4l1 through u4l5**

Holidays content.

- [ ] **Step 6: Smoke test**

- [ ] **Step 7: Commit**

```bash
git add data/lessons/unit4.js
git commit -m "feat: rewrite Unit 4 (Holidays) lessons to V1 gamification format"
```

---

### Task 24: Rewrite Unit 5 — Torah Study (5 lessons)

**Files:**
- Modify: `data/lessons/unit5.js`

- [ ] **Steps 1-5: Rewrite u5l1 through u5l5**

Torah study / parsha content.

- [ ] **Step 6: Smoke test**

- [ ] **Step 7: Commit**

```bash
git add data/lessons/unit5.js
git commit -m "feat: rewrite Unit 5 (Torah Study) lessons to V1 gamification format"
```

---

## Phase 8: Cleanup and Final Pass

### Task 25: Replace remaining emoji literals with Icon

**Files:**
- Modify: `pages/index.jsx`

- [ ] **Step 1: Find emoji literals**

Run:
```bash
grep -nP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}\x{2700}-\x{27BF}]|✡️|🕯️|📜|📖|🏆|🔥|⚡|⭐|💫|🌱|🔖|🏷️|📅|📝|🎉|🕍|✨|🌟|🙏|🎙️|✕" pages/index.jsx | head -60
```

- [ ] **Step 2: Replace with `<Icon name="…" />` where the emoji is rendered as UI chrome**

Leave emoji in string data (like badge `icon:` properties in `ALL_BADGES`) alone — those flow through `<Icon>` anyway once we update the renderer. Target only bare emoji in JSX. Examples:

```jsx
// Before
<button className="btn-icon">✕</button>
// After
<button className="btn-icon"><Icon name="close"/></button>

// Before
<span>🔥 {state.currentStreak}</span>
// After
<span><Icon name="streak"/> {state.currentStreak}</span>
```

Do not touch lesson `body` HTML — those are content, not chrome.

- [ ] **Step 3: Boot and visually verify**

Run `npm run dev`, click through home → learn → profile. Everything that was an emoji should still be visible.

- [ ] **Step 4: Commit**

```bash
git add pages/index.jsx
git commit -m "refactor: route UI emoji through Icon component"
```

---

### Task 26: End-to-end smoke test + checklist

**Files:** (no changes, verification only)

- [ ] **Step 1: Clear localStorage and run a full new-user flow**

Open a fresh browser profile or incognito. Go to `http://localhost:3000`.

Verify, checking each:
- [ ] Welcome screen shows, can proceed
- [ ] Onboarding quiz → path selection → path ready screen works
- [ ] Home tab: greeting, Hebrew date, streak freeze indicator visible
- [ ] Open u1l1 — hook slide, 8 questions, wrap slide all render
- [ ] Get one question wrong — heart decrements, shake + explanation appear, question re-appears before wrap
- [ ] Get one typed question right with a typo — "Almost!" message appears
- [ ] Complete lesson — confetti, CongratsScreen shows XP with bonuses, hearts remaining
- [ ] Perfect lesson (all correct) earns +5 bonus XP
- [ ] First lesson of day earns +5 bonus XP
- [ ] XP multiplier applied after streak reaches 7 (manually set localStorage if needed)
- [ ] Streak freeze auto-applies: set `lastActiveDate` to 2 days ago in devtools → refresh → streak preserved, freeze consumed
- [ ] No console errors

- [ ] **Step 2: Existing-user migration test**

In devtools, set:
```js
localStorage.setItem('jth-v3', JSON.stringify({ completedLessons:['u1l1'], totalXP:10, currentStreak:1, userName:'Test' }));
localStorage.removeItem('jth-v4');
```
Refresh. Verify: the app loads with the preserved progress and gains the new V1 fields (hearts=5, streakFreezeAvailable=true).

- [ ] **Step 3: Run unit tests**

```bash
npm run test:run
```
Expected: all tests pass.

- [ ] **Step 4: Build for production**

```bash
npm run build
```
Expected: build succeeds, no errors.

- [ ] **Step 5: Commit the smoke-test checklist**

If anything was fixed during smoke testing, commit those fixes now under a `fix:` commit. If the entire smoke test passed with no changes, no commit is needed — skip this step.

- [ ] **Step 6: Update the spec status**

Edit `docs/superpowers/specs/2026-04-21-gamification-v1-design.md` and change `**Status:** Approved (brainstorm), pending implementation plan` to `**Status:** Implemented`.

```bash
git add docs/superpowers/specs/2026-04-21-gamification-v1-design.md
git commit -m "docs: mark gamification V1 spec as implemented"
```

---

## Success Criteria Checklist

Copied from the spec — verify before declaring V1 done:

- [ ] All 25 lessons are in new format with 8 questions each
- [ ] All 6 question types work end-to-end
- [ ] Hearts, XP bonuses, streak freeze, micro-celebrations all functional
- [ ] Typed answers accept variants and 1-char typos
- [ ] Hebrew Unicode input accepted but not required
- [ ] All (UI-chrome) icons route through `<Icon>` component
- [ ] Existing users migrate localStorage state without data loss
- [ ] Existing features (onboarding, badges, profile, flat leaderboard, Shabbat pause, community tab) still work

---

**End of plan.**
