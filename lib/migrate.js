export const CURRENT_SCHEMA = 4;

export const DEFAULT_V4_STATE = {
  schemaVersion: CURRENT_SCHEMA,
  // Existing fields (preserved if present in older state)
  // New users skip the landing/onboarding flow and open directly on Home.
  // The marketing Welcome screen is still reachable via ?view=landing.
  onboardingComplete: true,
  onboardingStep: null,
  selectedPath: null,
  pathName: "The Seeker's Path",
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
