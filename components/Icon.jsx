import React from 'react';

/*
 * Icon values may be either:
 *   - a string:   emoji fallback (rendered in a <span>)
 *   - a function: (props) => <svg ...>  (rendered with size/color via currentColor)
 *
 * All SVGs use stroke="currentColor" so the ambient CSS color drives them. Fill
 * is used sparingly for solid details. Base viewBox is 24x24 unless noted.
 */

const SVG_BASE = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function makeSvg(children) {
  return (props) => (
    <svg {...SVG_BASE} {...props}>
      {children}
    </svg>
  );
}

export const ICONS = {
  // ── V1 gamification (emoji — kept as-is) ─────────────────
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

  // ── Badges / existing (emoji — untouched) ────────────────
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
  candle: '🕯️',
  havdalah: '🌟',
  prayer: '🙏',
  holiday: '🎉',

  // ── UI (emoji — untouched) ───────────────────────────────
  search: '🔍',
  pencil: '✏️',
  share: '🔗',
  bell: '🔔',
  community: '💬',
  celebration: '🎉',
  check_circle: '✅',
  phone: '📱',
  medal: '🏅',
  medal_gold: '🥇',
  medal_silver: '🥈',
  medal_bronze: '🥉',
  reset: '🔄',
  envelope: '✉️',

  // ── Bottom-nav tabs (Lucide-style line-art) ──────────────
  nav_home: makeSvg(
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v11h5v-7h4v7h5V10" />
    </>
  ),
  nav_learn: makeSvg(
    <>
      <path d="M2 4h7a3 3 0 013 3v14a2 2 0 00-2-2H2V4z" />
      <path d="M22 4h-7a3 3 0 00-3 3v14a2 2 0 012-2h8V4z" />
    </>
  ),
  nav_community: makeSvg(
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  ),
  nav_profile: makeSvg(
    <>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),

  // ── Lesson covers — Unit 1: Foundations of Faith ─────────
  // u1l1 Who is Hashem? — Star of David (two overlapping triangles)
  hashem: makeSvg(
    <>
      <path d="M12 3 L3.5 18 L20.5 18 Z" />
      <path d="M12 21 L3.5 6 L20.5 6 Z" />
    </>
  ),
  // u1l2 What is the Torah? — Scroll with two wooden rollers
  torah_scroll: makeSvg(
    <>
      <rect x="3.5" y="3" width="3" height="18" rx="1.2" />
      <rect x="17.5" y="3" width="3" height="18" rx="1.2" />
      <path d="M6.5 5h11v14h-11z" />
      <path d="M9 9h6M9 12h6M9 15h6" />
    </>
  ),
  // u1l3 The Jewish People — Three figures (tribe)
  jewish_people: makeSvg(
    <>
      <circle cx="6" cy="8" r="2" />
      <circle cx="12" cy="6" r="2.3" />
      <circle cx="18" cy="8" r="2" />
      <path d="M2 20c0-3 2-4.5 4-4.5s2 1 2 2" />
      <path d="M22 20c0-3-2-4.5-4-4.5s-2 1-2 2" />
      <path d="M7.5 20c0-3 2-4.5 4.5-4.5s4.5 1.5 4.5 4.5" />
    </>
  ),
  // u1l4 What is a Mitzvah? — Tablets of the Law (two rounded stones)
  tablets: makeSvg(
    <>
      <path d="M4 8a2.5 2.5 0 015 0v12H4z" />
      <path d="M15 8a2.5 2.5 0 015 0v12h-5z" />
      <path d="M5.5 12h2M5.5 15h2M16.5 12h2M16.5 15h2" />
    </>
  ),

  // ── Lesson covers — Unit 2: Shabbat ──────────────────────
  // u2l1 What is Shabbat? — Sunset (sun dipping below horizon)
  shabbat_sunset: makeSvg(
    <>
      <path d="M3 17h18" />
      <path d="M6 17a6 6 0 0112 0" />
      <path d="M12 5v-2M4.5 10l-1.5-1M19.5 10l1.5-1M7 7l-1-1M17 7l1-1" />
    </>
  ),
  // u2l2 Friday Night — Two Shabbat candles, lit
  shabbat_candles: makeSvg(
    <>
      <path d="M8 10v10M16 10v10" />
      <path d="M7 22h10" />
      <path d="M8 10c-1.2-1.2-.5-3 0-4 .5 1 2 1 0 4z" fill="currentColor" />
      <path d="M16 10c-1.2-1.2-.5-3 0-4 .5 1 2 1 0 4z" fill="currentColor" />
    </>
  ),
  // u2l3 Shabbat Day — Kiddush cup (goblet)
  kiddush_cup: makeSvg(
    <>
      <path d="M7 4h10l-1 7a4 4 0 01-8 0z" />
      <path d="M12 14v6" />
      <path d="M8 20h8" />
    </>
  ),
  // u2l4 Havdalah — Braided candle with spice-box hint
  havdalah_candle: makeSvg(
    <>
      <path d="M12 10v10" />
      <path d="M10 10c2-1 2-3 0-4M14 10c-2-1-2-3 0-4" />
      <path d="M10 6c2-1 2-3 0-4M14 6c-2-1-2-3 0-4" />
      <path d="M12 4c-1-1-.5-2.5 0-3 .5 1 1.5 1 0 3z" fill="currentColor" />
      <path d="M5 22h14" />
    </>
  ),

  // ── Lesson covers — Unit 3: Prayer ───────────────────────
  // u3l1 Why Do We Pray? — Hands in prayer
  praying_hands: makeSvg(
    <>
      <path d="M11 4v9l-3 2v5h3" />
      <path d="M13 4v9l3 2v5h-3" />
      <path d="M11 13h2" />
    </>
  ),
  // u3l2 Structure of the Siddur — Siddur (closed book with bookmark ribbon)
  siddur: makeSvg(
    <>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M13 3v7l2-1.2 2 1.2V3" />
    </>
  ),
  // u3l3 Shacharit — Sunrise (rising sun)
  sunrise: makeSvg(
    <>
      <path d="M3 18h18" />
      <path d="M6 18a6 6 0 0112 0" />
      <path d="M12 8v-3M5 13l-2-1M19 13l2-1M7.5 9.5l-1.5-1.5M16.5 9.5l1.5-1.5" />
    </>
  ),
  // u3l4 Mincha & Maariv — Sun and crescent moon
  sun_moon: makeSvg(
    <>
      <circle cx="8" cy="12" r="3" />
      <path d="M8 6v-1.5M8 19.5V18M3.5 12H2M4.8 8.8L3.7 7.7M4.8 15.2l-1.1 1.1" />
      <path d="M21 15.5a4.5 4.5 0 01-6-6 5 5 0 106 6z" fill="currentColor" />
    </>
  ),

  // ── Lesson covers — Unit 4: Holidays ─────────────────────
  // u4l1 Jewish Calendar — Calendar grid with lunar dot
  jewish_calendar: makeSvg(
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4M16 3v4" />
      <circle cx="12" cy="15.5" r="1.5" fill="currentColor" />
    </>
  ),
  // u4l2 Rosh Hashana & Yom Kippur — Shofar (ram's horn)
  shofar: makeSvg(
    <>
      <path d="M3 14c1-6 8-8 15-5 2 1 3.5 3 2 5-1.5 1-3 0-4-2-2 5-8 7-13 2z" />
      <path d="M20 14c1 0 2-.5 2-1.5" />
    </>
  ),
  // u4l3 Sukkot/Pesach/Shavuot — Matzah (square with perforation grid)
  matzah: makeSvg(
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
      <circle cx="8" cy="8" r="0.6" fill="currentColor" />
      <circle cx="12" cy="8" r="0.6" fill="currentColor" />
      <circle cx="16" cy="8" r="0.6" fill="currentColor" />
      <circle cx="8" cy="12" r="0.6" fill="currentColor" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
      <circle cx="16" cy="12" r="0.6" fill="currentColor" />
      <circle cx="8" cy="16" r="0.6" fill="currentColor" />
      <circle cx="12" cy="16" r="0.6" fill="currentColor" />
      <circle cx="16" cy="16" r="0.6" fill="currentColor" />
    </>
  ),
  // u4l4 Chanukah & Purim — Chanukiah (9-branch menorah)
  menorah: makeSvg(
    <>
      {/* 8 branches: 4 left (2, 5, 8, 11), 4 right (13, 16, 19, 22) */}
      <path d="M2 17v-5M5 17v-5M8 17v-5M11 17v-5M13 17v-5M16 17v-5M19 17v-5M22 17v-5" />
      {/* Shamash — center, taller */}
      <path d="M12 17v-7" />
      {/* Crossbar + base */}
      <path d="M2 17h20" />
      <path d="M12 17v4" />
      <path d="M9 21h6" />
      {/* Flame dots */}
      <circle cx="2" cy="11" r="0.7" fill="currentColor" />
      <circle cx="5" cy="11" r="0.7" fill="currentColor" />
      <circle cx="8" cy="11" r="0.7" fill="currentColor" />
      <circle cx="11" cy="11" r="0.7" fill="currentColor" />
      <circle cx="12" cy="9" r="0.7" fill="currentColor" />
      <circle cx="13" cy="11" r="0.7" fill="currentColor" />
      <circle cx="16" cy="11" r="0.7" fill="currentColor" />
      <circle cx="19" cy="11" r="0.7" fill="currentColor" />
      <circle cx="22" cy="11" r="0.7" fill="currentColor" />
    </>
  ),

  // ── Lesson covers — Unit 5: Torah Study ──────────────────
  // u5l1 What is the Parasha? — Open horizontal scroll
  parasha_scroll: makeSvg(
    <>
      <path d="M4 8c0-1.5 1-2.5 2.5-2.5S9 6.5 9 8v8c0 1.5-1 2.5-2.5 2.5S4 17.5 4 16z" />
      <path d="M20 8c0-1.5-1-2.5-2.5-2.5S15 6.5 15 8v8c0 1.5 1 2.5 2.5 2.5S20 17.5 20 16z" />
      <path d="M9 8h6M9 16h6M9 12h6" />
      <path d="M9 8v8M15 8v8" />
    </>
  ),
  // u5l2 Reading the Torah — Trop (cantillation notes)
  trop_notes: makeSvg(
    <>
      <path d="M9 18V6l8-3v12" />
      <ellipse cx="7" cy="18" rx="2" ry="1.5" />
      <ellipse cx="15" cy="15" rx="2" ry="1.5" />
      <path d="M9 9l8-3" />
    </>
  ),
  // u5l3 Commentary — Quill and inkwell
  quill: makeSvg(
    <>
      <path d="M20 3L9 14l-1 5 5-1L24 7z" />
      <path d="M14 9l4 4" />
      <path d="M3 21l5-5" />
    </>
  ),
  // u5l4 Applying Torah to Daily Life — Path with steps
  footsteps: makeSvg(
    <>
      <path d="M4 20c2-4 5-6 8-10s5-5 8-6" />
      <circle cx="4" cy="20" r="1.3" fill="currentColor" />
      <circle cx="10" cy="14" r="1.3" fill="currentColor" />
      <circle cx="16" cy="8" r="1.3" fill="currentColor" />
      <path d="M18 4l2.5-.5L20 6" />
    </>
  ),

  // ── Shared across all 5 unit quizzes ─────────────────────
  quiz_checklist: makeSvg(
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M7.5 9l1.5 1.5L12 7.5" />
      <path d="M7.5 14l1.5 1.5L12 12.5" />
      <path d="M14 9.5h3.5" />
      <path d="M14 14.5h3.5" />
      <path d="M7.5 18h10" />
    </>
  ),
};

export function iconFor(name) {
  return ICONS[name];
}

export default function Icon({ name, size = '1em', title, style = {}, className = '' }) {
  const val = ICONS[name];
  if (val == null) return null;

  // SVG: render at 1em (inherits font-size) unless `size` overrides
  if (typeof val === 'function') {
    return val({
      width: size,
      height: size,
      role: 'img',
      'aria-label': title || name,
      focusable: 'false',
      className,
      style: { verticalAlign: 'middle', display: 'inline-block', ...style },
    });
  }

  // Emoji fallback
  return (
    <span
      className={className}
      role="img"
      aria-label={title || name}
      style={{ fontSize: size === '1em' ? undefined : size, lineHeight: 1, ...style }}
    >
      {val}
    </span>
  );
}
