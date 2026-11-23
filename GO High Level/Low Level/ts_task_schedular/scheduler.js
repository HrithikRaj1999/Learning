import { Worker } from "node:worker_threads";

export class Scheduler {
  constructor(size) {
    this.idle_worker_threads = [];
    this.task_queue = [];
    for (let i = 0; i < size; i++) {
      // by default add n size worker in idle queue to pick the job
      // to run parallely
      this.idle_worker_threads.push(this.creates_new_worker());
    }
  }

  creates_new_worker() {
    const w = new Worker(new URL("./worker.js", import.meta.url)); // worker.js next to this file
    w.on("message", (result) => this.finish(w, null, result));
    w.on("error", (err) => this.finish(w, err));
    return w;
  }

  // Returns a promise right away; never waits on other tasks.
  run(fn) {
    return new Promise((resolve, reject) => {
      this.task_queue.push({ fn, resolve, reject });
      this.next();
    });
  }

  next() {
    while (this.idle_worker_threads.length && this.task_queue.length) {
      const w = this.idle_worker_threads.pop();
      w.task = this.task_queue.shift();
      w.postMessage(w.task.fn.name);
    }
  }

  finish(w, err, result) {
    const { resolve, reject } = w.task;
    //reseting to null as work has been done
    w.task = null;
    if (err) {
      reject(err);
      w = this.creates_new_worker(); // crashed worker is dead, replace it
    } else {
      resolve(result);
    }
    this.idle_worker_threads.push(w);
    this.next();
  }
}
