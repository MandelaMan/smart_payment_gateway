import React from "react";
import { FiUserPlus, FiAward, FiUsers } from "react-icons/fi";

const StatRow = ({ icon, label, hint, value }) => (
  <div className="ci-stat">
    <div className="ci-stat__icon">{icon}</div>
    <div className="ci-stat__text">
      <div className="ci-stat__label">{label}</div>
      <div className="ci-stat__hint">{hint}</div>
    </div>
    <div className="ci-stat__value">{value}</div>
  </div>
);

const TopCustomer = ({ name, orders, amount, img }) => (
  <div className="ci-top__row">
    <div
      className="ci-top__avatar"
      style={img ? { backgroundImage: `url(${img})` } : {}}
    />
    <div className="ci-top__who">
      <div className="ci-top__name">{name}</div>
      <div className="ci-top__orders">{orders} orders</div>
    </div>
    <div className="ci-top__amount">${amount.toLocaleString()}</div>
  </div>
);

const CustomerInsights = () => {
  return (
    <div className="ci panel">
      <div className="panel__title">Customer Insights</div>

      {/* 3 KPI rows */}
      <div className="ci-stats">
        <StatRow
          icon={<FiUserPlus className="icon" />}
          label="New Customers"
          hint="This week"
          value="15"
        />
        <StatRow
          icon={<FiAward className="icon" />}
          label="VIP Customers"
          hint="Active"
          value="12"
        />
        <StatRow
          icon={<FiUsers className="icon" />}
          label="Total Customers"
          hint="All time"
          value="2,847"
        />
      </div>

      {/* Top customers mini-card */}
      <div className="ci-top">
        <div className="ci-subtitle">Top Customers</div>
        <TopCustomer name="Alice Johnson" orders={24} amount={2340} />
        <TopCustomer name="Robert Smith" orders={19} amount={1980} />
        <TopCustomer name="Maria Garcia" orders={15} amount={1580} />
        <TopCustomer name="Maria Garcia" orders={15} amount={1580} />
        <TopCustomer name="Maria Garcia" orders={15} amount={1580} />
        <TopCustomer name="Maria Garcia" orders={15} amount={1580} />
        <TopCustomer name="Maria Garcia" orders={15} amount={1580} />
      </div>

      {/* Retention */}
      <div className="ci-ret">
        <div className="ci-ret__head">
          <div className="ci-subtitle">Customer Retention</div>
          <div className="ci-ret__pct">60%</div>
        </div>
        <div className="ci-ret__bar">
          <div className="ci-ret__fill" style={{ width: "60%" }} />
        </div>
        <div className="ci-ret__delta">+2.4% from last month</div>
      </div>
    </div>
  );
};

export default CustomerInsights;
