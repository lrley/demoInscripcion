import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { InscripcionApp } from './InscripcionApp'

import "./formularioInscripciones.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InscripcionApp />
  </StrictMode>,
)
