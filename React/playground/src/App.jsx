import { useState } from 'react';

import { CounterWithUndo } from './demos/CounterWithUndo';
import { DebounceDemo } from './demos/DebounceDemo';
import { StarRating } from './demos/StarRating';

const demos = [
  { name: 'Counter + Undo/Redo', component: CounterWithUndo },
  { name: 'Debounce Hook', component: DebounceDemo },
  { name: 'Star Rating', component: StarRating },
];

export default function App() {
  const [activeDemo, setActiveDemo] = useState(0);
  const ActiveComponent = demos[activeDemo].component;

  return (
    <div className="playground">
      <h1>⚛️ React Interview Playground</h1>
      <p>Practice machine coding questions here. Edit files in <code>src/solutions/</code></p>
      <p className="hint">
        Run: <code>npm install && npm run dev</code> | 
        Or open in StackBlitz: <a href="https://stackblitz.com/fork/react" target="_blank" rel="noopener">stackblitz.com/fork/react</a>
      </p>

      <h2>Demo Components</h2>
      <div className="nav">
        {demos.map((demo, i) => (
          <button
            key={demo.name}
            className={i === activeDemo ? 'active' : ''}
            onClick={() => setActiveDemo(i)}
          >
            {demo.name}
          </button>
        ))}
      </div>

      <div className="task-area">
        <ActiveComponent />
      </div>
    </div>
  );
}
