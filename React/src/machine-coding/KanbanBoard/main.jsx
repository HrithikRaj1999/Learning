import { AddTaskForm } from './components/AddTaskForm.jsx'
import { Column } from './components/Column.jsx'
import { useKanban } from './hooks/useKanban.js'
import styles from './main.module.css'

export const meta = {
  title: 'Kanban Board',
  brief: 'Add tasks and drag them between columns',
}

/* ONE flat list of tasks, each carrying a status.
   A column = tasks filtered by status. Dragging = changing that status. */

const INITIAL_TASKS = [
  { id: 1, text: 'Read the question', status: 'Todo' },
  { id: 2, text: 'Write the state shape', status: 'In Progress' },
  { id: 3, text: 'Say the tradeoffs out loud', status: 'Done' },
]

export default function KanbanBoard() {
  const board = useKanban(INITIAL_TASKS)

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Kanban Board</h1>

      <AddTaskForm onAdd={board.handleAdd} />

      <div className={styles.board}>
        {board.columns.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={board.tasks}
            onDragStart={board.setDraggedId}
            onDrop={board.handleDrop}
            onDelete={board.handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
