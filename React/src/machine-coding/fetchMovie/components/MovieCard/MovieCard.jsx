// components/MovieCard/MovieCard.jsx
import styles from "./MovieCard.module.css";

export default function MovieCard({ movie }) {
  // read both shapes so local JSON and OMDb both work
  const title = movie.title ?? movie.Title;
  const year = movie.year ?? movie.Year;
  const poster = movie.image_url ?? movie.Poster;
  const link = movie.imdbID
    ? `https://www.imdb.com/title/${movie.imdbID}/`
    : `https://www.imdb.com/find?q=${encodeURIComponent(title)}`;

  return (
    <a className={styles.card} href={link} target="_blank" rel="noreferrer">
      <img className={styles.poster} src={poster} alt={title} loading="lazy" />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.year}>{year}</p>
    </a>
  );
}
