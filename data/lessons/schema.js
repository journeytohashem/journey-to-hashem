/**
 * Lesson schema — V1 gamification format.
 * Every lesson is an object matching this shape. No runtime validation; this is a reference.
 *
 * @typedef {Object} Lesson
 * @property {string} id           e.g. "u1l1"
 * @property {string} title        Short lesson title
 * @property {string} iconName     Key into ICONS map (see components/Icon.jsx)
 * @property {boolean} [isQuiz]    True for unit-quiz lessons (all questions, no teach slides)
 * @property {Slide}   hook        Opening slide — 2 sentences max
 * @property {Slide[]} teachSlides Additional teaching slides interleaved with questions (see ordering below)
 * @property {Question[]} questions 8 questions for regular lessons, more for quiz lessons
 * @property {Slide}   wrap        Closing slide with source citations
 * @property {string[]} sources    Array of citation strings (Talmud, Rambam, Zohar, etc.)
 * @property {string}  [readMore]  Optional extra context (HTML)
 *
 * Question ordering for regular lessons (teachSlides interleave with questions as defined by `ordering`):
 *   [hook, Q1, Q2, teach[0], Q3, Q4, teach[1], Q5, Q6, Q7, Q8, wrap]
 *
 * @typedef {Object} Slide
 * @property {string} [title]
 * @property {string} body         HTML. Keep ≤40 words for teachSlides.
 * @property {string} [hebrew]
 * @property {string} [transliteration]
 * @property {string} [translation]
 * @property {string} [concept]    Key concept callout
 *
 * @typedef {Object} Question
 * @property {'multiple_choice'|'true_false'|'fill_blank'|'typed_translation'|'match_pairs'|'order_steps'} type
 * @property {string} prompt
 * @property {string} [explanation] Shown on wrong answer
 *
 * For multiple_choice:
 * @property {string[]} options
 * @property {number} correct      Index into options
 *
 * For true_false:
 * @property {boolean} correct
 *
 * For fill_blank / typed_translation:
 * @property {string[]} answer_variants
 * @property {string[]} [answer_variants_he]
 *
 * For match_pairs:
 * @property {{id: string, text: string}[]} left    (Hebrew terms)
 * @property {{id: string, text: string}[]} right   (English meanings)
 * @property {{[leftId: string]: string}} correct  Mapping left.id → right.id
 *
 * For order_steps:
 * @property {{id: string, text: string}[]} steps   Shown shuffled to user
 * @property {string[]} correctOrder               Array of step.id values in the right order
 */
