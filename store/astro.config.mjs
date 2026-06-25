import node from '@astrojs/node'
import react from '@astrojs/react'
import clerk from '@clerk/astro'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react(), clerk()],
  server: { port: 5174 },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
})
