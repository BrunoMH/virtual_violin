import { describe, it, expect } from 'vitest'
import { STRINGS, POSITIONS_PER_STRING } from './notes.js'

describe('STRINGS', () => {
  it('has the 4 standard violin strings, low to high', () => {
    const keys = STRINGS.map((s) => s.key)
    expect(keys).toEqual(['G', 'D', 'A', 'E'])
  })

  it('gives every string the same number of positions', () => {
    STRINGS.forEach((s) => {
      expect(s.notes.length).toBe(POSITIONS_PER_STRING)
    })
  })

  it('tunes the open A string (A4) to exactly 440 Hz', () => {
    const aString = STRINGS.find((s) => s.key === 'A')
    const openNote = aString.notes[0]
    expect(openNote.frequency).toBeCloseTo(440, 5)
  })

  it('tunes the open G string (G3) close to the real-world 196 Hz', () => {
    const gString = STRINGS.find((s) => s.key === 'G')
    const openNote = gString.notes[0]
    expect(openNote.frequency).toBeCloseTo(196, 0)
  })

  it('increases frequency monotonically as position climbs the fingerboard', () => {
    STRINGS.forEach((s) => {
      for (let i = 1; i < s.notes.length; i++) {
        expect(s.notes[i].frequency).toBeGreaterThan(s.notes[i - 1].frequency)
      }
    })
  })

  it('assigns correct Spanish solfège names', () => {
    const aString = STRINGS.find((s) => s.key === 'A')
    expect(aString.notes[0].spanish).toBe('LA')
    const gString = STRINGS.find((s) => s.key === 'G')
    expect(gString.notes[0].spanish).toBe('SOL')
  })

  it('builds stable, unique ids per note', () => {
    const allIds = STRINGS.flatMap((s) => s.notes.map((n) => n.id))
    const uniqueIds = new Set(allIds)
    expect(uniqueIds.size).toBe(allIds.length)
  })

  it('flags sharp notes via the accidental field', () => {
    const gString = STRINGS.find((s) => s.key === 'G')
    const sharpNote = gString.notes.find((n) => n.letter.includes('#'))
    expect(sharpNote.accidental).toBe(true)
    const naturalNote = gString.notes.find((n) => !n.letter.includes('#'))
    expect(naturalNote.accidental).toBe(false)
  })
})