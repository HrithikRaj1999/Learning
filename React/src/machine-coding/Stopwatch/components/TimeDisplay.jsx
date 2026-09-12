import styles from './TimeDisplay.module.css'

/* 83_420 ms -> "01:23.42" */
const format = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor(ms / 1000) % 60
  const hundredths = Math.floor(ms / 10) % 100
  const pad = (n) => String(n).padStart(2, '0')

  return `${pad(minutes)}:${pad(seconds)}.${pad(hundredths)}`
}

export function TimeDisplay({ elapsed }) {
  return <p className={styles.time}>{format(elapsed)}</p>
}
