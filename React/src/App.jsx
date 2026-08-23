import { Component, useCallback, useEffect, useMemo, useState } from 'react'

import styles from './App.module.css'
import { env, envProblems, serverOnlySecret } from './lib/env.js'
import { exercises } from './registry.js'

/* -- shell routing ---------------------------------------------------------
   The active exercise lives in the URL hash, so a refresh keeps your place
   and you can bookmark or share a single problem. ------------------------- */

const readHashId = () =>
  decodeURIComponent(window.location.hash.replace(/^#\/?/, ''))

function useHashId(fallbackId) {
  const [id, setId] = useState(() => readHashId() || fallbackId)

  useEffect(() => {
    const sync = () => setId(readHashId() || fallbackId)
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [fallbackId])

  const select = useCallback((nextId) => {
    window.location.hash = `/${nextId}`
  }, [])

  return [id, select]
}

/* -- shell ---------------------------------------------------------------- */

export default function App() {
  const fallbackId = exercises[0]?.id ?? ''
  const [activeId, select] = useHashId(fallbackId)
  const [isFocused, setIsFocused] = useState(false)

  const active = useMemo(
    () => exercises.find((item) => item.id === activeId) ?? exercises[0],
    [activeId],
  )

  useEffect(() => {
    document.title = active ? `${active.title} — ${env.appName}` : env.appName
  }, [active])

  return (
    <div className={styles.shell} data-focused={isFocused || undefined}>
      {!isFocused && (
        <aside className={styles.rail}>
          <header className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true" />
            <span className={styles.brandName}>{env.appName}</span>
          </header>

          <nav className={styles.nav} aria-label="Exercises">
            <p className={styles.railLabel}>
              Problems<span className={styles.count}>{exercises.length}</span>
            </p>
            <ul className={styles.list}>
              {exercises.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={styles.item}
                    aria-current={item.id === active?.id ? 'page' : undefined}
                    onClick={() => select(item.id)}
                  >
                    <span className={styles.itemIndex}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.itemBody}>
                      <span className={styles.itemTitle}>{item.title}</span>
                      {item.brief && (
                        <span className={styles.itemBrief}>{item.brief}</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <EnvStrip />
        </aside>
      )}

      <main className={styles.stage}>
        <button
          type="button"
          className={styles.focusToggle}
          onClick={() => setIsFocused((on) => !on)}
        >
          {isFocused ? 'Show list' : 'Focus'}
        </button>

        {envProblems.length > 0 && <EnvBanner problems={envProblems} />}

        {active ? (
          /* `key` remounts the boundary and the exercise together on switch, so
             each round starts from a clean slate — and a crash inside one round
             is contained instead of blanking the whole playground. */
          <ExerciseBoundary key={active.id} title={active.title}>
            <active.Component />
          </ExerciseBoundary>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  )
}

/* -- shell pieces --------------------------------------------------------- */

/**
 * Keeps a broken round local to its own pane. Without this, one typo in one
 * exercise renders the entire app as a blank page with only a console message.
 */
class ExerciseBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error(`[exercise] ${this.props.title} crashed`, error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className={styles.crash} role="alert">
        <p className={styles.crashLabel}>{this.props.title} crashed</p>
        <pre className={styles.crashMessage}>{this.state.error.message}</pre>
        <p className={styles.crashHint}>
          Full stack is in the console. Fix the file and it hot-reloads.
        </p>
      </div>
    )
  }
}

function EnvStrip() {
  return (
    <footer className={styles.env}>
      <p className={styles.railLabel}>Environment</p>
      <dl className={styles.envList}>
        <div className={styles.envRow}>
          <dt>MODE</dt>
          <dd>{env.mode}</dd>
        </div>
        <div className={styles.envRow}>
          <dt>API</dt>
          <dd title={env.apiBaseUrl}>{env.apiBaseUrl.replace(/^https?:\/\//, '')}</dd>
        </div>
        <div className={styles.envRow}>
          <dt>ANALYTICS</dt>
          <dd>{String(env.enableAnalytics)}</dd>
        </div>
      </dl>
      <p className={styles.envProof}>
        <code>SECRET_API_TOKEN</code> is <b>{String(serverOnlySecret)}</b> — no{' '}
        <code>VITE_</code> prefix, so it never reaches the bundle.
      </p>
    </footer>
  )
}

function EnvBanner({ problems }) {
  return (
    <div className={styles.banner} role="alert">
      <b>Check your .env</b>
      <ul>
        {problems.map((problem) => (
          <li key={problem}>{problem}</li>
        ))}
      </ul>
    </div>
  )
}

function EmptyState() {
  return (
    <div className={styles.empty}>
      <h1>No exercises yet</h1>
      <p>
        Create <code>src/machine-coding/YourProblem/main.jsx</code> with a
        default-exported component. It appears here on save — no wiring needed.
      </p>
    </div>
  )
}
