import React from "react";

const templates = [
  {
    id: "T-Residential",
    name: "Residential Core BOQ",
    lines: 24,
    note: "Walls, floors, roofing, finishes",
  },
  {
    id: "T-Commercial",
    name: "Commercial Fit-out",
    lines: 18,
    note: "Partitions, electrical, HVAC, finishes",
  },
];

const BOQTemplates = ({ onUseTemplate }) => {
  return (
    <div>
      <div className="panel__head" style={{ marginBottom: 10 }}>
        <div className="panel__title">Templates</div>
      </div>

      <div className="grid-12">
        {templates.map((t) => (
          <div className="panel col-4" key={t.id}>
            <div className="panel__title">{t.name}</div>
            <div className="muted small">{t.lines} line items</div>
            <p style={{ marginTop: 8 }}>{t.note}</p>
            <button
              className="btn btn--primary"
              onClick={() => onUseTemplate?.(t.id)}
            >
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BOQTemplates;
