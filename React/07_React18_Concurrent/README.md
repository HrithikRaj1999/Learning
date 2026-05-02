# 07 — React 18 Concurrent Features

## What You'll Master
- Automatic batching
- useTransition for non-urgent updates
- useDeferredValue for deferred rendering
- Suspense for data fetching
- Streaming SSR with renderToPipeableStream
- Selective hydration

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Use useTransition to keep UI responsive during expensive filter | Google, Meta | Medium |
| 2 | Implement search with useDeferredValue (instant input, deferred results) | Netflix, Amazon | Medium |
| 3 | Build a Suspense boundary with fallback and error boundary | Vercel, Shopify | Medium |
| 4 | Explain automatic batching — what changed from React 17? | All companies | Easy |
| 5 | When would you use useTransition vs useDeferredValue? | Meta, Google | Hard |
| 6 | Implement streaming SSR concept with Suspense | Vercel, Netflix | Hard |

## Key Concepts
- **Concurrent rendering**: React can pause/resume/abandon renders
- **useTransition**: Marks state update as non-urgent; UI stays responsive
- **useDeferredValue**: Shows stale value while new one computes
- **Suspense**: Declarative loading states — component "suspends" while waiting

## useTransition Example
```jsx
function FilteredList({ items }) {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [filteredItems, setFilteredItems] = useState(items);
  
  function handleChange(e) {
    setQuery(e.target.value); // urgent: update input immediately
    
    startTransition(() => {
      // non-urgent: filter can be deferred
      setFilteredItems(
        items.filter(item => item.name.includes(e.target.value))
      );
    });
  }
  
  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <List items={filteredItems} />
    </>
  );
}
```

## Suspense + Error Boundary
```jsx
<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Skeleton />}>
    <UserProfile userId={id} />
  </Suspense>
</ErrorBoundary>
```
