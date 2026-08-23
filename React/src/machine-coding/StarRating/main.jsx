import { Stars } from './components/Stars.jsx'
import { useRating } from './hooks/useRating.js'
import styles from './main.module.css'

export const meta = {
  title: 'Star Rating',
  brief: 'Hover preview, keyboard, a11y roles',
}

const LABELS = ['Not rated', 'Awful', 'Poor', 'Fine', 'Good', 'Excellent']

export default function StarRating() {
  const rating = useRating({ max: 5 })

  return (
    /* Deliberately a completely different visual language to FetchApiCard —
       neo-brutalist, heavy borders, no shared tokens. Proof that one exercise's
       styling has no reach into another's. */
    <div className={styles.root}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Exercise 02</p>
        <h1 className={styles.title}>Star Rating</h1>
        <p className={styles.lede}>
          Same class names as exercise 01 (<code>.root</code>, <code>.card</code>
          , <code>.grid</code>, <code>.title</code>) and a totally different
          look. Nothing bleeds either way.
        </p>
      </header>

      <div className={styles.card}>
        <Stars
          max={rating.max}
          shown={rating.shown}
          onRate={rating.rate}
          onPreview={rating.preview}
          onClearPreview={rating.clearPreview}
        />

        <output className={styles.readout}>
          <span className={styles.score}>
            {rating.shown}
            <span className={styles.outOf}>/{rating.max}</span>
          </span>
          <span className={styles.label}>
            {LABELS[rating.shown]}
            {rating.isPreviewing && <em className={styles.hint}> — preview</em>}
          </span>
        </output>
      </div>

      <button type="button" className={styles.reset} onClick={rating.reset}>
        Reset
      </button>
    </div>
  )
}
