import { useState } from "react";

const BOQImport = ({ onImported }) => {
  const [fileName, setFileName] = useState("");
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    // TODO: parse CSV and push to state/DB
  };

  return (
    <div>
      <div className="panel__head" style={{ marginBottom: 10 }}>
        <div className="panel__title">Import BOQ (CSV)</div>
      </div>

      <p className="muted">
        Upload a CSV with headers: <code>ID,Item,Unit,Rate,Qty</code>
      </p>

      <div
        style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}
      >
        <label className="btn">
          <input type="file" accept=".csv" onChange={onFile} hidden />
          Choose CSV
        </label>
        {fileName ? (
          <span>{fileName}</span>
        ) : (
          <span className="muted">No file selected</span>
        )}
        <button
          className="btn btn--primary"
          disabled={!fileName}
          onClick={() => onImported?.()}
        >
          Import
        </button>
      </div>
    </div>
  );
};

export default BOQImport;
