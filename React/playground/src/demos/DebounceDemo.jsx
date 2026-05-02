import { useState, useEffect, useRef } from 'react';

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function DebounceDemo() {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 500);
  const [results, setResults] = useState([]);
  const renderCount = useRef(0);

  renderCount.current++;

  useEffect(() => {
    if (!debouncedInput) {
      setResults([]);
      return;
    }

    const fakeResults = [
      `${debouncedInput} tutorial`,
      `${debouncedInput} examples`,
      `${debouncedInput} best practices`,
      `how to use ${debouncedInput}`,
      `${debouncedInput} vs alternatives`,
    ];
    setResults(fakeResults);
  }, [debouncedInput]);

  return (
    <div>
      <h3>Debounced Search</h3>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type to search (500ms debounce)..."
      />
      <p className="hint">
        Renders: {renderCount.current} | Debounced value: "{debouncedInput}"
      </p>
      {results.length > 0 && (
        <ul style={{ listStyle: 'none', marginTop: '0.5rem' }}>
          {results.map((r, i) => (
            <li key={i} style={{ padding: '0.25rem 0', borderBottom: '1px solid #0f3460' }}>
              🔍 {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
