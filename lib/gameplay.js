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
  const d = parseDate(dateKey);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return getTodayKey(d);
}

export function maybeRefreshWeeklyFreeze(state, todayKey) {
  const d = parseDate(todayKey);
  if (d.getDay() !== 0) return state;
  const weekKey = getWeekKey(todayKey);
  if (state.streakFreezeRefreshedWeek === weekKey) return state;
  return {
    ...state,
    streakFreezeAvailable: true,
    streakFreezeRefreshedWeek: weekKey,
  };
}
