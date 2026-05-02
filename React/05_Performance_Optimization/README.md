# 05 — Performance Optimization

## What You'll Master
- React re-render mechanics
- React.memo and when to use it
- useMemo vs useCallback
- Code splitting with React.lazy
- Virtualization for large lists
- React DevTools Profiler

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Optimize a list that re-renders all items on parent state change | Google, Meta | Medium |
| 2 | Implement virtualized list rendering (only visible items) | Amazon, Flipkart | Hard |
| 3 | Fix unnecessary re-renders in a Context consumer | Microsoft, Netflix | Hard |
| 4 | Profile and fix a slow component tree | Atlassian, Uber | Medium |
| 5 | Implement windowing for 10,000 rows without libraries | Google, Stripe | Hard |
| 6 | When does React.memo hurt performance? | Meta, Vercel | Medium |

## Key Concepts
- **Re-render ≠ DOM update**: React re-renders → diffs VDOM → patches real DOM
- **Parent re-render → all children re-render** (unless memoized)
- **React.memo**: Shallow comparison of props — skips re-render if same
- **useMemo**: Caches expensive computation results
- **useCallback**: Caches function identity (for memo'd children)

## When NOT to Optimize
- Small component trees (< 50 components)
- Infrequent updates (user click handlers)
- When the memoization cost > re-render cost

## Virtual List Pattern
```jsx
function VirtualList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, i) => (
            <div key={startIndex + i} style={{ height: itemHeight }}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```
