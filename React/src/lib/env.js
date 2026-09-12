/**
 * Environment boundary — the only module that touches `import.meta.env`.
 *
 * Values are validated once at startup. Problems are collected rather than
 * thrown, so the app can render a readable banner instead of a blank page,
 * and are also logged. Nothing fails silently.
 */

const RAW = import.meta.env

const TRUTHY = new Set(['true', '1', 'yes', 'on'])
const FALSY = new Set(['false', '0', 'no', 'off'])

const problems = []

function readString(key, fallback) {
  const raw = RAW[key]
  if (typeof raw !== 'string' || raw.trim() === '') {
    problems.push(`${key} is missing or empty — using "${fallback}"`)
    return fallback
  }
  return raw.trim()
}

function readUrl(key, fallback) {
  const raw = readString(key, fallback)
  try {
    return new URL(raw).toString().replace(/\/$/, '')
  } catch {
    problems.push(`${key} ("${raw}") is not a valid absolute URL`)
    return fallback
  }
}

function readBoolean(key, fallback) {
  const raw = readString(key, String(fallback)).toLowerCase()
  if (TRUTHY.has(raw)) return true
  if (FALSY.has(raw)) return false
  problems.push(`${key} ("${raw}") is not a boolean — use true or false`)
  return fallback
}

/** Frozen so no module can rewrite config after startup. */
export const env = Object.freeze({
  appName: readString('VITE_APP_NAME', 'Machine Coding Playground'),
  apiBaseUrl: readUrl('VITE_API_BASE_URL', 'https://jsonplaceholder.typicode.com'),
  enableAnalytics: readBoolean('VITE_ENABLE_ANALYTICS', false),
  mode: RAW.MODE,
  isDev: RAW.DEV,
})

export const envProblems = Object.freeze([...problems])

/**
 * Keys without the VITE_ prefix are stripped from the client bundle entirely,
 * so this is always `undefined` in the browser. That is the guarantee Vite
 * gives you, and the UI shows it rather than just claiming it.
 */
export const serverOnlySecret = RAW.SECRET_API_TOKEN

if (envProblems.length > 0) {
  console.error(
    `[env] ${envProblems.length} problem(s) in .env:\n  - ${envProblems.join('\n  - ')}`,
  )
}
