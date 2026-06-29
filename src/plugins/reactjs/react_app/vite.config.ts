import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [react()],
  base: '/static/reactjs/',
  build: {
    outDir: '../../../static/reactjs',
    emptyOutDir: true,
    lib: {
      entry: 'src/main.tsx',
      name: 'ReactApp',
      formats: ['iife'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'main.[ext]',
      },
    },
  },
})
