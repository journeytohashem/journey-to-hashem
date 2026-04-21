import React, { useState, useEffect, useRef } from 'react';
import { gradeTyped, gradeMatchPairs, gradeOrderSteps, containsHebrew } from '../lib/grading';
import { playCorrect, playWrong, hapticLight } from '../lib/celebrations';

/**
 * A single question. Calls onAnswer({correct, typo}) once submitted.
 * Parent controls resetting by changing the `key` prop between iterations.
 */
export default function Question({ question, onAnswer }) {
  switch (question.type) {
    case 'multiple_choice': return <MultipleChoice q={question} onAnswer={onAnswer} />;
    // true_false / fill_blank / typed_translation / match_pairs / order_steps added in later tasks
    default: return <div>Unsupported question type: {question.type}</div>;
  }
}

function Feedback({ correct, typo, explanation, userTyped, answer }) {
  return (
    <div className={`q-feedback ${correct ? 'correct' : 'wrong'}`}>
      {correct && typo && userTyped
        ? <>Almost! You typed <em>{userTyped}</em>, the answer is <em>{answer}</em>. {explanation}</>
        : correct
          ? <>Correct! {explanation}</>
          : <>Not quite. {explanation}</>}
    </div>
  );
}

function MultipleChoice({ q, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => { setSelected(null); setAnswered(false); }, [q]);

  const submit = (i) => {
    if (answered) return;
    const correct = i === q.correct;
    setSelected(i);
    setAnswered(true);
    if (correct) { playCorrect(); hapticLight(); }
    else { playWrong(); setShake(true); setTimeout(() => setShake(false), 400); }
    onAnswer({ correct, typo: false });
  };

  return (
    <div>
      <div style={{ marginBottom: 12, fontSize: 18 }}>{q.prompt}</div>
      <div className={shake ? 'q-shake' : ''}>
        {q.options.map((opt, i) => {
          let cls = 'q-option';
          if (answered) {
            if (i === q.correct) cls += ' correct';
            else if (i === selected) cls += ' wrong';
            cls += ' disabled';
          }
          return <button key={i} className={cls} onClick={() => submit(i)}>{opt}</button>;
        })}
      </div>
      {answered && <Feedback correct={selected === q.correct} explanation={q.explanation} />}
    </div>
  );
}

export { Feedback };
