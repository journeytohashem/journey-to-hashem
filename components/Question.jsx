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
    case 'true_false': return <TrueFalse q={question} onAnswer={onAnswer} />;
    case 'fill_blank': return <FillBlank q={question} onAnswer={onAnswer} />;
    case 'typed_translation': return <FillBlank q={question} onAnswer={onAnswer} />;
    case 'match_pairs': return <MatchPairs q={question} onAnswer={onAnswer} />;
    // order_steps added in later tasks
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

function TrueFalse({ q, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState(false);
  useEffect(() => { setSelected(null); setAnswered(false); }, [q]);

  const submit = (val) => {
    if (answered) return;
    const correct = val === q.correct;
    setSelected(val);
    setAnswered(true);
    if (correct) { playCorrect(); hapticLight(); }
    else { playWrong(); setShake(true); setTimeout(() => setShake(false), 400); }
    onAnswer({ correct, typo: false });
  };

  const optClass = (val) => {
    if (!answered) return 'q-option';
    if (val === q.correct) return 'q-option correct disabled';
    if (val === selected)  return 'q-option wrong disabled';
    return 'q-option disabled';
  };

  return (
    <div>
      <div style={{ marginBottom: 12, fontSize: 18 }}>{q.prompt}</div>
      <div className={`q-tf-row ${shake ? 'q-shake' : ''}`}>
        <button className={optClass(true)}  onClick={() => submit(true)}>True</button>
        <button className={optClass(false)} onClick={() => submit(false)}>False</button>
      </div>
      {answered && <Feedback correct={selected === q.correct} explanation={q.explanation} />}
    </div>
  );
}

function FillBlank({ q, onAnswer }) {
  const [value, setValue] = useState('');
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState({ correct: false, typo: false });
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { setValue(''); setAnswered(false); }, [q]);

  const submit = (e) => {
    e.preventDefault();
    if (answered || !value.trim()) return;
    const r = gradeTyped(value, q.answer_variants, q.answer_variants_he);
    setResult(r);
    setAnswered(true);
    if (r.correct) { playCorrect(); hapticLight(); }
    else { playWrong(); setShake(true); setTimeout(() => setShake(false), 400); }
    onAnswer(r);
  };

  const isHeb = containsHebrew(value);
  const inputDir = isHeb ? 'rtl' : 'ltr';

  return (
    <form onSubmit={submit}>
      <div style={{ marginBottom: 12, fontSize: 18 }}>{q.prompt}</div>
      <div className={shake ? 'q-shake' : ''}>
        <input
          ref={inputRef}
          className={`q-input ${answered ? (result.correct ? 'correct' : 'wrong') : ''}`}
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={answered}
          dir={inputDir}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
      {!answered && (
        <button type="submit" className="btn-primary" style={{ marginTop: 12 }} disabled={!value.trim()}>
          Check
        </button>
      )}
      {answered && (
        <Feedback
          correct={result.correct}
          typo={result.typo}
          userTyped={value}
          answer={q.answer_variants[0]}
          explanation={q.explanation}
        />
      )}
    </form>
  );
}

function MatchPairs({ q, onAnswer }) {
  const [pairs, setPairs] = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => { setPairs({}); setSelectedLeft(null); setAnswered(false); }, [q]);

  const allPaired = Object.keys(pairs).length === q.left.length;

  const onLeft = (id) => {
    if (answered || pairs[id]) return;
    setSelectedLeft(id === selectedLeft ? null : id);
  };
  const onRight = (rid) => {
    if (answered || !selectedLeft) return;
    if (Object.values(pairs).includes(rid)) return;
    setPairs(p => ({ ...p, [selectedLeft]: rid }));
    setSelectedLeft(null);
  };

  const submit = () => {
    if (answered || !allPaired) return;
    const correct = gradeMatchPairs(pairs, q.correct);
    setAnswered(true);
    if (correct) { playCorrect(); hapticLight(); }
    else { playWrong(); setShake(true); setTimeout(() => setShake(false), 400); }
    onAnswer({ correct, typo: false });
  };

  return (
    <div>
      <div style={{ marginBottom: 12, fontSize: 18 }}>{q.prompt}</div>
      <div className={`q-pair-row ${shake ? 'q-shake' : ''}`}>
        <div className="q-pair-col">
          {q.left.map(item => {
            const paired = !!pairs[item.id];
            const selected = selectedLeft === item.id;
            return (
              <button key={item.id}
                className={`q-pair-item${selected ? ' selected' : ''}${paired ? ' paired' : ''}`}
                onClick={() => onLeft(item.id)}>
                {item.text}{paired && ` → ${q.right.find(r => r.id === pairs[item.id]).text}`}
              </button>
            );
          })}
        </div>
        <div className="q-pair-col">
          {q.right.map(item => {
            const usedBy = Object.entries(pairs).find(([_, rid]) => rid === item.id);
            return (
              <button key={item.id}
                className={`q-pair-item${usedBy ? ' paired' : ''}`}
                onClick={() => onRight(item.id)}>
                {item.text}
              </button>
            );
          })}
        </div>
      </div>
      {!answered && (
        <button className="btn-primary" style={{ marginTop: 12 }} disabled={!allPaired} onClick={submit}>Check</button>
      )}
      {answered && (
        <Feedback correct={gradeMatchPairs(pairs, q.correct)} explanation={q.explanation} />
      )}
    </div>
  );
}

export { Feedback };
