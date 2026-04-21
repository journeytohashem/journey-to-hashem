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
