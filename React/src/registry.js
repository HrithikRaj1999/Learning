/**
 * Exercise auto-discovery.
 *
 * Every folder under `src/machine-coding/` that contains a `main.jsx` with a
 * default-exported component shows up in the sidebar automatically. There is
 * no list to maintain — drop in a folder and it is there on the next reload.
 *
 * Optional in each `main.jsx`:
 *   export const meta = { title: 'Fetch API Card', brief: 'one-line summary' }
 */

const modules = import.meta.glob('./machine-coding/*/main.jsx', { eager: true })

const folderNameOf = (path) => path.split('/').at(-2)

/** "FetchApiCard" -> "Fetch Api Card", used when meta.title is absent. */
const humanise = (name) =>
  name.replace(/[-_]/g, ' ').replace(/([a-z\d])([A-Z])/g, '$1 $2')

const discovered = Object.entries(modules).map(([path, mod]) => ({
  path,
  id: folderNameOf(path),
  mod,
}))

const invalid = discovered.filter(({ mod }) => typeof mod.default !== 'function')

if (invalid.length > 0) {
  console.error(
    `[registry] Skipped ${invalid.length} exercise(s) with no default-exported ` +
      `component:\n  - ${invalid.map((e) => e.path).join('\n  - ')}`,
  )
}

export const exercises = discovered
  .filter(({ mod }) => typeof mod.default === 'function')
  .map(({ id, mod }) => ({
    id,
    title: mod.meta?.title ?? humanise(id),
    brief: mod.meta?.brief ?? '',
    Component: mod.default,
  }))
  .sort((a, b) => a.title.localeCompare(b.title))
