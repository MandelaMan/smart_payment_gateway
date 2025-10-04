import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiBox,
  FiUsers,
  FiStar,
  FiTag,
  FiBarChart2,
  FiSpeaker,
  FiSettings,
  FiClipboard,
  FiLayers,
} from "react-icons/fi";
import { ROLES } from "../../utils/roles"; // adjust path if needed
// If you already have an auth context, swap this for your hook.
const useRole = () => {
  // EXAMPLE ONLY – replace with your real source of truth
  // e.g. const { user } = useAuth(); return user.role;
  try {
    const r = localStorage.getItem("role");
    return r || ROLES.ADMIN;
  } catch {
    return ROLES.ADMIN;
  }
};

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <FiHome />,
    roles: [],
    end: true,
  },
  {
    to: "/generate-boq",
    label: "Bill of Quantities",
    icon: <FiClipboard />,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    to: "/orders",
    label: "Orders",
    icon: <FiPackage />,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  { to: "/products", label: "Products", icon: <FiBox />, roles: [] }, // shared route in your App.jsx
  {
    to: "/categories",
    label: "Categories",
    icon: <FiLayers />,
    roles: [ROLES.ADMIN],
  },
  {
    to: "/customers",
    label: "Customers",
    icon: <FiUsers />,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    to: "/reviews",
    label: "Reviews",
    icon: <FiStar />,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    to: "/discounts",
    label: "Discounts",
    icon: <FiTag />,
    roles: [ROLES.ADMIN],
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: <FiBarChart2 />,
    roles: [ROLES.ADMIN],
  },
  {
    to: "/marketing",
    label: "Marketing",
    icon: <FiSpeaker />,
    roles: [ROLES.ADMIN],
  },
  { to: "/settings", label: "Settings", icon: <FiSettings />, roles: [] },
];

const Sidebar = () => {
  const role = useRole();

  const canSee = (item) =>
    !item.roles || item.roles.length === 0 || item.roles.includes(role);

  return (
    <div className="sidebar">
      <NavLink to="/dashboard" end className="sidebar__brand">
        Stalynx Utility
      </NavLink>

      <nav className="sidebar__nav" aria-label="Main Navigation">
        {NAV_ITEMS.filter(canSee).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              "sidebar__link" + (isActive ? " is-active" : "")
            }
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span className="sidebar__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar__add-btn" type="button">
        + Add Product
      </button>
    </div>
  );
};

export default Sidebar;
