export default function NoteButton({ x, y, note, onSelect }) {
  return (
    <g
      className="note-button"
      transform={`translate(${x} ${y})`}
      onClick={() => onSelect(note)}
      tabIndex={0}
      role="button"
      aria-label={`Nota ${note.spanish}, ${note.position === 0 ? 'cuerda al aire' : `posición ${note.position}`}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(note)
      }}
    >
      <circle r="14" className="note-circle" />
      <text y="4" textAnchor="middle" className="note-label">
        {note.spanish}
      </text>
    </g>
  )
}
