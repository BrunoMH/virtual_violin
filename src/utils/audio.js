// Small synthesizer that approximates a bowed-string tone using layered
// oscillators + a slow vibrato + a soft attack/release envelope. No audio
// files are needed: every note is generated on demand from its frequency.

let sharedContext = null

function getContext() {
  if (!sharedContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    sharedContext = new AudioCtx()
  }
  if (sharedContext.state === 'suspended') {
    sharedContext.resume()
  }
  return sharedContext
}

/**
 * Plays a single note and reports progress back to the caller so a UI
 * (like a play-bar) can animate in sync.
 *
 * @param {number} frequency - pitch in Hz
 * @param {number} duration - seconds
 * @param {(elapsedRatio: number) => void} onProgress
 * @returns {() => void} stop function
 */
export function playNote(frequency, duration = 1.6, onProgress = () => {}) {
  const ctx = getContext()
  const now = ctx.currentTime

  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0001, now)
  master.connect(ctx.destination)

  // Gentle bow-like envelope: soft attack, sustain, soft release.
  const attack = 0.08
  const release = 0.35
  const peak = 0.22
  master.gain.exponentialRampToValueAtTime(peak, now + attack)
  master.gain.setValueAtTime(peak, now + Math.max(attack, duration - release))
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  // Warm tone body via a lowpass filter.
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = frequency * 6
  filter.Q.value = 0.7
  filter.connect(master)

  // Fundamental + a couple of harmonics for a richer, string-like timbre.
  const partials = [
    { ratio: 1, gain: 1.0, type: 'sawtooth' },
    { ratio: 2, gain: 0.25, type: 'triangle' },
    { ratio: 3, gain: 0.12, type: 'sine' },
  ]

  const oscillators = partials.map(({ ratio, gain, type }) => {
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.value = frequency * ratio

    const partialGain = ctx.createGain()
    partialGain.gain.value = gain
    osc.connect(partialGain)
    partialGain.connect(filter)
    return osc
  })

  // Subtle vibrato for a touch of realism.
  const vibrato = ctx.createOscillator()
  vibrato.frequency.value = 5.5
  const vibratoDepth = ctx.createGain()
  vibratoDepth.gain.value = frequency * 0.006
  vibrato.connect(vibratoDepth)
  oscillators.forEach((osc) => vibratoDepth.connect(osc.detune))

  oscillators.forEach((osc) => osc.start(now))
  vibrato.start(now)
  oscillators.forEach((osc) => osc.stop(now + duration + 0.05))
  vibrato.stop(now + duration + 0.05)

  let rafId
  const startTime = performance.now()
  const tick = () => {
    const elapsed = (performance.now() - startTime) / 1000
    const ratio = Math.min(elapsed / duration, 1)
    onProgress(ratio)
    if (ratio < 1) {
      rafId = requestAnimationFrame(tick)
    }
  }
  rafId = requestAnimationFrame(tick)

  const stop = () => {
    cancelAnimationFrame(rafId)
    const t = ctx.currentTime
    master.gain.cancelScheduledValues(t)
    master.gain.setValueAtTime(master.gain.value, t)
    master.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
    oscillators.forEach((osc) => {
      try { osc.stop(t + 0.06) } catch (e) { /* already stopped */ }
    })
    try { vibrato.stop(t + 0.06) } catch (e) { /* already stopped */ }
    onProgress(1)
  }

  return stop
}
