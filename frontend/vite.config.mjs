import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: './', // 빌드 시 상대 경로를 사용하도록 설정
  // publicDir: 'img',
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'img',
          dest: ''
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        search: resolve(__dirname, 'search.html'),
        service: resolve(__dirname, 'service.html'),
        about: resolve(__dirname, 'about.html'),
      }
    }
  }
})