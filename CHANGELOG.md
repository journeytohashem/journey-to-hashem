# Changelog

All notable changes to Journey to Hashem are documented here.

## [1.2.0] - 2026-04-24

### Added
- **PostHog analytics** — 5 manual events: `lesson_started`, `lesson_completed` (with XP, streak, perfect props), `quiz_completed`, `waitlist_signup`, `rabbi_interest`. No autocapture; clean signal.
- **`/for-rabbis` standalone page** — Rabbi pitch deck extracted to its own URL with full SEO `<Head>` tags. All "Partner With Us" entry points now open it in a new tab.
- **Progress backup** — Settings → "📤 Back Up My Progress" generates a `mailto:` with base64-encoded localStorage state and console restore instructions.

### Changed
- **Quiz-aware PathReady preview** — Scholars (knowledge level ≥ 3) now see Unit 5 (Torah Study) previewed instead of Unit 1, with label "You'll dive into Torah Study".
- **Marketing copy** — Removed all "Duolingo" comparisons. Community feature bullet replaced with "Rabbi-Centered" (honest, accurate). Rabbi pitch subtitle and roadmap Phase 5 updated to reflect unique positioning.
- Dynamic lesson count now used everywhere: feature bullets, PathReady meta, rabbi pitch card.

## [1.1.0] - 2026-04-24

### Added
- **Unit 6 — Kashrut (5 lessons):** What is Kashrut, Meat and Milk, The Kosher Kitchen, The Spiritual Dimension, Kashrut Quiz. Sourced from Shulchan Aruch Yoreh De'ah, Rambam, Talmud Chulin.
- **Unit 7 — Jewish Lifecycle (5 lessons):** Brit Milah, Bar and Bat Mitzvah, Kiddushin, Mourning and Kaddish, Lifecycle Quiz. Sourced from Talmud Kiddushin, Shulchan Aruch, Rambam.
- **Unit 8 — Ethics and Mitzvot (5 lessons):** Tzedakah, Lashon Hara, Kibud Av Va'em, Chessed and Teshuvah, Ethics Quiz. Sourced from Rambam, Chofetz Chaim, Talmud.
- **12 new lesson icons** in SVG line-art style for Units 6–8 (kashrut_seal, meat_milk, kosher_kitchen, kashrut_spirit, brit_milah, bar_mitzvah, chuppah, yahrzeit, tzedakah_hand, lashon_hara, kibud_av, teshuvah).
- **"Core Curriculum Complete" end screen** — shown after lesson 40 with a "Units 9+ are in development" signal so users know more is coming.

### Changed
- Learning path expanded from 25 to 40 lessons (5 units → 8 units).
- Badge thresholds updated: "Halfway There" now triggers at 20 lessons (was 12); "Path Complete" now triggers at 40 lessons (was 25).
- End screen subtitle dynamically derives lesson count and unit names from LEARNING_PATH so it stays accurate as units are added.

## [1.0.0] - 2026-04-21

### Added
- Initial release with 25 lessons across 5 units: Foundations of Faith, Shabbat, Prayer, Jewish Holidays, Torah Study.
- Gamification system: XP, streaks, hearts, badges, streak freeze.
- Learning path map with lesson nodes, unit dividers, and bookmarks.
- Search, Daily Insight, Parasha widget, waitlist form, rabbi pitch form.
