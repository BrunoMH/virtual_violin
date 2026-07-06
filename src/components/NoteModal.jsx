import { useEffect, useRef, useState } from 'react'
import StaffNotation from './StaffNotation.jsx'
import { playNote } from '../utils/audio.js'

export default function NoteModal({ note, onClose }) {
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const stopRef = useRef(null)

  useEffect(() => {
    return () => stopRef.current?.()
  }, [note])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handlePlay = () => {
    stopRef.current?.()
    setProgress(0)
    setIsPlaying(true)
    stopRef.current = playNote(note.frequency, 1.6, (ratio) => {
      setProgress(ratio)
      if (ratio >= 1) setIsPlaying(false)
    })
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <div className="modal-header">
          <span className="modal-string-tag">Cuerda {note.stringLabel}</span>
          <h2 className="modal-note-name">
            {note.spanish}
            <span className="modal-octave">{note.octave}</span>
          </h2>
          <p className="modal-position">
            {note.position === 0 ? 'Cuerda al aire' : `Posición ${note.position}`} · {note.frequency.toFixed(1)} Hz
          </p>
        </div>

        <div className="staff-wrapper">
          <StaffNotation note={note} />
        </div>

        <div className="player">
          <button
            className={`play-button ${isPlaying ? 'is-playing' : ''}`}
            onClick={handlePlay}
            aria-label="Reproducir nota"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" width="18" height="18"><rect x="6" y="5" width="4" height="14" fill="currentColor" /><rect x="14" y="5" width="4" height="14" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 5l12 7-12 7V5z" fill="currentColor" /></svg>
            )}
          </button>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
