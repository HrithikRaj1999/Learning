# 16 — Machine Coding Round: Logic Heavy

> **Format**: 45–90 min. Tests algorithmic thinking + React integration. Most differentiating round.

## Most Asked Logic-Heavy Questions

| # | Problem | Asked At | Core Logic | Difficulty |
|---|---------|----------|-----------|-----------|
| 1 | Debounce/Throttle Implementation | Google, Meta, Amazon | Timer management, closure | Medium |
| 2 | Undo/Redo System | Notion, Atlassian, Google | Command pattern, stack | Hard |
| 3 | Virtual Scroll (Fixed Height) | Amazon, Flipkart, Google | Viewport math, scroll offset | Hard |
| 4 | Virtual Scroll (Variable Height) | Google, Meta | Height estimation, binary search | Expert |
| 5 | Drag and Drop (Custom) | Atlassian, Notion | Mouse events, coordinates, reorder | Hard |
| 6 | Spreadsheet/Grid | Google Sheets, Microsoft | Cell reference, formula parser | Expert |
| 7 | Traffic Light State Machine | Amazon, Uber | State transitions, timers | Medium |
| 8 | Promise Pool / Concurrency Limiter | Stripe, Google | Queue, promise resolution | Hard |
| 9 | Event Emitter in React | All companies | Pub/sub, cleanup, hook integration | Medium |
| 10 | Deep Object Comparison (React-specific) | Meta, Google | Recursive equality, memo | Medium |
| 11 | Retry with Backoff (Hook) | Amazon, Netflix | Exponential delay, max retries | Medium |
| 12 | Flatten/Normalize Nested Data | Meta, Atlassian | Recursion, normalization | Medium |
| 13 | Rate Limiter (UI) | Stripe, Razorpay | Token bucket, time window | Hard |
| 14 | Memoize Function (Generic) | Google, Meta | Cache, key generation | Medium |
| 15 | Build a Scheduler (setTimeout polyfill) | Amazon, Microsoft | Priority queue, time management | Hard |
| 16 | Implement React.memo from scratch | Meta, Google | Shallow compare, closure | Hard |
| 17 | Dependency Graph (useEffect order) | Vercel, Meta | Topological sort, DAG | Expert |
| 18 | Implement useSyncExternalStore (simplified) | Meta, Vercel | Subscribe, snapshot, server | Hard |
| 19 | LRU Cache Hook | Amazon, Google | Doubly-linked list, Map | Hard |
| 20 | Build useQuery from scratch | All companies | Cache, refetch, stale time | Hard |

## Implementation: Undo/Redo
```jsx
function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState]);
  const [pointer, setPointer] = useState(0);
  
  const state = history[pointer];
  
  function setState(newState) {
    const newHistory = history.slice(0, pointer + 1);
    newHistory.push(typeof newState === 'function' ? newState(state) : newState);
    setHistory(newHistory);
    setPointer(newHistory.length - 1);
  }
  
  function undo() {
    if (pointer > 0) setPointer(pointer - 1);
  }
  
  function redo() {
    if (pointer < history.length - 1) setPointer(pointer + 1);
  }
  
  return { state, setState, undo, redo, canUndo: pointer > 0, canRedo: pointer < history.length - 1 };
}
```

## Implementation: Promise Pool
```jsx
async function promisePool(tasks, concurrency) {
  const results = [];
  let index = 0;
  
  async function worker() {
    while (index < tasks.length) {
      const currentIndex = index++;
      results[currentIndex] = await tasks[currentIndex]();
    }
  }
  
  const workers = Array(Math.min(concurrency, tasks.length))
    .fill(null)
    .map(() => worker());
  
  await Promise.all(workers);
  return results;
}

// As a hook
function usePromisePool(tasks, concurrency) {
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let cancelled = false;
    
    async function run() {
      const output = [];
      let index = 0;
      let completed = 0;
      
      async function worker() {
        while (index < tasks.length) {
          const i = index++;
          output[i] = await tasks[i]();
          completed++;
          if (!cancelled) setProgress(completed / tasks.length);
        }
      }
      
      await Promise.all(
        Array(Math.min(concurrency, tasks.length)).fill(null).map(worker)
      );
      
      if (!cancelled) setResults(output);
    }
    
    run();
    return () => { cancelled = true; };
  }, [tasks, concurrency]);
  
  return { results, progress };
}
```

## Implementation: LRU Cache Hook
```jsx
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value); // Move to end (most recent)
    return value;
  }
  
  set(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

function useLRUCache(capacity = 50) {
  const cacheRef = useRef(new LRUCache(capacity));
  
  return {
    get: useCallback((key) => cacheRef.current.get(key), []),
    set: useCallback((key, value) => cacheRef.current.set(key, value), []),
  };
}
```
