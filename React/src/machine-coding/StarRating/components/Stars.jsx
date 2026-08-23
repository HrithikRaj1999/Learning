import styles from './Stars.module.css'

/* Note the class names below: `.card`, `.grid`, `.title` are the *same* names
   FetchApiCard uses. CSS Modules hash them per file, so the two exercises
   cannot reach each other no matter what they call things. */

export function Stars({ max, shown, onRate, onPreview, onClearPreview }) {
  return (
    <div className={styles.card} onMouseLeave={onClearPreview}>
      <div className={styles.grid} role="radiogroup" aria-label="Rating">
        {Array.from({ length: max }, (_, index) => {
          const score = index + 1
          const isLit = score <= shown
          return (
            <button
              key={score}
              type="button"
              role="radio"
              aria-checked={isLit}
              aria-label={`${score} of ${max}`}
              className={isLit ? `${styles.star} ${styles.lit}` : styles.star}
              onClick={() => onRate(score)}
              onMouseEnter={() => onPreview(score)}
              onFocus={() => onPreview(score)}
              onBlur={onClearPreview}
            >
              ★
            </button>
          )
        })}
      </div>
    </div>
  )
}
