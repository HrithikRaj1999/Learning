import styles from "./SearchBar.module.css";
export default function SearchBar({ value, onChange }) {
  return (
    <input
      className={styles.input}
      value={value}
      placeholder="Search movies…"
      autoFocus
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
