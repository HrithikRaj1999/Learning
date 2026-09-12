import { useEffect, useState } from "react";

export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0); // milliseconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1);
    return () => clearInterval(id);
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setElapsed(0);
  };

  return { elapsed, isRunning, handleStart, handleStop, handleReset };
}
