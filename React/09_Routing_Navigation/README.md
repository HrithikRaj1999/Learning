# 09 — Routing & Navigation Patterns

## What You'll Master
- React Router v6 fundamentals
- Nested routes and layouts
- Route loaders and actions (data router)
- Protected/authenticated routes
- Programmatic navigation
- URL state management (search params)

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Implement protected routes with auth redirect | All companies | Medium |
| 2 | Build nested routes with shared layout | Amazon, Atlassian | Medium |
| 3 | Sync filter state with URL search params | Flipkart, Google | Medium |
| 4 | Implement breadcrumbs from route hierarchy | Microsoft, Shopify | Medium |
| 5 | Build a route-based code splitting setup | Netflix, Vercel | Hard |
| 6 | Handle 404 and error routes gracefully | All companies | Easy |

## Key Concepts
- **Outlet**: Renders child route components in nested layouts
- **useNavigate**: Programmatic navigation
- **useSearchParams**: URL as state (shareable, bookmarkable)
- **Loaders**: Fetch data before route renders (parallel with navigation)

## Protected Route Pattern
```jsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  
  return children;
}

// Usage in router
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## URL State Pattern
```jsx
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  
  function updateFilters(key, value) {
    setSearchParams(prev => {
      prev.set(key, value);
      return prev;
    });
  }
  
  // URL: /products?category=shoes&sort=price
}
```
