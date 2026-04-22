import React from 'react';
import Icon, { ICONS } from './Icon.jsx';

export default function Hearts({ count, max = 5 }) {
  return (
    <span className="hearts-row" role="img" aria-label={`${count} of ${max} hearts`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`heart-slot${i >= count ? ' empty' : ''}`}>{ICONS.heart}</span>
      ))}
    </span>
  );
}
