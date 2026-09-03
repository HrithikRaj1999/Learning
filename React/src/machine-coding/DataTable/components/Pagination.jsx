import styles from './Pagination.module.css'

export function Pagination({ page, lastPage, from, to, total, onChange }) {
  return (
    <nav className={styles.bar}>
      <p className={styles.count}>
        Showing <strong>{from}–{to}</strong> of {total}
      </p>

      <div className={styles.buttons}>
        <button
          className={styles.button}
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          Prev
        </button>

        <span className={styles.page}>
          {page} / {lastPage}
        </span>

        <button
          className={styles.button}
          disabled={page === lastPage}
          onClick={() => onChange(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  )
}
