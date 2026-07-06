import { useState } from 'react'
import Fingerboard from './components/Fingerboard.jsx'
import NoteModal from './components/NoteModal.jsx'

export default function App() {
  const [activeNote, setActiveNote] = useState(null)

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Diapasón interactivo</p>
        <h1>Violín Virtual</h1>
        <p className="subtitle">
          Toca cualquier posición para ver la nota en el pentagrama y escuchar cómo suena.
        </p>
      </header>

      <main className="stage">
        <Fingerboard onSelectNote={setActiveNote} />
      </main>

      <footer className="app-footer">
        <span className="footer-dot" /> Cuerdas: Sol · Re · La · Mi — afinación estándar
      </footer>

      {activeNote && (
        <NoteModal note={activeNote} onClose={() => setActiveNote(null)} />
      )}
    </div>
  )
}
