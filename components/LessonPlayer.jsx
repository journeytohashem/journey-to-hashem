import React, { useState, useMemo, useEffect, useRef } from 'react';
import Question from './Question.jsx';
import Hearts from './Hearts.jsx';
import Icon, { ICONS } from './Icon.jsx';
import { MAX_HEARTS } from '../lib/gameplay';
import { playLessonComplete, burstConfetti, hapticSuccess } from '../lib/celebrations';

const STATIC_SLIDE_TYPES = new Set(['hook', 'teach0', 'teach1', 'wrap']);

/**
 * Builds the initial sequence array for a lesson.
 * Uses question index from lesson.questions (0-based).
 * For quiz lessons (isQuiz=true), no teach slides — just hook → all questions → wrap.
 */
function buildSequence(lesson) {
  if (lesson.isQuiz) {
    return [
      { kind: 'hook' },
      ...lesson.questions.map((_, i) => ({ kind: 'question', qi: i })),
      { kind: 'wrap' },
    ];
  }
  return [
    { kind: 'hook' },
    { kind: 'question', qi: 0 },
    { kind: 'question', qi: 1 },
    { kind: 'teach', ti: 0 },
    { kind: 'question', qi: 2 },
    { kind: 'question', qi: 3 },
    { kind: 'teach', ti: 1 },
    { kind: 'question', qi: 4 },
    { kind: 'question', qi: 5 },
    { kind: 'question', qi: 6 },
    { kind: 'question', qi: 7 },
    { kind: 'wrap' },
  ];
}

function Slide({ slide }) {
  return (
    <div className="lesson-slide">
      {slide.title && <h2 className="lesson-slide-title">{slide.title}</h2>}
      {slide.body && <div className="lesson-slide-body" dangerouslySetInnerHTML={{ __html: slide.body }} />}
      {slide.hebrew && (
        <div className="lesson-hebrew-block">
          <div className="lesson-hebrew">{slide.hebrew}</div>
          {slide.transliteration && <div className="lesson-transliteration">{slide.transliteration}</div>}
          {slide.translation && <div className="lesson-translation">{slide.translation}</div>}
        </div>
      )}
      {slide.concept && (
        <div className="lesson-key-concept">
          <div className="lesson-key-label">Key Concept</div>
          <div className="lesson-key-text">{slide.concept}</div>
        </div>
      )}
    </div>
  );
}

function reinsertWrong(queue, currentIdx, wrongItem) {
  const out = queue.slice();
  const wrapIdx = out.findIndex((x, i) => i > currentIdx && x.kind === 'wrap');
  const target = wrapIdx === -1 ? out.length : wrapIdx;
  out.splice(target, 0, wrongItem);
  return out;
}

export default function LessonPlayer({
  lesson, unit, hearts, onClose, onComplete, isBookmarked, onToggleBookmark,
}) {
  const baseSequence = useMemo(() => buildSequence(lesson), [lesson]);
  const [queue, setQueue] = useState(baseSequence);
  const [idx, setIdx] = useState(0);
  const [heartsLeft, setHeartsLeft] = useState(hearts);
  const [ranOut, setRanOut] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [seenFirstPass, setSeenFirstPass] = useState(new Set());
  const contentRef = useRef(null);

  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [idx]);

  const step = queue[idx];
  const progress = ((idx + 1) / queue.length) * 100;

  const advance = () => setIdx(i => Math.min(i + 1, queue.length - 1));

  const handleAnswer = ({ correct }) => {
    const qItem = queue[idx];
    const firstPass = !seenFirstPass.has(qItem.qi);
    if (firstPass) setSeenFirstPass(s => new Set(s).add(qItem.qi));

    if (!correct && firstPass) {
      setWrongCount(c => c + 1);
      setHeartsLeft(h => {
        const next = Math.max(0, h - 1);
        if (next === 0) setRanOut(true);
        return next;
      });
      setQueue(q => reinsertWrong(q, idx, { kind: 'question', qi: qItem.qi, revisit: true }));
    }
  };

  const isLast = idx === queue.length - 1 && step.kind === 'wrap';

  const complete = () => {
    burstConfetti();
    playLessonComplete();
    hapticSuccess();
    onComplete({ wrongAnswers: wrongCount, ranOutOfHearts: ranOut });
  };

  let body = null;
  if (step.kind === 'hook')   body = <Slide slide={lesson.hook} />;
  else if (step.kind === 'teach') body = <Slide slide={lesson.teachSlides[step.ti]} />;
  else if (step.kind === 'wrap')  body = <Slide slide={lesson.wrap} />;
  else if (step.kind === 'question') {
    const q = lesson.questions[step.qi];
    body = <Question key={`${step.qi}-${idx}`} question={q} onAnswer={handleAnswer} />;
  }

  return (
    <div className="screen-full lesson-screen fade-in">
      <div className="lesson-header">
        <button className="btn-icon" onClick={onClose}>{ICONS.close}</button>
        <div className="lesson-header-info">
          <p className="lesson-header-unit">{unit?.title}</p>
          <p className="lesson-header-title">{lesson.title}</p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <Hearts count={heartsLeft} max={MAX_HEARTS} />
          <button
            className={`lesson-bookmark-btn${isBookmarked ? ' bookmarked' : ''}`}
            onClick={onToggleBookmark}
          >{isBookmarked ? ICONS.bookmark : ICONS.bookmark_outline}</button>
        </div>
      </div>
      <div className="lesson-progress-bar">
        <div className="lesson-progress-fill" style={{ width: `${progress}%` }}/>
      </div>
      <div className="lesson-content" ref={contentRef}>
        {body}
      </div>
      <StepNav step={step} isLast={isLast} onAdvance={advance} onComplete={complete} />
    </div>
  );
}

function StepNav({ step, isLast, onAdvance, onComplete }) {
  if (step.kind !== 'question') {
    return (
      <div className="lesson-nav">
        <span />
        <button className="btn-primary" onClick={isLast ? onComplete : onAdvance}>
          {isLast ? 'Complete ✓' : 'Continue →'}
        </button>
      </div>
    );
  }
  return <QuestionAdvancer isLast={isLast} onAdvance={onAdvance} onComplete={onComplete} />;
}

function QuestionAdvancer({ isLast, onAdvance, onComplete }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const h = () => setReady(true);
    window.addEventListener('jth-question-answered', h);
    return () => window.removeEventListener('jth-question-answered', h);
  }, []);
  return (
    <div className="lesson-nav">
      <span />
      <button className="btn-primary" disabled={!ready} onClick={() => {
        setReady(false);
        isLast ? onComplete() : onAdvance();
      }}>
        {isLast ? 'Complete ✓' : 'Continue →'}
      </button>
    </div>
  );
}
