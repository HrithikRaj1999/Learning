const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Todo = require("./models/Todo");

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/tododb";

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/todos", async (_req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const text = String(req.body.text || "").trim();
  if (!text) {
    return res.status(400).json({ message: "text is required" });
  }

  const todo = await Todo.create({ text });
  return res.status(201).json(todo);
});

app.put("/api/todos/:id/toggle", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return res.status(404).json({ message: "todo not found" });
  }

  todo.done = !todo.done;
  await todo.save();
  return res.json(todo);
});

app.delete("/api/todos/:id", async (req, res) => {
  const deleted = await Todo.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "todo not found" });
  }

  return res.status(204).send();
});

async function start() {
  try {
    await mongoose.connect(mongoUri);
    app.listen(port, () => {
      console.log(`backend listening on ${port}`);
    });
  } catch (error) {
    console.error("failed to start backend", error.message);
    process.exit(1);
  }
}

start();
