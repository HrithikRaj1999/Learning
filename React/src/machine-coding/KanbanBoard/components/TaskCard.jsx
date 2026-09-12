import styles from "./TaskCard.module.css";

export function TaskCard({ task, onDragStart, onDelete }) {
  return (
    <article //content inside is independent, self-contained, and reusable
      className={styles.card}
      draggable
      onDragStart={() => onDragStart(task.id)}
    >
      {task.text}
      <button className={styles.remove} onClick={() => onDelete(task.id)}>
        ×
      </button>
    </article>
  );
}
