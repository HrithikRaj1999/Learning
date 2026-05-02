# 11 — Data Fetching & Caching

## What You'll Master
- Fetch patterns in React (useEffect, libraries)
- React Query / TanStack Query
- SWR (stale-while-revalidate)
- Optimistic updates
- Pagination & infinite queries
- Prefetching and background refetch

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Implement infinite scroll with intersection observer | Flipkart, Instagram | Hard |
| 2 | Build a useFetch hook with caching (simplified SWR) | Google, Amazon | Hard |
| 3 | Implement optimistic update for a like button | Meta, Netflix | Medium |
| 4 | Handle race conditions in parallel fetches | Microsoft, Uber | Hard |
| 5 | Build pagination with prefetching next page | Flipkart, Swiggy | Medium |
| 6 | Implement retry logic with exponential backoff | Stripe, Amazon | Medium |

## Key Concepts
- **Stale-while-revalidate**: Show cached data immediately, refetch in background
- **Query keys**: Identity of cached data (determines when to refetch)
- **Optimistic updates**: Update UI before server confirms
- **Background refetch**: Keep data fresh without loading spinners

## Simplified SWR Pattern
```jsx
const cache = new Map();

function useFetch(url) {
  const [data, setData] = useState(cache.get(url) || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!cache.has(url));
  
  useEffect(() => {
    let cancelled = false;
    
    // Show stale, fetch fresh
    if (!cache.has(url)) setLoading(true);
    
    fetch(url)
      .then(res => res.json())
      .then(freshData => {
        if (!cancelled) {
          cache.set(url, freshData);
          setData(freshData);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });
    
    return () => { cancelled = true; };
  }, [url]);
  
  return { data, error, loading };
}
```

## Infinite Scroll Pattern
```jsx
function useInfiniteScroll(fetchFn) {
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  
  const lastElementRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [hasMore]);
  
  useEffect(() => {
    fetchFn(page).then(newItems => {
      setPages(prev => [...prev, ...newItems]);
      if (newItems.length === 0) setHasMore(false);
    });
  }, [page]);
  
  return { items: pages, lastElementRef, hasMore };
}
```
