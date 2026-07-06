# Violín Virtual 🎻

Diapasón de violín interactivo. Cada posición del mástil (donde iría el dedo
de la mano izquierda) es un botón; al presionarlo se abre un modal que
muestra la nota en el pentagrama (clave de sol) y un botón de reproducción
con una barra de progreso, igual que en el diseño de Figma de referencia.

## Cómo funciona

- **`src/data/notes.js`** genera matemáticamente las notas de las 4 cuerdas
  (Sol, Re, La, Mi) usando teoría musical real: cada cuerda al aire sube
  cromáticamente 12 semitonos (una octava completa de posiciones). De ahí se
  calculan la frecuencia (Hz) y la posición exacta en el pentagrama — nada
  está hard-codeado nota por nota.
- **`src/components/Fingerboard.jsx`** dibuja el mástil, clavijero, cuerdas y
  parte del cuerpo del violín en SVG, y coloca un `NoteButton` en cada
  posición con la separación real (más angosta cerca de la cejuela, más
  ancha hacia el cuerpo).
- **`src/components/NoteModal.jsx`** + **`StaffNotation.jsx`** dibujan el
  pentagrama y calculan la posición vertical exacta de la nota (con líneas
  adicionales/ledger lines automáticas si la nota cae fuera del pentagrama).
- **`src/utils/audio.js`** sintetiza el sonido de cada nota en tiempo real
  con Web Audio API (osciladores + armónicos + vibrato sutil) — no se
  necesitan archivos de audio.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Build de producción

```bash
npm run build
npm run preview
```

## Estructura

```
src/
  data/notes.js           # teoría musical: notas, frecuencias, posición en pentagrama
  utils/audio.js          # sintetizador Web Audio
  components/
    Fingerboard.jsx        # SVG del mástil + botones de posición
    NoteButton.jsx          # botón individual (círculo + etiqueta)
    NoteModal.jsx            # modal con pentagrama + reproductor
    StaffNotation.jsx        # dibuja el pentagrama y la nota
  App.jsx
  index.css
```

## Personalización rápida

- **Más o menos posiciones por cuerda:** cambia el tercer argumento de
  `buildString(...)` en `notes.js` (por defecto 12).
- **Duración o timbre del sonido:** ajusta `playNote(frequency, duration, ...)`
  y los `partials` en `audio.js`.
- **Colores/tipografía:** todo el sistema de diseño vive en las variables
  `:root` de `index.css`.
