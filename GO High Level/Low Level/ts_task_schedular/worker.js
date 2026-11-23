import { parentPort } from "node:worker_threads";
import * as heavy_tasks from "./heavy_tasks.js";

parentPort.on("message", (name) => {
  const result = heavy_tasks[name]();
  parentPort.postMessage(result);
});
