import { useState } from "react";
import styles from "./main.module.css";

export const meta = {
  title: "Star Rating",
  brief: "Click to rate, hover to preview",
};

const MAX = 5;
const LABELS = ["Not rated", "Awful", "Poor", "Fine", "Good", "Excellent"];

export default function StarRating() {
  const [rating, setRating] = useState(0); // what the user clicked
  const [hover, setHover] = useState(0); // 0 means the mouse is away
  const handleOnClick = (e) => {
    e.preventDefault();
    setRating(star);
  };
  const shown = hover || rating;

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Star Rating</h1>

      <div className={styles.stars} onMouseLeave={() => setHover(0)}>
        {Array.from({ length: MAX }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} of ${MAX}`}
            className={
              star <= shown ? `${styles.star} ${styles.on}` : styles.star
            }
            onClick={handleOnClick}
            onMouseEnter={() => setHover(star)}
            onFocus={() => setHover(star)}
            // onBlur={() => setHover(0)}
          >
            ★
          </button>
        ))}
      </div>

      <p className={styles.label}>
        {shown}/{MAX} {LABELS[shown]}
      </p>

      <button
        type="button"
        className={styles.reset}
        onClick={() => setRating(0)}
      >
        Reset
      </button>
    </div>
  );
}
