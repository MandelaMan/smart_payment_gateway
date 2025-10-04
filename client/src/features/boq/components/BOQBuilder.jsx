// src/features/boq/components/BOQBuilder.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiPlus, FiTrash2, FiDownload } from "react-icons/fi";

// RTK Query hooks (adjust path if yours differs)
import {
  useCreateBoqMutation,
  useUpdateBoqMutation,
  useGetPopsQuery,
  useGetCatalogQuery,
} from "../../../redux/api/apiSlice";

/* ------------------ Fallbacks (if API has no data) ------------------ */
const fallbackPops = [
  "Enaki",
  "Colosseum",
  "General Mathenge",
  "Kilua",
  "Sandy Shore",
];

const fallbackCatalog = [
  { id: "FIBC", name: "Fiber Optic Cable (1m)", unit: "m", price: 150 },
  { id: "FAT", name: "Fiber Access Terminal (FAT)", unit: "unit", price: 7500 },
  {
    id: "ODF",
    name: "Optical Distribution Frame (ODF)",
    unit: "unit",
    price: 12000,
  },
  { id: "SPC", name: "Fiber Splice Closure", unit: "unit", price: 4500 },
  { id: "PTCH", name: "Fiber Patch Cord (SC/APC)", unit: "pc", price: 500 },
  { id: "SPLT", name: "Fiber Splitter (1:8)", unit: "unit", price: 2000 },
  { id: "ONU", name: "Optical Network Unit (ONU)", unit: "unit", price: 3500 },
  {
    id: "OLT",
    name: "Optical Line Terminal (OLT)",
    unit: "unit",
    price: 250000,
  },
  { id: "RTR", name: "Core Router", unit: "unit", price: 150000 },
  { id: "SWCH", name: "Network Switch (24-Port)", unit: "unit", price: 25000 },
  { id: "ANTN", name: "Outdoor WiFi Antenna", unit: "unit", price: 10000 },
  { id: "RJ45", name: "RJ45 Ethernet Connector", unit: "pc", price: 20 },
  { id: "CAT6", name: "Cat6 Ethernet Cable (1m)", unit: "m", price: 100 },
  {
    id: "PTCHP",
    name: "Ethernet Patch Panel (24-Port)",
    unit: "unit",
    price: 6000,
  },
  {
    id: "MOD",
    name: "TV Modulator (Digital Headend)",
    unit: "unit",
    price: 30000,
  },
  {
    id: "ENC",
    name: "Channel Encoder (Digital Headend)",
    unit: "unit",
    price: 45000,
  },
  {
    id: "MUX",
    name: "Multiplexer (Digital Headend)",
    unit: "unit",
    price: 60000,
  },
  { id: "SRVR", name: "Streaming/Content Server", unit: "unit", price: 120000 },
  { id: "SATR", name: "Satellite Receiver (IRD)", unit: "unit", price: 25000 },
  { id: "RCKM", name: "Rack Mount Cabinet (42U)", unit: "unit", price: 35000 },
  {
    id: "PDU",
    name: "Rack Power Distribution Unit (PDU)",
    unit: "unit",
    price: 8000,
  },
  {
    id: "UPS",
    name: "UPS Backup Power System (3kVA)",
    unit: "unit",
    price: 55000,
  },
  { id: "WIFI", name: "WiFi Router (Dual Band)", unit: "unit", price: 5000 },
  { id: "STB", name: "Set-Top Box (Digital TV)", unit: "unit", price: 4000 },
  { id: "SATD", name: "Satellite Dish (Ku-Band)", unit: "unit", price: 12000 },
  { id: "CMOD", name: "Cable Modem", unit: "unit", price: 7000 },
  { id: "VOIP", name: "VoIP Phone Adapter", unit: "unit", price: 3000 },
  { id: "MIFI", name: "Portable MiFi Router", unit: "unit", price: 6000 },
  {
    id: "WBOX",
    name: "Wall Outlet Box (Fiber Termination)",
    unit: "unit",
    price: 1200,
  },
  { id: "CABT", name: "Cable Ties (Pack)", unit: "pack", price: 300 },
  { id: "CLMP", name: "Drop Cable Clamp", unit: "pc", price: 150 },
  { id: "LDR", name: "Cable Ladder/Tray (1m)", unit: "m", price: 2000 },
];

