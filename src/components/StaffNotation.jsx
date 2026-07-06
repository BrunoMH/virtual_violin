// Renders a treble-clef staff with a single notehead placed at the exact
// diatonic position, adding ledger lines automatically when the note
// falls above or below the five lines (very common on a violin!).

const TOP_Y = 40      // y coordinate of the top staff line (F5)
const DY = 10          // pixels between one diatonic step (half a line-gap)
const STAFF_LINES = 5
const TOP_DIATONIC = 5 * 7 + 3 // F5 -> octave 5, letter index F=3

const STAFF_LEFT = 56
const STAFF_RIGHT = 210
const VIEW_WIDTH = 240

export default function StaffNotation({ note }) {
  const bottomY = TOP_Y + (STAFF_LINES - 1) * 2 * DY
  const noteY = TOP_Y + (TOP_DIATONIC - note.diatonic) * DY
  const noteX = (STAFF_LEFT + STAFF_RIGHT) / 2 + 14

  // Ledger lines needed above/below the staff.
  const ledgerLines = []
  if (noteY < TOP_Y) {
    const steps = Math.floor((TOP_Y - noteY) / (2 * DY))
    for (let i = 1; i <= steps; i++) ledgerLines.push(TOP_Y - i * 2 * DY)
  } else if (noteY > bottomY) {
    const steps = Math.floor((noteY - bottomY) / (2 * DY))
    for (let i = 1; i <= steps; i++) ledgerLines.push(bottomY + i * 2 * DY)
  }

  const viewMinY = Math.min(TOP_Y - 4 * DY, noteY - 20)
  const viewMaxY = Math.max(bottomY + 4 * DY, noteY + 20)
  const viewHeight = viewMaxY - viewMinY

  const staffLineYs = Array.from({ length: STAFF_LINES }, (_, i) => TOP_Y + i * 2 * DY)

  return (
    <svg
      viewBox={`0 ${viewMinY} ${VIEW_WIDTH} ${viewHeight}`}
      className="staff-svg"
      role="img"
      aria-label={`Nota ${note.spanish} en el pentagrama`}
    >
      {staffLineYs.map((y) => (
        <line key={y} x1={STAFF_LEFT} y1={y} x2={STAFF_RIGHT} y2={y} className="staff-line" />
      ))}

      {/* Treble clef glyph */}
      <text x={12} y={bottomY - 2} className="clef-glyph">𝄞</text>

      {ledgerLines.map((y) => (
        <line
          key={y}
          x1={noteX - 13}
          y1={y}
          x2={noteX + 13}
          y2={y}
          className="ledger-line"
        />
      ))}

      {note.accidental && (
        <text x={noteX - 22} y={noteY + 5} className="sharp-glyph">♯</text>
      )}

      <ellipse cx={noteX} cy={noteY} rx={9} ry={6.5} className="notehead" transform={`rotate(-18 ${noteX} ${noteY})`} />
      <line x1={noteX + 8.5} y1={noteY} x2={noteX + 8.5} y2={noteY - 32} className="notestem" />
    </svg>
  )
}
