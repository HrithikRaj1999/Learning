# 02 — State Management & Hooks Deep Dive

## What You'll Master
- useState mechanics and batching
- useReducer for complex state
- useRef (DOM refs + mutable containers)
- Stale closure problem and solutions
- State update patterns (functional updates)
- Derived state vs stored state

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Implement a useReducer-based shopping cart | Amazon, Flipkart | Medium |
| 2 | Fix a stale closure bug in a timer component | Google, Microsoft | Hard |
| 3 | Build a counter with undo/redo using state history | Atlassian, Notion | Hard |
| 4 | Create a form with useReducer handling all field states | Stripe, Razorpay | Medium |
| 5 | Implement useState from scratch (simplified) | Meta, Uber | Hard |

## Key Concepts
- **Batching**: React 18 auto-batches all state updates (even in setTimeout/promises)
- **Functional updates**: `setState(prev => prev + 1)` avoids stale closures
- **useRef vs useState**: Ref changes don't trigger re-renders
- **Derived state anti-pattern**: Don't useState for computed values

## Common Pitfalls
```jsx
// ❌ Stale closure
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1); // always uses initial count
  }, 1000);
  return () => clearInterval(id);
}, []);

// ✅ Functional update
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);
```

## Run Code
```bash
cd playground && npm run dev
```