/* --------------------------- Helpers --------------------------- */
const fmt = (n) =>
  `ksh ${Number(n ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/* Tight table: square corners and less padding */
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

const BOQBuilder = ({ title = "BOQ" }) => {
  /* ------------------- Load POPs & Catalog ------------------- */
  const { data: popsApi } = useGetPopsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: catalogApi } = useGetCatalogQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const pops = popsApi?.length ? popsApi : fallbackPops;
  const catalog = catalogApi?.length ? catalogApi : fallbackCatalog;

  /* ------------------- Form ------------------- */
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      pop: pops[0] ?? "",
      itemId: catalog[0]?.id ?? "",
      qty: 1,
    },
    mode: "onChange",
  });

  // set defaults when data arrives
  useEffect(() => {
    if (pops?.length && !getValues("pop")) {
      setValue("pop", pops[0], { shouldValidate: true });
    }
  }, [pops, setValue, getValues]);

  useEffect(() => {
    if (catalog?.length && !getValues("itemId")) {
      setValue("itemId", catalog[0].id, { shouldValidate: true });
    }
  }, [catalog, setValue, getValues]);

  const name = watch("name");
  const pop = watch("pop");
  const itemId = watch("itemId");

  /* ------------------- Data & mutations ------------------- */
  const [rows, setRows] = useState([]); // { id, name, unit, price, qty }
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // remember created record to update next time (prevents duplicates)
  const [docMeta, setDocMeta] = useState({ id: null, ref: null });

  const [createBoq] = useCreateBoqMutation();
  const [updateBoq] = useUpdateBoqMutation();

  /* ------------------- Combobox state ------------------- */
  const [itemQuery, setItemQuery] = useState("");
  const [openList, setOpenList] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const comboRef = useRef(null);

  const filteredCatalog = useMemo(() => {
    const q = itemQuery.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        String(c.price).includes(q)
    );
  }, [catalog, itemQuery]);

  useEffect(() => {
    const handler = (e) => {
      if (!comboRef.current) return;
      if (!comboRef.current.contains(e.target)) setOpenList(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectItem = (item) => {
    setValue("itemId", item.id, { shouldDirty: true, shouldValidate: true });
    setItemQuery(item.name);
    setOpenList(false);
  };

  useEffect(() => {
    const sel = catalog.find((c) => c.id === itemId);
    if (sel && !openList) setItemQuery(sel.name);
  }, [itemId, catalog, openList]);

  /* ------------------- Item ops ------------------- */
  const findItem = (id) => catalog.find((c) => c.id === id);

  const addItem = ({ itemId, qty }) => {
    let item = findItem(itemId);
    if (!item) {
      item = filteredCatalog[0];
      if (item)
        setValue("itemId", item.id, {
          shouldDirty: true,
          shouldValidate: true,
        });
    }
    const qn = Number(qty || 0);
    if (!item || !(qn > 0)) return;

    setRows((prev) => {
      const existing = prev.find((r) => r.id === item.id);
      if (existing)
        return prev.map((r) =>
          r.id === item.id ? { ...r, qty: Number((r.qty || 0) + qn) } : r
        );
      return [...prev, { ...item, qty: qn }];
    });

    const values = getValues();
    reset({ ...values, qty: 1 }); // keep name/pop/itemId
  };

  const updateQty = (id, qty) => {
    const value = Math.max(0, Number(qty || 0));
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, qty: value } : r))
    );
  };

  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  /* ------------------- Table columns ------------------- */
  const columns = useMemo(
    () => [
      {
        name: "Item",
        selector: (r) => r.name,
        sortable: true,
        wrap: true,
        grow: 3,
        minWidth: "260px",
      },
      { name: "Unit", selector: (r) => r.unit, sortable: true, width: "100px" },
      {
        name: "Rate",
        selector: (r) => r.price,
        sortable: true,
        right: true,
        width: "150px",
        cell: (r) => <>{fmt(r.price)}</>,
      },
      {
        name: "Qty",
        sortable: true,
        right: true,
        width: "140px",
        cell: (r) => (
          <input
            className="table-inline-input"
            style={{ height: 32, padding: "6px 10px" }}
            type="number"
            min="0"
            step="0.01"
            value={r.qty}
            onChange={(e) => updateQty(r.id, e.target.value)}
          />
        ),
      },
      {
        name: "Total",
        right: true,
        width: "170px",
        selector: (r) => r.qty * r.price,
        cell: (r) => <strong>{fmt(r.qty * r.price)}</strong>,
      },
      {
        name: "",
        width: "64px",
        cell: (r) => (
          <button
            className="btn btn--danger"
            style={{ borderRadius: 10 }}
            onClick={() => removeRow(r.id)}
            title="Remove"
          >
            <FiTrash2 className="icon" />
          </button>
        ),
        ignoreRowClick: true,
        button: true,
      },
    ],
    []
  );

  const subtotal = rows.reduce(
    (sum, r) => sum + Number(r.qty) * Number(r.price),
    0
  );

  // Require at least one item with qty > 0
  const hasItems = useMemo(() => rows.some((r) => Number(r.qty) > 0), [rows]);
  const canSave = isValid && hasItems && !saving;

  /* ------------------- Save / Update ------------------- */
  const makeRef = () => `BOQ-${Date.now().toString().slice(-6)}`;

  const makePayload = () => ({
    ref: docMeta.ref ?? makeRef(), // reuse same ref after first save
    title,
    name: name?.trim(),
    pop,
    date: new Date().toISOString().slice(0, 10),
    items: rows
      .filter((r) => Number(r.qty) > 0)
      .map((r) => ({
        id: r.id,
        name: r.name,
        unit: r.unit,
        price: Number(r.price),
        qty: Number(r.qty),
      })),
    total: subtotal,
    itemCount: rows.filter((r) => Number(r.qty) > 0).length,
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = makePayload();

      if (docMeta.id) {
        await updateBoq({ id: docMeta.id, body: payload }).unwrap();
      } else {
        const created = await createBoq(payload).unwrap(); // expect { id, ref, ... }
        if (created?.id)
          setDocMeta({ id: created.id, ref: created.ref || payload.ref });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
      alert("Failed to save BOQ");
    } finally {
      setSaving(false);
    }
  };

  const saveLabel = docMeta.id
    ? saving
      ? "Updating…"
      : "Update BOQ"
    : saving
    ? "Saving…"
    : "Save BOQ";

  /* ------------------- CSV / PDF ------------------- */
  const csvData = [
    ["Title", title],
    ["BOQ Name", name || "-"],
    ["POP", pop || "-"],
    [],
    ["Items"],
    ["ID", "Item", "Unit", "Rate", "Qty", "Total"],
    ...rows.map((r) => [
      r.id,
      r.name,
      r.unit,
      Number(r.price).toFixed(2),
      String(r.qty),
      Number(r.qty * r.price).toFixed(2),
    ]),
    [],
    ["Total", "", "", "", "", Number(subtotal).toFixed(2)],
  ];

  const exportPDF = () => {
    if (!hasItems) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;
    const date = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text(title, pageW / 2, margin, { align: "center" });

    doc.setFontSize(12);
    doc.text(`BOQ Name: ${name || "-"}`, pageW / 2, margin + 18, {
      align: "center",
    });
    doc.text(`POP: ${pop || "-"}`, pageW / 2, margin + 34, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor("#6b7280");
    doc.text(`Generated: ${date}`, pageW - margin, margin + 18, {
      align: "right",
    });
    doc.setTextColor("#000");

    const itemsTitleY = margin + 58;
    doc.setFontSize(13);
    doc.text("Items", pageW / 2, itemsTitleY, { align: "center" });

    const head = [["ID", "Item", "Unit", "Rate", "Qty", "Total"]];
    const body = rows.map((r) => [
      r.id,
      r.name,
      r.unit,
      Number(r.price).toFixed(2),
      String(r.qty),
      Number(r.qty * r.price).toFixed(2),
    ]);

    autoTable(doc, {
      head,
      body,
      startY: itemsTitleY + 10,
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [17, 24, 39] },
      columnStyles: {
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
      },
      theme: "striped",
    });

    const finalY =
      (doc.lastAutoTable && doc.lastAutoTable.finalY) || itemsTitleY + 10;
    let bottomY = pageH - 40;
    if (finalY + 30 > bottomY) {
      doc.addPage();
      bottomY = doc.internal.pageSize.getHeight() - 40;
    }
    doc.setFontSize(12);
    doc.text(`Total: ${Number(subtotal).toFixed(2)}`, pageW / 2, bottomY, {
      align: "center",
    });

    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
  };

  /* ------------------- UI ------------------- */
  return (
    <div className="boq panel panel--tight">
      <div className="panel__head">
        <div className="panel__title">Generate BOQ</div>
      </div>

      {/* ===== SECTION A: Details ===== */}
      <div className="boq-section boq-section--form">
        <div className="boq-section__title">Details</div>

        <div className="boq-form__meta boq-form__meta--inline">
          <label className={`field ${errors.name ? "is-error" : ""}`}>
            <span className="field__label">BOQ Name</span>
            <input
              className="field__input"
              placeholder="e.g., FTTH – Enaki Block A"
              {...register("name", {
                required: "BOQ Name is required",
                minLength: { value: 3, message: "At least 3 characters" },
              })}
            />
            {errors.name && (
              <small className="field__error">{errors.name.message}</small>
            )}
          </label>

          <label className={`field ${errors.pop ? "is-error" : ""}`}>
            <span className="field__label">Point of Presence (POP)</span>
            <select
              className="field__input field__select"
              {...register("pop", { required: "Select a POP" })}
            >
              {pops.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.pop && (
              <small className="field__error">{errors.pop.message}</small>
            )}
          </label>

          <div className="boq-pop-selected">
            <div className="boq-pop-selected__label">Selected POP</div>
            <div className="boq-pop-selected__value">{pop}</div>
          </div>
        </div>

        {/* Add Item Row */}
        <form className="boq-form__add" onSubmit={handleSubmit(addItem)}>
          <div className="field" ref={comboRef}>
            <span className="field__label">Item (type to search)</span>
            <div
              className="boq-item-combobox"
              role="combobox"
              aria-expanded={openList}
            >
              <input
                className="field__input boq-item-input"
                placeholder="Search item…"
                value={itemQuery}
                onChange={(e) => {
                  setItemQuery(e.target.value);
                  setOpenList(true);
                  setHighlight(0);
                }}
                onFocus={() => setOpenList(true)}
                onKeyDown={(e) => {
                  if (!openList) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlight((h) =>
                      Math.min(h + 1, filteredCatalog.length - 1)
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlight((h) => Math.max(h - 1, 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    const choice = filteredCatalog[highlight];
                    if (choice) selectItem(choice);
                  } else if (e.key === "Escape") {
                    setOpenList(false);
                  }
                }}
              />
              {openList && filteredCatalog.length > 0 && (
                <div className="boq-item-list" role="listbox">
                  {filteredCatalog.slice(0, 12).map((opt, idx) => (
                    <button
                      type="button"
                      key={opt.id}
                      className={`boq-item-option ${
                        idx === highlight ? "is-active" : ""
                      }`}
                      onMouseEnter={() => setHighlight(idx)}
                      onClick={() => selectItem(opt)}
                      role="option"
                      aria-selected={idx === highlight}
                      title={`${opt.name} — ${fmt(opt.price)} / ${opt.unit}`}
                    >
                      <div className="boq-item-option__name">{opt.name}</div>
                      <div className="boq-item-option__meta">
                        <span>{opt.id}</span> · <span>{fmt(opt.price)}</span> ·{" "}
                        <span>/{opt.unit}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input type="hidden" {...register("itemId", { required: true })} />
          </div>

          <label className={`field ${errors.qty ? "is-error" : ""}`}>
            <span className="field__label">Quantity</span>
            <input
              className="field__input"
              type="number"
              step="0.01"
              min="0"
              placeholder="Qty"
              {...register("qty", {
                required: "Quantity is required",
                validate: (v) => Number(v) > 0 || "Quantity must be > 0",
              })}
            />
            {errors.qty && (
              <small className="field__error">{errors.qty.message}</small>
            )}
          </label>

          <div className="boq-form__add-btn">
            <button className="btn btn--primary" type="submit">
              <FiPlus className="icon" /> Add
            </button>
          </div>
        </form>

        {!hasItems && (
          <div className="hint muted" style={{ marginTop: 8 }}>
            Add at least one item with a quantity &gt; 0 to enable
            saving/exports.
          </div>
        )}
      </div>

      {/* ===== SECTION B: Items ===== */}
      <div className="boq-section boq-section--items">
        <div className="boq-section__title">Items</div>

        <div className="boq-table" style={{ overflowX: "auto" }}>
          <DataTable
            columns={columns}
            data={rows}
            customStyles={tableStyles}
            pagination
            highlightOnHover
            persistTableHead
            noDataComponent="No items added yet."
          />
        </div>

        <div className="boq-totalbar">
          <div className="boq-totalbar__chip">
            <div className="muted">Subtotal</div>
            <div>
              <strong>{fmt(subtotal)}</strong>
            </div>
          </div>
        </div>

        <div className="boq-actions">
          {/* CSV (disabled if no items) */}
          {hasItems ? (
            <CSVLink
              data={csvData}
              filename={`${title.replace(/\s+/g, "_")}.csv`}
              className="btn btn--ghost"
            >
              <FiDownload className="icon" /> CSV
            </CSVLink>
          ) : (
            <button
              className="btn btn--ghost"
              disabled
              title="Add items to export CSV"
            >
              <FiDownload className="icon" /> CSV
            </button>
          )}

          {/* PDF (disabled if no items) */}
          <button
            className="btn btn--ghost"
            onClick={exportPDF}
            disabled={!hasItems}
            title={!hasItems ? "Add items to export PDF" : "Export PDF"}
          >
            <FiDownload className="icon" /> PDF
          </button>

          {/* SAVE / UPDATE */}
          <button
            className="btn btn--primary"
            onClick={handleSave}
            disabled={!canSave}
            title={
              !hasItems
                ? "Add at least one item with quantity > 0"
                : !isValid
                ? "Fill the required fields"
                : docMeta.id
                ? "Update existing BOQ"
                : "Save BOQ"
            }
          >
            {saveLabel}
          </button>

          {saved && <span className="save-status">Saved ✓</span>}
        </div>
      </div>
    </div>
  );
};

export default BOQBuilder;
