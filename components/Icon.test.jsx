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
