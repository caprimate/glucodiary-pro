import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Esto es lo que faltaba y arregla todo:
  root: '.',           // indica que index.html está en la raíz
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html'  // ← le dice explícitamente cuál es el entry
    }
  }
})
