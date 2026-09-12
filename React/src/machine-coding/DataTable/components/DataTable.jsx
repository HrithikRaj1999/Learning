import styles from './DataTable.module.css'

export function DataTable({ columns, rows, sortKey, isAsc, onSort }) {
  return (
    <div className={styles.frame}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = col.key === sortKey

              return (
                <th
                  key={col.key}
                  className={col.numeric ? styles.numeric : undefined}
                  // screen readers announce the sort state from this
                  aria-sort={isSorted ? (isAsc ? 'ascending' : 'descending') : 'none'}
                >
                  <button
                    className={isSorted ? styles.sortedHead : styles.head}
                    onClick={() => onSort(col.key)}
                  >
                    {col.label}
                    <span className={styles.arrow}>
                      {!isSorted ? '↕' : isAsc ? '↑' : '↓'}
                    </span>
                  </button>
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className={styles.strong}>{row.title}</td>
              <td>
                <span className={styles.tag}>{row.category}</span>
              </td>
              <td className={styles.numeric}>${row.price.toFixed(2)}</td>
              <td className={styles.numeric}>{row.rating}</td>
              <td className={styles.numeric}>{row.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
