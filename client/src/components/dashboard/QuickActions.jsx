import React from "react";

/**
 * Reusable QuickActions
 * props:
 * - items: Array<{ id, title, desc, icon?, onClick? }>
 * - activeId?: string  (for highlighting the selected action)
 * - onAction?: (id) => void
 * - columns?: number   (grid columns, default 4)
 */
const QuickActions = ({ items = [], activeId, onAction, columns = 4 }) => {
  return (
    <div
      className="quick-actions"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {items.map((i, idx) => {
        const isActive = i.id === activeId;
        const handle = () => {
          if (i.onClick) i.onClick(i.id);
          if (onAction) onAction(i.id);
        };
        return (
          <button
            className={`quick-actions__item i-${idx} ${
              isActive ? "is-active" : ""
            }`}
            key={i.id}
            type="button"
            aria-pressed={isActive}
            onClick={handle}
            title={i.title}
          >
            <div className="quick-actions__title">
              {/* {i.icon ? <span style={{ marginRight: 8 }}>{i.icon}</span> : null} */}
              {i.title}
            </div>
            {i.desc ? (
              <div className="quick-actions__desc">{i.desc}</div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;
