// main.jsx
import { useState } from "react";
import SearchBar from "./components/searchBar/SearchBar";
import MovieCard from "./components/MovieCard/MovieCard";
import { useMovieSearch } from "./hooks/useMovieSearch";
import { PAGE_SIZE } from "./api/movie";
import styles from "./main.module.css";

export default function Main() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { items, total, loading, error } = useMovieSearch(query, page);
  const lastPage = Math.ceil(total / PAGE_SIZE);

  function handleSearch(value) {
    setQuery(value);
    setPage(1); // new search -> back to page 1
  }

  return (
    <main className={styles.wrap}>
      <SearchBar value={query} onChange={handleSearch} />

      {loading && <p className={styles.msg}>Loading…</p>}
      {error && <p className={styles.msg}>{error}</p>}
      {!loading && !error && query && items.length === 0 && (
        <p className={styles.msg}>No movies found.</p>
      )}

      <section className={styles.grid}>
        {items.map((m) => (
          <MovieCard
            key={m.id ?? m.imdbID}
            movie={m}
          /> /* stable id, not index */
        ))}
      </section>

      {lastPage > 1 && (
        <nav className={styles.pager}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span>
            {page} / {lastPage}
          </span>
          <button
            disabled={page >= lastPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </main>
  );
}
