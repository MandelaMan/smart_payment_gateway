import React from "react";

const PromoItem = ({
  title1,
  title2,
  meta,
  status,
  statusKind = "success",
  linkLabel,
  linkHref,
}) => (
  <div className="promo promo--soft">
    <div className="promo__left">
      <div className="promo__title">
        <span>{title1}</span>
        <span>{title2}</span>
      </div>
      <div className="promo__meta">
        {meta.before}{" "}
        {linkLabel ? (
          <a href={linkHref || "#"} className="promo__link">
            {linkLabel}
          </a>
        ) : null}
        {meta.after ? <> · {meta.after}</> : null}
      </div>
    </div>
    <span
      className={`badge ${
        statusKind === "success" ? "badge--success" : "badge--warning"
      }`}
    >
      {status}
    </span>
  </div>
);

const Promotions = () => {
  return (
    <div className="promos panel">
      <div className="panel__title">Active Promotions</div>

      <PromoItem
        title1="Holiday"
        title2="Sale"
        meta={{ before: "Discount Code", after: "294 used" }}
        linkLabel="HOLIDAY20"
        status="Active"
        statusKind="success"
      />

      <PromoItem
        title1="New Customer"
        title2="Welcome"
        meta={{ before: "Email Campaign", after: "89% open rate" }}
        status="Running"
        statusKind="warning"
      />
    </div>
  );
};

export default Promotions;
