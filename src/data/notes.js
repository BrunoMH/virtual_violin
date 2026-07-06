// Music theory helpers for the violin fingerboard.
// Notes are generated programmatically from each open string, so the
// fingerboard is correct for any number of positions.

const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Spanish solfège naming, matching the reference fingerboard chart.
const SPANISH = {
  C: 'DO', 'C#': 'DO#',
  D: 'RE', 'D#': 'RE#',
  E: 'MI',
  F: 'FA', 'F#': 'FA#',
  G: 'SOL', 'G#': 'SOL#',
  A: 'LA', 'A#': 'LA#',
  B: 'SI',
}

const LETTER_INDEX = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 }

function midiNumber(letter, octave) {
  const semitone = CHROMATIC.indexOf(letter)
  return (octave + 1) * 12 + semitone
}

function frequencyFromMidi(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

// Diatonic "staff index": how many scale-letter steps this note sits from
// the very bottom of a theoretical grand staff. Every whole step here is
// exactly one line/space on the treble staff.
function diatonicIndex(letter, octave) {
  return octave * 7 + LETTER_INDEX[letter]
}

/**
 * Builds one string's worth of fingerboard positions.
 * @param {string} openLetter - pitch letter of the open string, e.g. 'G'
 * @param {number} openOctave
 * @param {string} label - display label for the open string, e.g. 'Sol'
 * @param {number} positions - how many semitone positions up from open (frets)
 */
function buildString(openLetter, openOctave, label, positions = 12) {
  let chromaIdx = CHROMATIC.indexOf(openLetter)
  let octave = openOctave
  const notes = []

  for (let i = 0; i <= positions; i++) {
    const letter = CHROMATIC[chromaIdx]
    const midi = midiNumber(letter, octave)
    notes.push({
      id: `${label}-${i}`,
      stringLabel: label,
      position: i, // 0 = open string
      letter,
      octave,
      spanish: SPANISH[letter],
      accidental: letter.includes('#'),
      baseLetter: letter[0],
      frequency: frequencyFromMidi(midi),
      diatonic: diatonicIndex(letter[0], octave),
      pitchName: `${letter}${octave}`,
    })
    chromaIdx++
    if (chromaIdx >= 12) {
      chromaIdx = 0
      octave++
    }
  }
  return notes
}

// Standard violin tuning, low to high: G3, D4, A4, E5
export const STRINGS = [
  { key: 'G', label: 'Sol', notes: buildString('G', 3, 'Sol') },
  { key: 'D', label: 'Re', notes: buildString('D', 4, 'Re') },
  { key: 'A', label: 'La', notes: buildString('A', 4, 'La') },
  { key: 'E', label: 'Mi', notes: buildString('E', 5, 'Mi') },
]

export const POSITIONS_PER_STRING = STRINGS[0].notes.length
