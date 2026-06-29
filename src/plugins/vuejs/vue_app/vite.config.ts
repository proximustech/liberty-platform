import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags starting with sl- as Shoelace web components
          isCustomElement: (tag) => tag.startsWith('sl-'),
        },
      },
    }),
  ],
  base: '/static/vuejs/',
  build: {
    outDir: '../../../static/vuejs',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'main.js',
        assetFileNames: 'main.[ext]',
      },
    },
  },
})
