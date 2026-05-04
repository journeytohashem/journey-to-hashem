import { useState, useRef, useEffect } from 'react';
import { ICONS } from './Icon.jsx';

function GuideSlide({ slide }) {
  return (
    <div className="lesson-slide">
      {slide.title && <h2 className="lesson-slide-title">{slide.title}</h2>}
      {slide.body && (
        <div className="lesson-slide-body" dangerouslySetInnerHTML={{ __html: slide.body }} />
      )}
      {slide.hebrew && (
        <div className="lesson-hebrew-block">
          <div className="lesson-hebrew">{slide.hebrew}</div>
          {slide.transliteration && (
            <div className="lesson-transliteration">{slide.transliteration}</div>
          )}
          {slide.translation && (
            <div className="lesson-translation">{slide.translation}</div>
          )}
        </div>
      )}
      {slide.tip && (
        <div className="guide-tip">
          <div className="guide-tip-label">Practical tip</div>
          <div className="guide-tip-text">{slide.tip}</div>
        </div>
      )}
    </div>
  );
}

export default function GuidePlayer({ guide, onClose }) {
  const [idx, setIdx] = useState(0);
  const contentRef = useRef(null);
  const isLast = idx === guide.slides.length - 1;
  const progress = ((idx + 1) / guide.slides.length) * 100;

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [idx]);

  const advance = () => {
    if (isLast) { onClose(); return; }
    setIdx(i => i + 1);
  };

  return (
    <div className="screen-full lesson-screen fade-in">
      <div className="lesson-header">
        <button className="btn-icon" onClick={onClose}>{ICONS.close}</button>
        <div className="lesson-header-info">
          <p className="lesson-header-unit">Quick Guide</p>
          <p className="lesson-header-title">{guide.title}</p>
        </div>
        <div style={{ width: 44 }} />
      </div>
      <div className="lesson-progress-bar">
        <div className="lesson-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="lesson-content" ref={contentRef}>
        <GuideSlide slide={guide.slides[idx]} />
      </div>
      <div className="lesson-nav">
        {idx > 0 ? (
          <button className="btn-secondary" style={{ padding: '12px 20px' }} onClick={() => setIdx(i => i - 1)}>
            ← Back
          </button>
        ) : <span />}
        <button className="btn-primary" onClick={advance}>
          {isLast ? 'Done ✓' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
