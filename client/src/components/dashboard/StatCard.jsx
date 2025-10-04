const StatCard = ({ title, value, sub, trend = 0 }) => {
  const sign = trend > 0 ? "+" : trend < 0 ? "−" : "";
  const color = trend > 0 ? "up" : trend < 0 ? "down" : "flat";

  return (
    <div className="stat">
      <div className="stat__title">{title}</div>
      <div className="stat__value">{value}</div>
      <div className={`stat__trend stat__trend--${color}`}>
        {sign}
        {Math.abs(trend)}% <span className="muted">This month</span>
      </div>
      {sub ? <div className="stat__sub">{sub}</div> : null}
    </div>
  );
};

export default StatCard;
