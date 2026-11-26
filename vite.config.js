import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PREVIEW=1 builds a relative-path bundle with an in-memory router (for sandboxed previews).
export default defineConfig({
  plugins: [react()],
  base: process.env.PREVIEW ? './' : '/',
  define: { __PREVIEW__: JSON.stringify(!!process.env.PREVIEW) },
  ssr: { noExternal: ['react-helmet-async', 'lucide-react'] },
  build: { cssCodeSplit: true, sourcemap: false, target: 'es2019' },
})
