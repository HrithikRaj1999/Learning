# Machine Coding Playground

React 19 + Vite 8, plain JavaScript. A shell that auto-discovers self-contained
practice problems, so a round starts by making a folder and nothing else.

```bash
npm install
cp .env.example .env   # already done here
npm run dev
```

## Adding a round

Create `src/machine-coding/<YourProblem>/main.jsx` with a default-exported
component. It appears in the sidebar on save — there is no registry to edit.

```
src/machine-coding/YourProblem/
├── main.jsx          ← entry: default export + optional `meta`
├── main.module.css   ← this round's tokens and root layout
├── components/
│   ├── Thing.jsx
│   └── Thing.module.css
└── hooks/
    └── useThing.js
```

```jsx
export const meta = { title: 'Your Problem', brief: 'shows in the sidebar' }

export default function YourProblem() {
  return <div className={styles.root}>…</div>
}
```

Anything without a default-exported component is skipped and named in the
console, so a half-written folder never breaks the app.

## Why nothing collides

Each folder is the source of truth for its own round:

- **Styles are CSS Modules.** `.card` in two different rounds compiles to two
  different hashed classes (`YourProblem-Card-card__k3Lp9`). Collision is not
  possible, so you can name things whatever is fastest.
- **`src/reset.css` is the only global stylesheet** and is deliberately
  structural — box-sizing, margin reset, media defaults. No colours, no
  spacing, nothing that reaches into a round and changes how it looks.
- **Tokens are declared on each round's `.root`**, not on `:root`, with a
  per-round prefix (`--fac-`, `--sr-`). The shell's own tokens use `--mc-`.
- **Each `.root` sets its own `font-family` and `color`** rather than
  inheriting, so the shell cannot influence typography.
- **The stage is `isolation: isolate`**, giving each round its own stacking
  context. There is intentionally no `contain: paint`, which would clip modals
  and dropdowns a round legitimately needs to overflow.

The **Focus** button hides the shell chrome entirely when you want the round
full-bleed.

## Environment

`.env` is gitignored; `.env.example` is the committed template. Only
`VITE_`-prefixed keys reach the browser — `SECRET_API_TOKEN` has no prefix and
reads as `undefined` in the client, which the sidebar shows live.

`src/lib/env.js` is the only module that touches `import.meta.env`. It
validates on startup and renders a banner listing anything malformed instead of
failing with a blank page.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server with fast refresh |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built output |
| `npm run lint` | oxlint |

## File extensions

Files containing JSX must be `.jsx`; plain modules (hooks, helpers) stay `.js`.
Vite 8's Rolldown pipeline picks its parser from the extension and excludes
`.js` from the JSX transform, with no config override exposed.
