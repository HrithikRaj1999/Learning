# 10 — Forms, Validation & Controlled Inputs

## What You'll Master
- Controlled vs uncontrolled components
- Form state management patterns
- Real-time validation and error display
- Debounced inputs
- react-hook-form integration
- Dynamic form builders

## Most Asked in Interviews (Fortune 500 / Startups)

| # | Question | Companies | Difficulty |
|---|----------|-----------|-----------|
| 1 | Build a multi-step form with validation between steps | Flipkart, Razorpay | Hard |
| 2 | Implement a dynamic form from JSON schema | Atlassian, Stripe | Hard |
| 3 | Build a debounced search input that cancels stale requests | Google, Amazon | Medium |
| 4 | Implement form with real-time field validation (email, phone) | All companies | Medium |
| 5 | Build an OTP input (auto-focus, paste, backspace) | PhonePe, Swiggy | Hard |
| 6 | Controlled input performance — when to use uncontrolled | Meta, Vercel | Medium |

## Key Concepts
- **Controlled**: React state is source of truth — `value` + `onChange`
- **Uncontrolled**: DOM is source of truth — `ref` + `defaultValue`
- **react-hook-form**: Uncontrolled by default, minimal re-renders
- **Validation timing**: onChange, onBlur, onSubmit tradeoffs

## OTP Input Pattern (Most Asked)
```jsx
function OTPInput({ length = 6, onComplete }) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputs = useRef([]);
  
  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    if (value && index < length - 1) {
      inputs.current[index + 1].focus();
    }
    
    if (newOtp.every(d => d !== '')) {
      onComplete(newOtp.join(''));
    }
  }
  
  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  }
  
  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(pasted)) {
      setOtp(pasted.split('').concat(Array(length - pasted.length).fill('')));
      inputs.current[Math.min(pasted.length, length - 1)].focus();
    }
    e.preventDefault();
  }
  
  return (
    <div onPaste={handlePaste}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          value={digit}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          maxLength={1}
        />
      ))}
    </div>
  );
}
```
