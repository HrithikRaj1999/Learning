import { Controls } from "./components/Controls.jsx";
import { TimeDisplay } from "./components/TimeDisplay.jsx";
import { useStopwatch } from "./hooks/useStopwatch.js";
import styles from "./main.module.css";

export const meta = {
  title: "Stopwatch",
  brief: "Start, stop and reset a running timer",
};

export default function Stopwatch() {
  const timer = useStopwatch();

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Stopwatch</h1>

      <TimeDisplay elapsed={timer.elapsed} />

      <Controls
        isRunning={timer.isRunning}
        onStart={timer.handleStart}
        onStop={timer.handleStop}
        onReset={timer.handleReset}
      />
    </div>
  );
}
