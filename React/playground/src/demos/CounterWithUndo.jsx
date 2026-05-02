import { useState } from 'react';

function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState]);
  const [pointer, setPointer] = useState(0);

  const state = history[pointer];

  function setState(newState) {
    const newHistory = history.slice(0, pointer + 1);
    const value = typeof newState === 'function' ? newState(state) : newState;
    newHistory.push(value);
    setHistory(newHistory);
    setPointer(newHistory.length - 1);
  }

  function undo() {
    if (pointer > 0) setPointer(pointer - 1);
  }

  function redo() {
    if (pointer < history.length - 1) setPointer(pointer + 1);
  }

  return {
    state,
    setState,
    undo,
    redo,
    canUndo: pointer > 0,
    canRedo: pointer < history.length - 1,
  };
}

export function CounterWithUndo() {
  const { state: count, setState: setCount, undo, redo, canUndo, canRedo } = useUndoRedo(0);

  return (
    <div>
      <h3>Counter with Undo/Redo</h3>
      <p style={{ fontSize: '2rem', margin: '1rem 0' }}>{count}</p>
      <div>
        <button onClick={() => setCount(prev => prev + 1)}>+1</button>
        <button onClick={() => setCount(prev => prev - 1)}>-1</button>
        <button onClick={() => setCount(prev => prev * 2)}>×2</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={undo} disabled={!canUndo}>⟵ Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo ⟶</button>
      </div>
      <p className="hint">Try: increment a few times, then undo/redo</p>
    </div>
  );
}
