# 01 — Component Patterns & JSX Mastery

## What You'll Master
- Props drilling vs composition
- Children as props, render props
- Conditional rendering patterns (&&, ternary, early return)
- Lists, keys, and reconciliation
- Component composition over inheritance
- Slot patterns and layout components

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Build a Layout component with header/sidebar/content slots | Atlassian, Shopify | Medium |
| 2 | Implement a conditional rendering utility (Show/Hide component) | Google, Amazon | Easy |
| 3 | Create a polymorphic `<Box as="section">` component | Stripe, Vercel | Hard |
| 4 | Build a List component that handles empty/loading/error states | Meta, Flipkart | Medium |
| 5 | Implement a Card component with compound sub-components | Microsoft, Razorpay | Medium |

## Key Concepts
- **Why keys matter**: React uses keys to track identity during reconciliation
- **Children API**: `React.Children.map`, `cloneElement`, and why composition is preferred
- **Fragment patterns**: When and why to use `<></>` vs `<Fragment key={...}>`
- **JSX is just function calls**: Understanding `React.createElement` under the hood

## Run Code
```bash
cd playground && npm run dev
# or open: https://stackblitz.com/fork/react
```
