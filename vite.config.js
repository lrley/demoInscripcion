import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost+1-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost+1.pem')),
    },
    host: '0.0.0.0',
    port: 5173,
  },
})