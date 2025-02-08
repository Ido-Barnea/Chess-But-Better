import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

const PORT = 3000;

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: PORT,
    open: true,
    watch: {
      ignored: []
    }
  }
})
