/// <reference types="vitest" />
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const plugins = [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    mode === 'production' &&
    env.SENTRY_AUTH_TOKEN &&
    env.SENTRY_ORG &&
    env.SENTRY_PROJECT
      ? sentryVitePlugin({
          authToken: env.SENTRY_AUTH_TOKEN,
          org: env.SENTRY_ORG,
          project: env.SENTRY_PROJECT,
          telemetry: false,
        })
      : undefined,
  ].filter(Boolean)

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      sourcemap: mode === 'production',
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['node_modules/**', 'dist/**', 'tests/**', 'test/**'],
    },
  }
})
