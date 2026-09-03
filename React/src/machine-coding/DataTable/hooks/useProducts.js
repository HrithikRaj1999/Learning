import { useEffect, useState } from "react";

const URL = "https://dummyjson.com/products?limit=100";

export function useProducts() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadProducts = async () => {
      try {
        const res = await fetch(URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        setRows(data.products);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProducts();

    return () => controller.abort();
  }, []);

  return { rows, loading, error };
}
