import styles from './Controls.module.css'

export function Controls({ isRunning, onStart, onStop, onReset }) {
  return (
    <div className={styles.row}>
      <button
        className={`${styles.button} ${isRunning ? styles.stop : styles.start}`}
        onClick={isRunning ? onStop : onStart}
      >
        {isRunning ? 'Stop' : 'Start'}
      </button>

      <button className={styles.button} onClick={onReset}>
        Reset
      </button>
    </div>
  )
}
