# 03 — useEffect & Lifecycle Patterns

## What You'll Master
- Effect execution timing and cleanup
- Dependency array mechanics
- Race conditions in async effects
- AbortController for fetch cleanup
- Sync effects vs layout effects (useLayoutEffect)
- Effect event pattern (React 19)

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Fix infinite re-render loop in useEffect | Google, Amazon, Meta | Medium |
| 2 | Implement data fetching with race condition handling | Netflix, Uber | Hard |
| 3 | Build a resize/scroll listener with proper cleanup | Microsoft, Atlassian | Medium |
| 4 | Create a debounced search with AbortController | Flipkart, Swiggy | Hard |
| 5 | Explain why this effect runs twice in StrictMode | All companies | Medium |

## Key Concepts
- **Effects are synchronization**: They sync React state with external systems
- **Cleanup runs before re-run**: Previous effect cleans up before next one fires
- **StrictMode double-fire**: React mounts → unmounts → mounts to find bugs
- **Empty deps `[]`**: Runs once on mount, cleanup on unmount

## Race Condition Pattern
```jsx
useEffect(() => {
  let cancelled = false;
  
  async function fetchData() {
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    if (!cancelled) {
      setResults(data);
    }
  }
  
  fetchData();
  return () => { cancelled = true; };
}, [query]);
```

## AbortController Pattern
```jsx
useEffect(() => {
  const controller = new AbortController();
  
  fetch(`/api/data`, { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') throw err;
    });
  
  return () => controller.abort();
}, [id]);
```
