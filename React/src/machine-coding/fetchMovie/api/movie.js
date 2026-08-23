// api/movies.js
import MOVIES from "../data/movies.json";

export const PAGE_SIZE = 10;
const KEY = import.meta.env.VITE_OMDB_KEY;
const LIVE = false;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function searchMovies(query, page, signal) {
  if (LIVE) {
    const url = `https://www.omdbapi.com/?apikey=${KEY}&s=${query}&page=${page}`;
    const res = await fetch(url, { signal });
    const json = await res.json();
    return { items: json.Search ?? [], total: Number(json.totalResults ?? 0) };
  }

  await sleep(400); // shows the loading state
  const hits = MOVIES.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()),
  );
  const start = (page - 1) * PAGE_SIZE;
  // total = all matches, not the slice — else lastPage becomes 1 and Next dies
  return { items: hits.slice(start, start + PAGE_SIZE), total: hits.length };
}
