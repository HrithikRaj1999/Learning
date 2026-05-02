import { useState } from 'react';

export function StarRating({ maxStars = 5, initialRating = 0, onChange }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  function handleClick(starIndex) {
    const newRating = starIndex === rating ? 0 : starIndex; // click same star to deselect
    setRating(newRating);
    onChange?.(newRating);
  }

  return (
    <div>
      <h3>Star Rating</h3>
      <div style={{ display: 'flex', gap: '4px', margin: '1rem 0' }}>
        {Array.from({ length: maxStars }, (_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= (hover || rating);

          return (
            <span
              key={i}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              style={{
                fontSize: '2rem',
                cursor: 'pointer',
                color: isFilled ? '#ffc107' : '#555',
                transition: 'color 0.15s, transform 0.15s',
                transform: hover === starValue ? 'scale(1.2)' : 'scale(1)',
              }}
              role="button"
              aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              ★
            </span>
          );
        })}
      </div>
      <p>Selected: {rating} / {maxStars}</p>
      <p className="hint">Hover to preview, click to select, click same star to deselect</p>
    </div>
  );
}
