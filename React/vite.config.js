import { createHash } from 'node:crypto'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const shortHash = (input) =>
  createHash('sha256').update(input).digest('base64url').slice(0, 5)

/**
 * Turns `.card` in FetchApiCard/components/Card.module.css into
 * `FetchApiCard-Card-card__k3Lp9`.
 *
 * The hash is what actually guarantees uniqueness; the readable prefix just
 * means you can tell at a glance in devtools which exercise a rule came from.
 */
function generateScopedName(name, filename) {
  const path = filename.replace(/\\/g, '/')
  const exercise = path.match(/\/machine-coding\/([^/]+)\//)?.[1]
  const file = path.split('/').at(-1).replace(/\.module\.css$/, '')
  const scope = exercise ? `${exercise}-${file}` : file

  return `${scope}-${name}__${shortHash(path)}`
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: { modules: { generateScopedName } },
})
