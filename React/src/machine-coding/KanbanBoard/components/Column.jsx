import { TaskCard } from "./TaskCard.jsx";
import styles from "./Column.module.css";

export function Column({ status, tasks, onDragStart, onDrop, onDelete }) {
  return (
    <section
      className={styles.column}
      // A browser does not let you drop anything anywhere by default.
      // This line says: dropping IS allowed on this column.
      // Remove it and onDrop below will never run.
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(status)}
    >
      <h2 className={styles.columnTitle}>{status}</h2>

      {tasks
        .filter((t) => t.status === status)
        .map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onDelete={onDelete}
          />
        ))}
    </section>
  );
}
