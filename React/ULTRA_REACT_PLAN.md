# Ultra React Mastery Plan — Fortune 500 & Startup Interview Focus

Goal: Master React (17/18/19) with logic-centric machine coding questions asked in Fortune 500, MNCs, and top startups.

## How to Run Code

Each task includes a **StackBlitz** or **CodeSandbox** one-click link pattern:
- **StackBlitz**: `https://stackblitz.com/fork/react` (React 18 template)
- **React 19 Playground**: `https://stackblitz.com/fork/react19` or use `npx create-react-app@latest`
- **Local Runner**: Use the included `playground/` folder — run `npm install && npm run dev`

---

| # | Module | Level | Core Skills | Tasks | Status |
|---|--------|-------|-------------|-------|--------|
| 01 | Component Patterns & JSX Mastery | Intermediate | Props, children, composition, conditional rendering, lists/keys | 20 | [ ] |
| 02 | State Management & Hooks Deep Dive | Advanced | useState, useReducer, useRef, closures, stale state | 20 | [ ] |
| 03 | useEffect & Lifecycle Patterns | Advanced | Effects, cleanup, race conditions, sync vs async | 20 | [ ] |
| 04 | Custom Hooks & Logic Extraction | Advanced | Reusable hooks, hook composition, testing hooks | 20 | [ ] |
| 05 | Performance Optimization | Advanced | memo, useMemo, useCallback, virtualization, profiling | 20 | [ ] |
| 06 | Context API & State Architecture | Advanced | Context, provider patterns, state machines, Zustand | 20 | [ ] |
| 07 | React 18 Concurrent Features | Advanced | Suspense, useTransition, useDeferredValue, streaming SSR | 20 | [ ] |
| 08 | React 19 New APIs | Advanced | use(), server components, actions, useFormStatus, useOptimistic | 20 | [ ] |
| 09 | Routing & Navigation Patterns | Advanced | React Router v6, nested routes, loaders, protected routes | 20 | [ ] |
| 10 | Forms, Validation & Controlled Inputs | Advanced | Controlled/uncontrolled, react-hook-form, debounce, validation | 20 | [ ] |
| 11 | Data Fetching & Caching | Advanced | SWR, React Query, Suspense for data, optimistic updates | 20 | [ ] |
| 12 | Testing React Applications | Advanced | React Testing Library, mocking, integration tests, MSW | 20 | [ ] |
| 13 | Component Design Systems | Advanced | Compound components, render props, headless UI, accessibility | 20 | [ ] |
| 14 | Machine Coding Round — UI Components | Expert | Autocomplete, Modal, Tabs, Accordion, Toast, Carousel | 20 | [ ] |
| 15 | Machine Coding Round — App Features | Expert | Todo, Kanban, Infinite scroll, Pagination, File explorer | 20 | [ ] |
| 16 | Machine Coding Round — Logic Heavy | Expert | Debounce/throttle, undo/redo, drag-drop, virtual list, spreadsheet | 20 | [ ] |

---

## Suggested Order

1. **Foundation** (Weeks 1–2): Modules 01–04 — Components, hooks, effects, custom hooks
2. **Advanced Patterns** (Weeks 3–4): Modules 05–08 — Performance, context, React 18/19
3. **Real-World** (Weeks 5–6): Modules 09–12 — Routing, forms, data fetching, testing
4. **Interview Prep** (Weeks 7–8): Modules 13–16 — Design systems + machine coding rounds

---

## Weekly Plan

| Week | Focus |
|------|-------|
| 1 | Modules 01–02: Component patterns, state, hooks fundamentals |
| 2 | Modules 03–04: Effects, lifecycle, custom hooks |
| 3 | Modules 05–06: Performance, memoization, context, state architecture |
| 4 | Modules 07–08: React 18 concurrent features, React 19 APIs |
| 5 | Modules 09–10: Routing, forms, validation |
| 6 | Modules 11–12: Data fetching, caching, testing |
| 7 | Modules 13–14: Design systems, UI component machine coding |
| 8 | Modules 15–16: App-level machine coding, logic-heavy problems |

---

## Fortune 500 / MNC / Startup — Most Asked Topics

### Google, Meta, Amazon, Microsoft, Apple
- Virtual/infinite scrolling with performance
- Autocomplete with debounce + API
- State management at scale (context vs external stores)
- Concurrent rendering & Suspense boundaries
- Accessibility-first component design

### Flipkart, Swiggy, Razorpay, PhonePe, Atlassian
- Machine coding: build a component from scratch in 45–90 min
- Custom hooks for business logic
- Optimistic UI updates
- Form builders with dynamic validation
- Undo/redo systems

### Stripe, Vercel, Shopify, Netflix
- Server components & streaming patterns
- Type-safe data fetching
- Design system component APIs
- Performance profiling & bundle optimization
- Error boundaries & resilient UIs

---

## Key Interview Signals (What Interviewers Look For)

1. **Component decomposition** — Can you break UI into logical pieces?
2. **State placement** — Do you lift state correctly? Avoid prop drilling?
3. **Effect discipline** — Clean effects, no infinite loops, proper cleanup?
4. **Performance awareness** — When to memoize? What causes re-renders?
5. **Edge cases** — Loading, error, empty states handled?
6. **Code quality** — Clean, readable, no over-engineering?
