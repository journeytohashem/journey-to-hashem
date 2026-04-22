import { describe, it, expect } from 'vitest';
import { ICONS, iconFor } from './Icon.jsx';

describe('ICONS map', () => {
  it('contains required V1 emoji names', () => {
    const required = ['heart', 'streak', 'xp', 'star', 'freeze', 'check', 'close', 'fire', 'trophy', 'torah', 'star_of_david', 'bookmark', 'sparkle', 'lock', 'first_step'];
    for (const name of required) {
      expect(ICONS[name]).toBeDefined();
    }
  });

  it('contains the 4 bottom-nav SVG icons as render functions', () => {
    for (const name of ['nav_home', 'nav_learn', 'nav_community', 'nav_profile']) {
      expect(typeof ICONS[name]).toBe('function');
    }
  });

  it('contains all 25 lesson cover SVG icons as render functions', () => {
    const lessonIcons = [
      // Unit 1
      'hashem', 'torah_scroll', 'jewish_people', 'tablets',
      // Unit 2
      'shabbat_sunset', 'shabbat_candles', 'kiddush_cup', 'havdalah_candle',
      // Unit 3
      'praying_hands', 'siddur', 'sunrise', 'sun_moon',
      // Unit 4
      'jewish_calendar', 'shofar', 'matzah', 'menorah',
      // Unit 5
      'parasha_scroll', 'trop_notes', 'quill', 'footsteps',
      // Shared quiz glyph (covers all 5 unit quizzes)
      'quiz_checklist',
    ];
    for (const name of lessonIcons) {
      expect(typeof ICONS[name]).toBe('function');
    }
  });

  it('iconFor returns the emoji string for a known emoji name', () => {
    expect(iconFor('heart')).toBe(ICONS.heart);
    expect(typeof iconFor('heart')).toBe('string');
  });

  it('iconFor returns the render function for a known SVG name', () => {
    expect(typeof iconFor('nav_home')).toBe('function');
    expect(typeof iconFor('menorah')).toBe('function');
  });

  it('iconFor returns undefined for an unknown name', () => {
    expect(iconFor('nonexistent')).toBeUndefined();
  });
});
