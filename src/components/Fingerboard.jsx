import { STRINGS, POSITIONS_PER_STRING } from '../data/notes.js'
import NoteButton from './NoteButton.jsx'

const VIEW_W = 400
const NUT_Y = 96
const FINGERBOARD_END_Y = 610
const FIRST_ROW_Y = 128
const CENTER_X = 200

// String spacing narrows toward the nut, widens toward the body — like a
// real fingerboard.
const NUT_SPACING = 26
const END_SPACING = 68

function lerp(a, b, t) {
  return a + (b - a) * t
}

function rowY(i) {
  return FIRST_ROW_Y + (i * (FINGERBOARD_END_Y - FIRST_ROW_Y)) / (POSITIONS_PER_STRING - 1)
}

function stringX(stringIndex, y) {
  const t = (y - NUT_Y) / (FINGERBOARD_END_Y - NUT_Y)
  const spacing = lerp(NUT_SPACING, END_SPACING, t)
  const offset = (stringIndex - 1.5) * spacing
  return CENTER_X + offset
}

export default function Fingerboard({ onSelectNote }) {
  const nutXs = STRINGS.map((_, i) => stringX(i, NUT_Y))
  const endXs = STRINGS.map((_, i) => stringX(i, FINGERBOARD_END_Y))
  const tailXs = STRINGS.map((_, i) => stringX(i, FINGERBOARD_END_Y) )

  return (
    <svg viewBox={`0 0 ${VIEW_W} 920`} className="fingerboard-svg" role="group" aria-label="Diapasón de violín">
      <defs>
        <linearGradient id="woodGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C97B3D" />
          <stop offset="55%" stopColor="#A85C2E" />
          <stop offset="100%" stopColor="#7C3F1D" />
        </linearGradient>
        <linearGradient id="ebonyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A211B" />
          <stop offset="100%" stopColor="#120D0A" />
        </linearGradient>
        <radialGradient id="pegGradient" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#3A2C22" />
          <stop offset="100%" stopColor="#100C09" />
        </radialGradient>
      </defs>

      {/* Scroll + pegbox (decorative) */}
      <g>
        <path
          d="M186 6
             C 172 6 160 16 160 30
             C 160 46 176 54 190 50
             C 182 46 178 38 182 30
             C 186 22 198 22 200 32
             C 202 44 190 54 176 58
             C 158 63 150 46 156 32"
          fill="none" stroke="#5B3A22" strokeWidth="4" strokeLinecap="round"
        />
        <rect x="150" y="56" width="100" height="44" rx="6" fill="url(#woodGradient)" stroke="#4A2E18" strokeWidth="1.5" />
        {[
          { cx: 168, cy: 68 }, { cx: 232, cy: 68 },
          { cx: 168, cy: 88 }, { cx: 232, cy: 88 },
        ].map((p, i) => (
          <g key={i}>
            <circle cx={p.cx} cy={p.cy} r="7" fill="url(#pegGradient)" />
            <line x1={p.cx - 16} y1={p.cy} x2={p.cx + 16} y2={p.cy} stroke="#120D0A" strokeWidth="5" strokeLinecap="round" />
          </g>
        ))}
      </g>

      {/* Nut */}
      <rect x={CENTER_X - 52} y={NUT_Y - 5} width="104" height="9" rx="2" fill="#EDE3D1" />

      {/* Fingerboard neck */}
      <path
        d={`M ${CENTER_X - 46} ${NUT_Y}
            L ${CENTER_X - 100} ${FINGERBOARD_END_Y}
            L ${CENTER_X + 100} ${FINGERBOARD_END_Y}
            L ${CENTER_X + 46} ${NUT_Y}
            Z`}
        fill="url(#ebonyGradient)"
      />

      {/* Violin body (upper bout, visible behind the fingerboard end) */}
      <path
        d={`M 60 700
            C 60 640 110 605 200 605
            C 290 605 340 640 340 700
            C 340 760 320 790 270 810
            C 320 840 340 875 340 905
            L 320 918
            C 300 880 270 858 200 858
            C 130 858 100 880 80 918
            L 60 905
            C 60 875 80 840 130 810
            C 80 790 60 760 60 700 Z`}
        fill="url(#woodGradient)"
        stroke="#5A3316"
        strokeWidth="2"
      />
      <path
        d={`M 60 700
            C 60 640 110 605 200 605
            C 290 605 340 640 340 700
            C 340 760 320 790 270 810`}
        fill="none" stroke="#3E2211" strokeWidth="1.5" opacity="0.5"
      />

      {/* Strings */}
      {STRINGS.map((s, i) => (
        <line
          key={s.key}
          x1={nutXs[i]} y1={NUT_Y}
          x2={tailXs[i]} y2={840}
          stroke={i === 0 || i === 1 ? '#D9D2C4' : '#EDE8DD'}
          strokeWidth={i === 0 ? 2.4 : i === 1 ? 2 : i === 2 ? 1.5 : 1.1}
        />
      ))}

      {/* String name labels near the pegbox */}
      {STRINGS.map((s, i) => (
        <text key={s.key} x={nutXs[i]} y={NUT_Y - 12} textAnchor="middle" className="string-label">
          {s.label}
        </text>
      ))}

      {/* Note position buttons */}
      {STRINGS.map((s, sIndex) => (
        <g key={s.key}>
          {s.notes.map((note, posIndex) => {
            const y = rowY(posIndex)
            const x = stringX(sIndex, y)
            return (
              <NoteButton
                key={note.id}
                x={x}
                y={y}
                note={note}
                onSelect={onSelectNote}
              />
            )
          })}
        </g>
      ))}
    </svg>
  )
}
