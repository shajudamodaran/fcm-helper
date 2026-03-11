import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fcmSwPlugin } from './vite-plugin-fcm-sw'

// https://vite.dev/config/
export default defineConfig({
  plugins: [fcmSwPlugin(), react()],
  optimizeDeps: {
    include: ['firebase/app', 'firebase/messaging'],
  },
})
