import { useEffect, useReducer } from "react";
import { useDebounce } from "./useDebounce";
import { searchMovies } from "../api/movie";

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "start":
      return { ...state, loading: true, error: "" };
    case "success":
      return {
        items: action.items,
        total: action.total,
        loading: false,
        error: "",
      };
    case "failure":
      return { ...state, loading: false, error: action.error };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

export function useMovieSearch(query, page) {
  const debouncedQuery = useDebounce(query);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "start" });

    (async () => {
      try {
        const { items, total } = await searchMovies(
          debouncedQuery,
          page,
          controller.signal,
        );
        dispatch({ type: "success", items, total });
      } catch (error) {
        if (error.name === "AbortError") return;
        dispatch({ type: "failure", error: error.message });
      }
    })();

    return () => controller.abort();
  }, [debouncedQuery, page]);

  return state;
}
