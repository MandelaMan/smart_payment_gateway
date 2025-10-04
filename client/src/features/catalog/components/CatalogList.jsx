import React, { useMemo, useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  useGetCatalogQuery,
  useCreateCatalogItemMutation,
  useUpdateCatalogItemMutation,
  useDeleteCatalogItemMutation,
} from "../../../redux/api/apiSlice";

/* ---------- Formatters ---------- */
const fmt = (n) =>
  `KSh ${Number(n ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

/* ---------- Debounce ---------- */
const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

/* ---------- Match BOQ table spacing (square corners, tighter padding) ---------- */
const tableStyles = {
  table: { style: { borderRadius: "0" } },
  tableWrapper: { style: { borderRadius: "0" } },
  rows: { style: { minHeight: "40px" } },
  headCells: {
    style: {
      paddingTop: "8px",
      paddingBottom: "8px",
      fontWeight: 700,
      fontSize: "13px",
    },
  },
  cells: {
    style: { paddingTop: "8px", paddingBottom: "8px", fontSize: "13px" },
  },
};

const initialForm = { id: "", name: "", unit: "", price: "" };

const Cataloglist = () => {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 300);

  /* ---------- Form state (create / edit) ---------- */
  const [form, setForm] = useState(initialForm);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");

  /* ---------- API ---------- */
  const {
    data = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetCatalogQuery();
  const [createItem, { isLoading: isCreating }] =
    useCreateCatalogItemMutation();
  const [updateItem, { isLoading: isUpdating }] =
    useUpdateCatalogItemMutation();
  const [deleteItem, { isLoading: isDeleting }] =
    useDeleteCatalogItemMutation();

  /* ---------- Normalize rows ---------- */
  const rows = useMemo(
    () =>
      (data || []).map((c) => ({
        id: String(c.id),
        name: c.name,
        unit: c.unit,
        price: Number(c.price ?? 0),
      })),
    [data]
  );

  /* ---------- Filter ---------- */
  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const priceStr = String(r.price);
      return (
        r.id.toLowerCase().includes(q) ||
        (r.name || "").toLowerCase().includes(q) ||
        (r.unit || "").toLowerCase().includes(q) ||
        priceStr.includes(q)
      );
    });
  }, [debounced, rows]);

  /* ---------- Columns (widths aligned to BOQ) ---------- */
  const columns = useMemo(
    () => [
      { name: "ID", selector: (r) => r.id, sortable: true, width: "120px" },
      {
        name: "Item",
        selector: (r) => r.name,
        sortable: true,
        wrap: true,
        grow: 3,
        minWidth: "260px",
      },
      { name: "Unit", selector: (r) => r.unit, sortable: true, width: "110px" },
      {
        name: "Price",
        selector: (r) => r.price,
        sortable: true,
        right: true,
        width: "150px",
        cell: (r) => fmt(r.price),
      },
      {
        name: "",
        width: "180px",
        cell: (r) => (
          <div className="btn-group">
            <button className="btn" onClick={() => onEdit(r)}>
              Edit
            </button>
            <button
              className="btn btn--danger"
              onClick={() => onDelete(r.id)}
              disabled={isDeleting}
              title="Delete item"
              style={{ borderRadius: 10 }}
            >
              Delete
            </button>
          </div>
        ),
        ignoreRowClick: true,
        button: true,
      },
    ],
    [isDeleting]
  );

  /* ---------- Handlers ---------- */
  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrorMsg("");
    setOkMsg("");
  };

  const validate = () => {
    const id = form.id.trim();
    const name = form.name.trim();
    const unit = form.unit.trim();
    const price = Number(form.price);
    if (mode === "create" && !id) return "ID is required";
    if (!name) return "Name is required";
    if (!unit) return "Unit is required";
    if (!Number.isFinite(price) || price < 0)
      return "Price must be a valid non-negative number";
    if (mode === "create" && id.length > 32)
      return "ID is too long (max 32 chars)";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }
    try {
      if (mode === "create") {
        await createItem({
          id: form.id.trim(),
          name: form.name.trim(),
          unit: form.unit.trim(),
          price: Number(form.price),
        }).unwrap();
        setOkMsg("Created ✓");
      } else {
        await updateItem({
          id: editingId,
          body: {
            name: form.name.trim(),
            unit: form.unit.trim(),
            price: Number(form.price),
          },
        }).unwrap();
        setOkMsg("Updated ✓");
      }
      setForm(initialForm);
      setEditingId(null);
      setMode("create");
    } catch (err) {
      setErrorMsg(err?.data?.message || "Operation failed");
    }
  };

  const onEdit = (row) => {
    setMode("edit");
    setEditingId(row.id);
    setForm({
      id: row.id, // immutable in UI
      name: row.name || "",
      unit: row.unit || "",
      price: String(row.price ?? ""),
    });
    setErrorMsg("");
    setOkMsg("");
  };

  const onCancelEdit = () => {
    setMode("create");
    setEditingId(null);
    setForm(initialForm);
    setErrorMsg("");
    setOkMsg("");
  };

  const onDelete = async (id) => {
    if (!window.confirm(`Delete catalog item "${id}"? This cannot be undone.`))
      return;
    try {
      await deleteItem(id).unwrap();
      setOkMsg("Deleted ✓");
      if (editingId === id) onCancelEdit();
    } catch (err) {
      setErrorMsg(err?.data?.message || "Delete failed");
    }
  };

  const busy = isCreating || isUpdating;

  /* ---------- UI ---------- */
  return (
    <div className="panel panel--tight">
      <div className="panel__head">
        <div className="panel__title">Catalog</div>
      </div>

      {/* ===== SECTION A: Manage (match BOQ form section) ===== */}
      <div className="boq-section boq-section--form">
        <div className="boq-section__title">Manage Item</div>

        {/* Inputs use the same BOQ section so they get height: 42px, tint, etc. */}
        <form className="ui-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <label className="field">
              <span className="field__label">ID (immutable)</span>
              <input
                className="field__input"
                name="id"
                placeholder="e.g., FIBC"
                value={form.id}
                onChange={onChange}
                disabled={mode === "edit"}
              />
            </label>

            <label className="field">
              <span className="field__label">Name</span>
              <input
                className="field__input"
                name="name"
                placeholder="Fiber Optic Cable (1m)"
                value={form.name}
                onChange={onChange}
              />
            </label>

            <label className="field">
              <span className="field__label">Unit</span>
              <input
                className="field__input"
                name="unit"
                placeholder="unit / m / pc / pack"
                value={form.unit}
                onChange={onChange}
              />
            </label>

            <label className="field">
              <span className="field__label">Price</span>
              <div className="field__control">
                <input
                  className="field__input"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={form.price}
                  onChange={onChange}
                />
                <span className="field__right">KSh</span>
              </div>
            </label>
          </div>

          {errorMsg && <div className="field__error">{errorMsg}</div>}
          {okMsg && <div className="badge badge--success">{okMsg}</div>}

          {/* Actions styled like BOQ buttons row */}
          <div className="boq-actions" style={{ justifyContent: "flex-end" }}>
            <button className="btn btn--primary" type="submit" disabled={busy}>
              {mode === "create"
                ? busy
                  ? "Creating…"
                  : "Create Item"
                : busy
                ? "Updating…"
                : "Update Item"}
            </button>
            {mode === "edit" && (
              <button
                type="button"
                className="btn"
                onClick={onCancelEdit}
                disabled={busy}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ===== SECTION B: Items (match BOQ items section) ===== */}
      <div className="boq-section boq-section--items" style={{ marginTop: 18 }}>
        <div className="boq-section__title">Items</div>

        {/* Search + tools same toolbar look as BOQ */}
        <div className="panel__head" style={{ marginBottom: 10 }}>
          <div
            className="table-toolbar"
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <input
              className="table-toolbar__input"
              placeholder="Search by ID, Name, Unit, or Price…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search Catalog"
            />
            <span className="badge badge--success">
              {filtered.length} items
            </span>
            <button className="btn" onClick={() => refetch()} title="Refresh">
              Refresh
            </button>
          </div>
        </div>

        {isLoading && <div>Loading…</div>}
        {isError && (
          <div className="error">
            Failed to load catalog
            {error?.status ? ` (HTTP ${error.status})` : ""}.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="boq-table" style={{ overflowX: "auto" }}>
            <DataTable
              columns={columns}
              data={filtered}
              customStyles={tableStyles}
              pagination
              highlightOnHover
              persistTableHead
              progressPending={isFetching}
              noDataComponent="No catalog items."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cataloglist;
