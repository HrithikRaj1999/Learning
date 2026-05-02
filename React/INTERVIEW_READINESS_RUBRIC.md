# React Interview & Production Readiness Rubric

## 5/10: Solid Fundamentals

- Builds functional components with props, state, and effects.
- Understands useState, useEffect, conditional rendering, lists/keys.
- Can fetch data and display it. Handles loading/error states.
- Knows controlled vs uncontrolled inputs.

## 7/10: Strong Intermediate (Clears most MNC rounds)

- Writes clean custom hooks that encapsulate business logic.
- Understands re-render mechanics — knows when and why components re-render.
- Uses React.memo, useMemo, useCallback appropriately (not everywhere).
- Implements proper effect cleanup, avoids stale closures.
- Can build common UI: modals, tabs, accordions, dropdowns from scratch.
- Handles forms with validation, debounced inputs, and error display.
- Understands Context API limitations and when to use external state.

## 8.5/10: Advanced (Fortune 500 / Top Startup Level)

- Implements concurrent React patterns: Suspense, useTransition, useDeferredValue.
- Builds virtualized lists, infinite scroll, optimistic updates.
- Designs compound component APIs (headless pattern).
- Writes comprehensive tests: unit, integration, user-event based.
- Profiling: identifies wasted renders, uses React DevTools Profiler.
- Understands React 19: `use()`, server components, actions, form status.
- Can build a full machine coding solution in 45–60 minutes.

## 10/10: Production Architect

- Designs component libraries with accessibility, theming, and composability.
- Implements complex state machines (XState or useReducer patterns).
- Builds error boundary strategies with recovery mechanisms.
- Architects data layer: caching, prefetching, background sync, retry.
- Understands SSR/SSG tradeoffs, hydration, streaming.
- Makes framework-level decisions (Next.js vs Remix vs SPA) with clear tradeoffs.
- Mentors teams on React patterns, reviews architecture decisions.

---

## Machine Coding Round Scoring (45-min format)

| Criteria | Weight | What's Evaluated |
|----------|--------|-----------------|
| Working solution | 30% | Does it function correctly? |
| Component structure | 20% | Clean decomposition, single responsibility |
| State management | 20% | Correct state placement, no unnecessary re-renders |
| Edge cases | 15% | Empty, loading, error, boundary cases |
| Code quality | 15% | Naming, readability, no dead code |

---

## Top 20 Machine Coding Questions (Most Asked)

1. **Autocomplete/Typeahead** — debounce, API, keyboard nav, highlight match
2. **Infinite Scroll** — intersection observer, pagination, loading states
3. **Modal/Dialog** — portal, focus trap, escape close, overlay click
4. **Tabs Component** — active state, lazy render, keyboard accessible
5. **Todo App with Filters** — CRUD, filters, local storage persistence
6. **Star Rating** — hover preview, click select, half stars
7. **Accordion/Collapsible** — single/multi expand, animation, accessibility
8. **Kanban Board** — drag-drop, columns, state management
9. **File Explorer/Tree View** — recursive render, expand/collapse, lazy load
10. **Pagination** — page numbers, prev/next, total pages, edge cases
11. **Multi-select Dropdown** — search, chips, select all, keyboard nav
12. **Toast/Notification System** — auto-dismiss, stack, different types
13. **Undo/Redo** — command pattern, history stack, state snapshots
14. **Stopwatch/Timer** — start/stop/reset/lap, useRef for intervals
15. **Image Carousel** — auto-play, swipe, dots, infinite loop
16. **Debounce/Throttle Hook** — custom hook, cleanup, leading/trailing
17. **Virtual Scroll** — fixed height, dynamic height, overscan
18. **Spreadsheet/Grid** — cell editing, formulas, selection
19. **Comment Thread** — nested replies, collapse, real-time
20. **OTP Input** — auto-focus next, paste handling, backspace
