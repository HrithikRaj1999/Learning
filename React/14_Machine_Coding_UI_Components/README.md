# 14 — Machine Coding Round: UI Components

> **Format**: Build from scratch in 45–90 minutes. No UI libraries allowed.

## Most Asked UI Component Questions

| # | Component | Asked At | Key Logic | Difficulty |
|---|-----------|----------|-----------|-----------|
| 1 | Autocomplete/Typeahead | Google, Meta, Amazon | Debounce, API, keyboard nav, highlight | Hard |
| 2 | Modal/Dialog | Microsoft, Atlassian | Portal, focus trap, escape, overlay | Medium |
| 3 | Tabs | Flipkart, Razorpay, Stripe | Active state, lazy render, keyboard | Medium |
| 4 | Accordion | Swiggy, PhonePe, Shopify | Single/multi expand, animation | Medium |
| 5 | Star Rating | Amazon, Flipkart | Hover preview, click, half stars | Easy |
| 6 | Multi-select Dropdown | Google, Atlassian | Search, chips, select all, keyboard | Hard |
| 7 | Toast/Notifications | Netflix, Uber | Auto-dismiss, queue, stacking | Medium |
| 8 | Tooltip/Popover | Stripe, Vercel | Positioning, delay, hover intent | Medium |
| 9 | Date Picker | Microsoft, Google | Calendar grid, navigation, selection | Hard |
| 10 | Carousel/Slider | Flipkart, Swiggy | Auto-play, infinite loop, swipe | Medium |
| 11 | Progress Bar | All companies | Animated, determinate/indeterminate | Easy |
| 12 | Breadcrumbs | Atlassian, Shopify | Route-based, truncation | Easy |
| 13 | Tag/Chip Input | Google, Notion | Add, remove, paste multiple | Medium |
| 14 | Color Picker | Figma, Canva | HSL/RGB, gradient, eyedropper | Hard |
| 15 | Skeleton Loader | Netflix, Flipkart | Shimmer animation, layout matching | Easy |
| 16 | Image Lazy Loader | Amazon, Flipkart | Intersection observer, placeholder | Medium |
| 17 | Draggable List | Atlassian, Notion | Drag events, reorder, drop zones | Hard |
| 18 | Context Menu | Microsoft, Google | Right-click, positioning, sub-menus | Medium |
| 19 | Toggle/Switch | All companies | Accessible, animated, controlled | Easy |
| 20 | Search with Filters | Flipkart, Amazon | Faceted search, URL sync, chips | Hard |

## Evaluation Criteria

| Area | What They Check |
|------|----------------|
| Functionality | Does it work? All user interactions handled? |
| Component API | Clean props interface? Controlled + uncontrolled? |
| Accessibility | Keyboard nav, ARIA roles, focus management? |
| Performance | Unnecessary re-renders? Debouncing? Memoization? |
| Edge Cases | Empty state, overflow, rapid clicks, network failure? |
| Code Quality | Clean structure, no dead code, good naming? |

## Template: How to Approach

```
1. Clarify requirements (2 min)
   - What props should it accept?
   - Controlled, uncontrolled, or both?
   - Accessibility requirements?

2. Component structure (3 min)
   - Break into sub-components
   - Define state shape
   - Identify side effects

3. Build core functionality (25 min)
   - State management
   - Event handlers
   - Core rendering

4. Add edge cases (10 min)
   - Keyboard navigation
   - Loading/error/empty states
   - Boundary conditions

5. Polish (5 min)
   - Basic styling
   - Clean up code
   - Test manually
```
