# 13 — Component Design Systems

## What You'll Master
- Compound component pattern
- Render props and headless components
- Controlled vs uncontrolled component APIs
- Accessibility (ARIA, keyboard, focus)
- Polymorphic components
- Slot-based composition

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Build a compound Select/Dropdown component | Atlassian, Stripe | Hard |
| 2 | Create an accessible Modal with focus trap | Google, Microsoft | Hard |
| 3 | Build headless Tabs (logic only, no styling) | Vercel, Shopify | Hard |
| 4 | Implement a polymorphic Button (as="a", as="button") | Meta, Stripe | Medium |
| 5 | Design a Toast system with provider pattern | Netflix, Razorpay | Medium |
| 6 | Build an Accordion that supports single/multi expand | All companies | Medium |

## Key Concepts
- **Compound components**: Parent manages state, children consume via context
- **Headless**: Logic + accessibility, zero styling (Radix, Headless UI)
- **Controlled API**: Component can be both controlled and uncontrolled
- **ARIA**: Roles, states, keyboard interactions per WAI-ARIA patterns

## Compound Component Pattern
```jsx
const SelectContext = createContext(null);

function Select({ value, onChange, children }) {
  const [open, setOpen] = useState(false);
  
  return (
    <SelectContext.Provider value={{ value, onChange, open, setOpen }}>
      <div role="listbox">{children}</div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ children }) {
  const { value, open, setOpen } = useContext(SelectContext);
  return (
    <button
      role="combobox"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
    >
      {children || value || 'Select...'}
    </button>
  );
}

function SelectOption({ value, children }) {
  const { value: selected, onChange, setOpen } = useContext(SelectContext);
  return (
    <div
      role="option"
      aria-selected={value === selected}
      onClick={() => { onChange(value); setOpen(false); }}
    >
      {children}
    </div>
  );
}

// Usage
<Select value={color} onChange={setColor}>
  <SelectTrigger />
  <SelectOption value="red">Red</SelectOption>
  <SelectOption value="blue">Blue</SelectOption>
</Select>
```

## Focus Trap Pattern
```jsx
function useFocusTrap(ref) {
  useEffect(() => {
    const element = ref.current;
    const focusable = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    
    element.addEventListener('keydown', handleKeyDown);
    first?.focus();
    
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [ref]);
}
```
