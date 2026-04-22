// Hebrew Unicode block: \u0590-\u05FF
const HEBREW_RE = /[\u0590-\u05FF]/;

export function containsHebrew(s) {
  return HEBREW_RE.test(s);
}

export function normalize(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g, ' ');
}

export function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev = new Array(b.length + 1);
  const cur = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(
        cur[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j];
  }
  return prev[b.length];
}

/**
 * Grade a typed answer against a list of English and optional Hebrew variants.
 * Returns { correct: boolean, typo: boolean }. typo=true means 1-char off on a 6+ letter word — still correct.
 */
export function gradeTyped(input, variantsEn = [], variantsHe = []) {
  const raw = String(input);
  const useHebrew = containsHebrew(raw);
  const variants = useHebrew && variantsHe.length > 0 ? variantsHe : variantsEn;
  const user = normalize(raw);
  if (!user) return { correct: false, typo: false };

  for (const v of variants) {
    const target = normalize(v);
    if (user === target) return { correct: true, typo: false };
  }
  // Typo tolerance: only for answers where target length >= 6
  for (const v of variants) {
    const target = normalize(v);
    if (target.length >= 6 && levenshtein(user, target) === 1) {
      return { correct: true, typo: true };
    }
  }
  return { correct: false, typo: false };
}

/**
 * Grade pair-matching question. userPairs and correctPairs are objects like {leftId: rightId}.
 */
export function gradeMatchPairs(userPairs, correctPairs) {
  const keys = Object.keys(correctPairs);
  if (Object.keys(userPairs).length !== keys.length) return false;
  return keys.every(k => userPairs[k] === correctPairs[k]);
}

/**
 * Grade ordering question. Both are arrays of step IDs in the user's chosen order.
 */
export function gradeOrderSteps(userOrder, correctOrder) {
  if (userOrder.length !== correctOrder.length) return false;
  return userOrder.every((s, i) => s === correctOrder[i]);
}
