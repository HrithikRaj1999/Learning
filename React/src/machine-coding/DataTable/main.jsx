import { DataTable } from "./components/DataTable.jsx";
import { Pagination } from "./components/Pagination.jsx";
import { useProducts } from "./hooks/useProducts.js";
import { useTable } from "./hooks/useTable.js";
import styles from "./main.module.css";

export const meta = {
  title: "Data Table",
  brief: "Fetch, sort by column, paginate",
};

const PAGE_SIZE = 10;

const COLUMNS = [
  { key: "title", label: "Product" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price", numeric: true },
  { key: "rating", label: "Rating", numeric: true },
  { key: "stock", label: "Stock", numeric: true },
];

export default function DataTablePage() {
  const { rows, loading, error } = useProducts();
  const table = useTable(rows, PAGE_SIZE);

  if (loading) return <p className={styles.msg}>Loading…</p>;
  if (error) return <p className={styles.msg}>{error}</p>;

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Data Table</h1>
      <p className={styles.lede}>Click any header to sort. 100 products.</p>

      <DataTable
        columns={COLUMNS}
        rows={table.pageRows}
        sortKey={table.sortKey}
        isAsc={table.isAsc}
        onSort={table.handleSort}
      />

      <Pagination
        page={table.page}
        lastPage={table.lastPage}
        from={table.from}
        to={table.to}
        total={table.total}
        onChange={table.setPage}
      />
    </div>
  );
}
