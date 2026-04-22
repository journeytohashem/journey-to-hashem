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
