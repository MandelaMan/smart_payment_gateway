import React from "react";
import StatCard from "./StatCard.jsx";

const StatsGrid = () => {
  return (
    <div className="stats-grid">
      <StatCard title="Total Sales" value="$54,890" trend={12.5} />
      <StatCard title="Orders" value="1,429" trend={8.2} />
      <StatCard title="Average Order Value" value="$38.42" trend={3.1} />
      <StatCard title="Returning Customers" value="68%" trend={2.4} />
      <StatCard title="Cart Abandonment" value="23.8%" trend={-1.8} />
      <StatCard title="Product Views" value="45,210" trend={15.3} />
    </div>
  );
};

export default StatsGrid;
