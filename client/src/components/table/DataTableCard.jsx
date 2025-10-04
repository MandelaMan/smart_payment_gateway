import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";

const TableToolbar = ({ filter, setFilter, placeholder = "Filter…" }) => (
  <div className="table-toolbar">
    <input
      className="table-toolbar__input"
      placeholder={placeholder}
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    />
  </div>
);

const DataTableCard = ({ title, columns, data, filterKey = "name" }) => {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return data;
    return data.filter((row) =>
      String(row[filterKey] ?? "")
        .toLowerCase()
        .includes(f)
    );
  }, [data, filter, filterKey]);

  return (
    <div className="panel panel--tight">
      <div className="panel__head">
        <div className="panel__title">{title}</div>
        <TableToolbar filter={filter} setFilter={setFilter} />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        pagination
        highlightOnHover
        dense
        responsive
        persistTableHead
      />
    </div>
  );
};

export default DataTableCard;
