import confetti from 'canvas-confetti';

let audioCtx = null;
function getCtx() {
  if (typeof window === 'undefined') return null;
  if (audioCtx) return audioCtx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  audioCtx = new AC();
  return audioCtx;
}

function tone({ freq = 880, duration = 0.12, type = 'sine', volume = 0.08 }) {
  const ctx = getCtx();
  if (!ctx) return;
  // Some browsers suspend until a user gesture. Resume on each call; harmless if already running.
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playCorrect() {
  tone({ freq: 880, duration: 0.1 });
  setTimeout(() => tone({ freq: 1175, duration: 0.12 }), 90);
}

export function playWrong() {
  tone({ freq: 220, duration: 0.18, type: 'square', volume: 0.05 });
}

export function playLessonComplete() {
  tone({ freq: 523, duration: 0.12 });
  setTimeout(() => tone({ freq: 659, duration: 0.12 }), 110);
  setTimeout(() => tone({ freq: 784, duration: 0.22 }), 220);
}

export function hapticLight() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
}

export function hapticSuccess() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10, 40, 10]);
}

export function burstConfetti() {
  if (typeof window === 'undefined') return;
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#c9a84c', '#ffffff', '#f5d173', '#0d1b2a'],
  });
}
