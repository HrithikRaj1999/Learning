import os from "node:os";
import express from "express";
import { Scheduler } from "./scheduler.js";
import { heavy_task1, heavy_task2, heavy_task3 } from "./heavy_tasks.js";


//os_cores gives info the most tasks that can run at the same time.
const os_cores = Math.max(1, os.cpus().length - 1);
const scheduler = new Scheduler(os_cores);
const app = express();

// Instant reply: proves the event loop is free.
app.get("/health", (req, res) => {
  res.send("ok\n");
});

// Runs all 3 heavy tasks in parallel on the pool: server stays responsive.
app.get("/worker/all", async (req, res) => {
  const t0 = Date.now();
  const [r1, r2, r3] = await Promise.all([
    scheduler.run(heavy_task1),
    scheduler.run(heavy_task2),
    scheduler.run(heavy_task3),
  ]);
  res.send(`worker -> ${r1}, ${r2}, ${r3} (${Date.now() - t0}ms)\n`);
});

// Runs all 3 heavy tasks one after another on the main thread: server freezes until done.
app.get("/main/all", (req, res) => {
  const t0 = Date.now();
  const r1 = heavy_task1();
  const r2 = heavy_task2();
  const r3 = heavy_task3();
  res.send(`main -> ${r1}, ${r2}, ${r3} (${Date.now() - t0}ms)\n`);
});

app.listen(3000, () => console.log("server on http://localhost:3000"));
