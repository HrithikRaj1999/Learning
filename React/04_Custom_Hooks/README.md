# 04 — Custom Hooks & Logic Extraction

## What You'll Master
- Extracting reusable logic into hooks
- Hook composition patterns
- Rules of hooks and why they exist
- Testing custom hooks
- Hook factories and parameterized hooks
- Popular hook patterns from the ecosystem

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Build `useDebounce(value, delay)` | Flipkart, Swiggy, Google | Medium |
| 2 | Build `useLocalStorage(key, initialValue)` | Amazon, Microsoft | Medium |
| 3 | Build `useFetch(url)` with loading/error/data | Meta, Netflix | Medium |
| 4 | Build `usePrevious(value)` | Uber, Atlassian | Easy |
| 5 | Build `useIntersectionObserver` for lazy loading | Flipkart, PhonePe | Hard |
| 6 | Build `useThrottle(callback, delay)` | Razorpay, Google | Medium |
| 7 | Build `useClickOutside(ref, handler)` | Stripe, Notion | Medium |
| 8 | Build `useMediaQuery(query)` | Shopify, Vercel | Medium |

## Key Concepts
- **Hooks are just functions** that call other hooks
- **Naming convention**: Always prefix with `use`
- **Composition**: Complex hooks built from simple ones
- **Testing**: Use `renderHook` from Testing Library

## Pattern: Hook with Cleanup
```jsx
function useEventListener(event, handler, element = window) {
  const savedHandler = useRef(handler);
  
  useLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  
  useEffect(() => {
    const listener = (e) => savedHandler.current(e);
    element.addEventListener(event, listener);
    return () => element.removeEventListener(event, listener);
  }, [event, element]);
}
```

## Pattern: Hook with Subscription
```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}
```
