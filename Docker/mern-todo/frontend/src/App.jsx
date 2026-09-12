import React, { useEffect, useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTodos() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/todos");
      if (!response.ok) {
        throw new Error(`failed to load todos (${response.status})`);
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function addTodo(event) {
    event.preventDefault();
    const value = text.trim();
    if (!value) {
      return;
    }

    setError("");
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value }),
    });

    if (!response.ok) {
      setError("failed to create todo");
      return;
    }

    setText("");
    await loadTodos();
  }

  async function toggleTodo(id) {
    const response = await fetch(`/api/todos/${id}/toggle`, { method: "PUT" });
    if (!response.ok) {
      setError("failed to update todo");
      return;
    }
    await loadTodos();
  }

  async function deleteTodo(id) {
    const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (!response.ok && response.status !== 204) {
      setError("failed to delete todo");
      return;
    }
    await loadTodos();
  }

  return (
    <main className="page">
      <section className="card">
        <h1>MERN Todo Lab</h1>
        <p>Local Kubernetes-ready Todo app for failure drills.</p>

        <form onSubmit={addTodo} className="todo-form">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Add a task"
            maxLength={200}
          />
          <button type="submit">Add</button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id} className={todo.done ? "done" : ""}>
              <button onClick={() => toggleTodo(todo._id)} className="text-btn" type="button">
                {todo.text}
              </button>
              <button onClick={() => deleteTodo(todo._id)} type="button" className="delete-btn">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
