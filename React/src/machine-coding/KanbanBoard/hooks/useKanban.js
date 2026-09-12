import { useState } from "react";

export const COLUMNS = ["Todo", "In Progress", "Done"];

export function useKanban(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedId, setDraggedId] = useState(null);

  const handleAdd = (text) => {
    const title = text.trim();
    if (!title) return;
    // new task will always colunms
    setTasks([...tasks, { id: Date.now(), text: title, status: COLUMNS[0] }]);
  };

  const handleDelete = (id) => setTasks(tasks.filter((t) => t.id !== id));

  // dropping on a column = giving the dragged task that column's status
  const handleDrop = (status) => {
    setTasks(tasks.map((t) => (t.id === draggedId ? { ...t, status } : t)));
  };

  return {
    columns: COLUMNS,
    tasks,
    setDraggedId,
    handleAdd,
    handleDelete,
    handleDrop,
  };
}
