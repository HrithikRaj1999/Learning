# 15 — Machine Coding Round: App Features

> **Format**: Build a mini-app feature in 60–90 minutes. Tests logical thinking + state design.

## Most Asked App Feature Questions

| # | Feature | Asked At | Key Logic | Difficulty |
|---|---------|----------|-----------|-----------|
| 1 | Todo App with Filters | All companies | CRUD, filter/sort, localStorage | Medium |
| 2 | Kanban Board | Atlassian, Notion, Trello | Drag-drop, columns, state | Hard |
| 3 | File Explorer / Tree View | Google, Microsoft | Recursive, expand/collapse, lazy | Hard |
| 4 | Infinite Scroll Feed | Instagram, Flipkart | Intersection observer, pagination | Medium |
| 5 | Pagination with Filters | Amazon, Flipkart | Page state, URL sync, prefetch | Medium |
| 6 | Shopping Cart | Amazon, Flipkart, Swiggy | Add/remove, quantity, total, discount | Medium |
| 7 | Comment Thread (Nested) | Reddit, Meta, Atlassian | Recursive, reply, collapse | Hard |
| 8 | Multi-step Form Wizard | Razorpay, Stripe | Navigation, validation, state persistence | Medium |
| 9 | Real-time Chat UI | WhatsApp-style, Slack | Messages, scroll-to-bottom, typing indicator | Hard |
| 10 | Poll/Voting App | Twitter/X, LinkedIn | Vote, results, real-time update | Medium |
| 11 | Image Gallery with Lightbox | Pinterest, Unsplash | Grid, zoom, keyboard nav | Medium |
| 12 | Notification Center | All apps | Read/unread, mark all, filter by type | Medium |
| 13 | Search with Recent + Suggestions | Google, Amazon | History, debounce, keyboard select | Hard |
| 14 | Settings Page (Toggle Sections) | All apps | Grouped settings, persist, reset | Easy |
| 15 | Calendar / Event Scheduler | Google, Microsoft | Month view, add/edit events, overlap | Hard |
| 16 | Dashboard with Widgets | Atlassian, Datadog | Grid layout, resize, drag | Hard |
| 17 | Social Media Feed | Meta, LinkedIn | Like, comment, share, optimistic | Medium |
| 18 | Music Player UI | Spotify-style | Play/pause, progress, playlist | Medium |
| 19 | Expense Tracker | Fintech companies | Add/categorize, chart, filter by date | Medium |
| 20 | Quiz App with Timer | EdTech companies | Timer, score, review answers | Medium |

## State Design Template

```
For each feature, think:
1. What's the shape of state? (entities, UI state, derived state)
2. Where does state live? (local, lifted, context, URL)
3. What are the actions/events? (user clicks, API responses, timers)
4. What are the derived values? (filtered list, totals, counts)
5. What needs persistence? (localStorage, URL, server)
```

## Example: Todo App Architecture
```jsx
// State shape
const [todos, dispatch] = useReducer(todoReducer, [], initFromStorage);
const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

// Derived state (NOT stored)
const filteredTodos = useMemo(() => {
  switch (filter) {
    case 'active': return todos.filter(t => !t.completed);
    case 'completed': return todos.filter(t => t.completed);
    default: return todos;
  }
}, [todos, filter]);

const activeCount = todos.filter(t => !t.completed).length;

// Actions
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD': return [...state, { id: crypto.randomUUID(), text: action.text, completed: false }];
    case 'TOGGLE': return state.map(t => t.id === action.id ? { ...t, completed: !t.completed } : t);
    case 'DELETE': return state.filter(t => t.id !== action.id);
    case 'EDIT': return state.map(t => t.id === action.id ? { ...t, text: action.text } : t);
    case 'CLEAR_COMPLETED': return state.filter(t => !t.completed);
    default: return state;
  }
}
```
