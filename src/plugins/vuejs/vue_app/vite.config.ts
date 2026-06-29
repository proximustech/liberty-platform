import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
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
    lib: {
      entry: 'src/main.ts',
      name: 'VueApp',
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
