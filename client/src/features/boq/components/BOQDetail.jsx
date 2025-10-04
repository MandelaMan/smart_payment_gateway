import React, { useMemo } from "react";
import DataTable from "react-data-table-component";
import { FiArrowLeft } from "react-icons/fi";
import { useGetBoqQuery } from "../../../redux/api/apiSlice"; // ← matches your tree

const fmt = (n) =>
  `KSh ${Number(n ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

const BOQDetail = ({ id, onBack }) => {
  const { data, isLoading, isError, error, isFetching } = useGetBoqQuery(id, {
    skip: !id,
  });

  const items = data?.items || [];

  const columns = useMemo(
    () => [
      {
        name: "Item",
        selector: (r) => r.name,
        grow: 2,
        wrap: true,
        minWidth: "220px",
      },
      { name: "Unit", selector: (r) => r.unit, width: "90px" },
      {
        name: "Rate",
        selector: (r) => r.price,
        right: true,
        width: "140px",
        cell: (r) => fmt(r.price),
      },
      { name: "Qty", selector: (r) => r.qty, right: true, width: "110px" },
      {
        name: "Total",
        selector: (r) => Number(r.qty) * Number(r.price),
        right: true,
        width: "160px",
        cell: (r) => <strong>{fmt(Number(r.qty) * Number(r.price))}</strong>,
      },
    ],
    []
  );

  const subtotal =
    items.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0) ??
    Number(data?.total ?? 0);

  return (
    <div>
      <div className="panel__head" style={{ marginBottom: 10 }}>
        <div className="panel__title">{data?.name || "BOQ Details"}</div>
        <button className="btn" onClick={onBack}>
          <FiArrowLeft className="icon" /> Back to History
        </button>
      </div>

      {isLoading && <div>Loading…</div>}
      {isError && (
        <div className="error">
          Failed to load BOQ{error?.status ? ` (HTTP ${error.status})` : ""}.
        </div>
      )}

      {!isLoading && !isError && data && (
        <>
          <div className="grid-12" style={{ marginBottom: 10 }}>
            <div className="panel col-4">
              <div className="small muted">Reference</div>
              <div style={{ fontWeight: 700 }}>{data.ref}</div>
            </div>
            <div className="panel col-4">
              <div className="small muted">POP</div>
              <div style={{ fontWeight: 700 }}>
                {data.pop ?? data.pop_name ?? "-"}
              </div>
            </div>
            <div className="panel col-4">
              <div className="small muted">Date</div>
              <div style={{ fontWeight: 700 }}>
                {data.created_at ? String(data.created_at).slice(0, 10) : "-"}
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={items}
            dense
            pagination
            highlightOnHover
            persistTableHead
            progressPending={isFetching}
            noDataComponent="No items."
          />

          <div className="boq-totalbar">
            <div className="boq-totalbar__chip">
              <div className="muted">Total</div>
              <div>
                <strong>{fmt(subtotal)}</strong>
              </div>
            </div>
          </div>
        </>
      )}

      {!isLoading && !isError && !data && (
        <div className="muted">BOQ not found.</div>
      )}
    </div>
  );
};

export default BOQDetail;
