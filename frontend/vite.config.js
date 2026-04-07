import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.VITE_BACKEND_TARGET?.trim()

  return {
    plugins: [react()],
    server: backendTarget
      ? {
          proxy: {
            '/api': {
              changeOrigin: true,
              secure: false,
              target: backendTarget,
            },
          },
        }
      : undefined,
  }
})
