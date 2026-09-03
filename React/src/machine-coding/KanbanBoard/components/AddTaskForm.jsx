import { useState } from 'react'

import styles from "./AddTaskForm.module.css"

export function AddTaskForm({ onAdd }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault() // stop the page reloading
    onAdd(text)
    setText('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={text}
        placeholder="New task..."
        onChange={(e) => setText(e.target.value)}
      />
      <button className={styles.add}>Add</button>
    </form>
  )
}
