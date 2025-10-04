import React, { useMemo, useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useListBoqsQuery } from "../../../redux/api/apiSlice"; // ← matches your tree

// KSh formatter
const fmt = (n) =>
  `KSh ${Number(n ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

// debounce hook
const useDebounce = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const BOQHistory = ({ onOpen }) => {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 350);

  // Pull list from API
  const {
    data = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useListBoqsQuery();

  // Normalize server shape to table rows
  const rows = useMemo(
    () =>
      (data || []).map((r) => ({
        id: r.id,
        ref: r.ref,
        name: r.name,
        pop: r.pop ?? r.pop_name ?? "-", // controller aliases pop_name AS pop
        items: r.item_count,
        total: Number(r.total),
        date: r.created_at ? String(r.created_at).slice(0, 10) : "",
      })),
    [data]
  );

  // Debounced filter across ref, name, pop, date, total
  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const totalStr = String(r.total);
      return (
        r.ref.toLowerCase().includes(q) ||
        (r.name || "").toLowerCase().includes(q) ||
        (r.pop || "").toLowerCase().includes(q) ||
        (r.date || "").toLowerCase().includes(q) ||
        totalStr.includes(q)
      );
    });
  }, [debounced, rows]);

  // Columns (layout kept same as your original)
  const columns = useMemo(
    () => [
      { name: "Ref", selector: (r) => r.ref, sortable: true, width: "120px" },
      {
        name: "Name",
        selector: (r) => r.name || "-",
        sortable: true,
        grow: 2,
        wrap: true,
        minWidth: "220px",
      },
      {
        name: "POP",
        selector: (r) => r.pop,
        sortable: true,
        grow: 1,
        minWidth: "150px",
      },
      {
        name: "Items",
        selector: (r) => r.items,
        sortable: true,
        right: true,
        width: "110px",
      },
      {
        name: "Total (KSh)",
        selector: (r) => r.total,
        sortable: true,
        right: true,
        width: "150px",
        cell: (r) => fmt(r.total),
      },
      { name: "Date", selector: (r) => r.date, sortable: true, width: "140px" },
      {
        name: "",
        width: "110px",
        cell: (r) => (
          <button className="btn btn--primary" onClick={() => onOpen?.(r.id)}>
            Open
          </button>
        ),
        ignoreRowClick: true,
        button: true,
      },
    ],
    [onOpen]
  );

  return (
    <div>
      <div className="panel__head" style={{ marginBottom: 10 }}>
        <div className="panel__title">Previous BOQs</div>
        <div className="table-toolbar">
          <input
            className="table-toolbar__input"
            placeholder="Search by Ref, Name, POP, Date, or Total…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search BOQs"
          />
        </div>
      </div>

      {isLoading && <div>Loading…</div>}
      {isError && (
        <div className="error">
          Failed to load BOQs{error?.status ? ` (HTTP ${error.status})` : ""}.
        </div>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          dense
          highlightOnHover
          persistTableHead
          progressPending={isFetching}
          noDataComponent="No BOQs found."
        />
      )}
    </div>
  );
};

export default BOQHistory;
