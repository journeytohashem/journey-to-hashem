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
