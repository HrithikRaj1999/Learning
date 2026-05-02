# 06 — Context API & State Architecture

## What You'll Master
- Context creation, providers, consumers
- Context performance pitfalls
- Context splitting strategies
- When to use Context vs external stores
- Zustand, Jotai patterns
- State machines with useReducer

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Build a theme toggle with Context (dark/light mode) | All companies | Easy |
| 2 | Fix re-render issue: all consumers re-render on any context change | Google, Meta | Hard |
| 3 | Implement a multi-step form wizard with shared state | Flipkart, Razorpay | Medium |
| 4 | Design auth context with login/logout/loading states | Amazon, Microsoft | Medium |
| 5 | Compare Context vs Zustand for a given scenario | Netflix, Vercel | Medium |
| 6 | Implement a state machine for a multi-state UI | Atlassian, Stripe | Hard |

## Key Concepts
- **Context is not state management** — it's a dependency injection mechanism
- **Any context value change → all consumers re-render**
- **Split contexts**: Separate frequently-changing state from stable state
- **Selector pattern**: External stores (Zustand) allow selecting slices

## Context Performance Fix
```jsx
// ❌ One big context — all consumers re-render
const AppContext = createContext({ user, theme, cart, notifications });

// ✅ Split into focused contexts
const UserContext = createContext(null);
const ThemeContext = createContext('light');
const CartContext = createContext({ items: [], dispatch: null });
```

## State Machine Pattern
```jsx
function useTrafficLight() {
  const [state, dispatch] = useReducer((state, event) => {
    switch (state) {
      case 'red':
        if (event === 'NEXT') return 'green';
        break;
      case 'green':
        if (event === 'NEXT') return 'yellow';
        break;
      case 'yellow':
        if (event === 'NEXT') return 'red';
        break;
    }
    return state;
  }, 'red');
  
  return [state, () => dispatch('NEXT')];
}
```
