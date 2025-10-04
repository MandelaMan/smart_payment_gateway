import React from "react";

/** Simple SVG bar chart (no external libs) */
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const values = [
  2800, 5200, 6100, 9800, 8700, 6400, 3300, 7200, 5600, 10300, 9100, 2900,
];

const SalesChart = () => {
  const max = Math.max(...values);
  const height = 180;
  const width = 640;
  const barW = width / months.length - 8;

  return (
    <div className="panel">
      <div className="panel__head">
        <div className="panel__title">Sales Analytics</div>
        <div className="seg">
          <button className="seg__btn">Daily</button>
          <button className="seg__btn">Weekly</button>
          <button className="seg__btn is-active">Monthly</button>
        </div>
      </div>

      <svg
        className="chart"
        viewBox={`0 0 ${width} ${height + 40}`}
        role="img"
        aria-label="Monthly sales bar chart"
      >
        {values.map((v, i) => {
          const h = (v / max) * height;
          const x = i * (width / months.length) + 4;
          const y = height - h + 10;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="8"
                className="chart__bar"
              />
              <text
                x={x + barW / 2}
                y={height + 30}
                textAnchor="middle"
                className="chart__label"
              >
                {months[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default SalesChart;
