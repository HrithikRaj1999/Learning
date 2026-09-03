import { useState } from "react";

// text sorts lexigraphically, numbers sort by value
const compare = (a, b) => (typeof a === "string" ? a.localeCompare(b) : a - b);

export function useTable(rows, pageSize) {
  const [sortKey, setSortKey] = useState(null); // null = not sorted yet
  const [isAsc, setIsAsc] = useState(true);
  const [page, setPage] = useState(1);

  // 1. sort a COPY, because sort() would rearrange the original rows
  let sortedRows = [...rows];
  if (sortKey) {
    sortedRows = [...rows].sort((a, b) => compare(a[sortKey], b[sortKey]));
    if (!isAsc) sortedRows.reverse();
  }

  // 2. cut out just the slice this page shows
  const start = (page - 1) * pageSize;
  const pageRowsToDisplay = sortedRows.slice(start, start + pageSize);
  const lastPage = Math.ceil(sortedRows.length / pageSize) || 1;

  const handleSort = (key) => {
    if (key === sortKey) {
      setIsAsc(!isAsc); // same column clicked again -> flip the direction
    } else {
      setSortKey(key);
      setIsAsc(true); // new column -> start from A to Z
    }
    setPage(1); // a new order makes the old page number meaningless
  };

  return {
    sortKey,
    isAsc,
    handleSort,
    page,
    setPage,
    lastPage,
    pageRows: pageRowsToDisplay,
    total: sortedRows.length,
    from: start + 1,
    to: Math.min(start + pageSize, sortedRows.length),
  };
}
