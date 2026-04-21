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
    expect(computeLessonXP({ wrongAnswers: 1, isFirstOfDay: false, streak: 7, ranOutOfHearts: false })).toBe(12);
  });
  it('perfect lesson adds +5', () => {
    expect(computeLessonXP({ wrongAnswers: 0, isFirstOfDay: false, streak: 0, ranOutOfHearts: false })).toBe(15);
  });
  it('first-of-day adds +5', () => {
    expect(computeLessonXP({ wrongAnswers: 1, isFirstOfDay: true, streak: 0, ranOutOfHearts: false })).toBe(15);
  });
});

describe('date helpers', () => {
  it('getTodayKey returns YYYY-MM-DD in local time', () => {
    const d = new Date('2026-04-21T15:00:00Z');
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
    expect(r2.streakFreezeAvailable).toBe(false);
  });
});
