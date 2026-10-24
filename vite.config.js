import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// proxy: при запуске на компьютере (npm run dev) запросы /api уходят на уже
// опубликованный сайт, где работает функция Telegram.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://autoparts-project-pearl.vercel.app',
        changeOrigin: true,
      },
    },
  },
})