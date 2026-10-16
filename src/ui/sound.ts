/**
 * Lightweight Web Audio synthesizer for TA Arena.
 * Zero external audio files or dependencies; generates procedural chimes, taps, and alerts.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  try {
    localStorage.setItem("ta_sound_enabled", enabled ? "1" : "0");
  } catch {
    // Ignore storage errors
  }
}

// Initialise from storage if available
if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem("ta_sound_enabled");
    if (stored !== null) {
      soundEnabled = stored === "1";
    }
  } catch {
    // Ignore storage errors
  }
}

/** Soft tactile tap sound for buttons and options */
export function playTap(): void {
  if (!soundEnabled) return;
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

/** Triumphant, crisp chime for Adult breakthrough or correct answer */
export function playSuccess(): void {
  if (!soundEnabled) return;
  const ctx = getContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

    const startTime = ctx.currentTime + idx * 0.06;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.35);
  });
}

/** Dramatic low thud and dissonance when walking into a psychological game trap (the Switch) */
export function playGameMove(): void {
  if (!soundEnabled) return;
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(140, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.28);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.28);
}

/** Victory fanfare for finishing a level or world */
export function playVictory(): void {
  if (!soundEnabled) return;
  const ctx = getContext();
  if (!ctx) return;

  const arpeggio = [440, 554.37, 659.25, 880, 1108.73]; // A major
  arpeggio.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const t = ctx.currentTime + i * 0.08;
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.45);
  });
}
