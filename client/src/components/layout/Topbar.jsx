import { useState } from "react";
import {
  FiBell,
  FiPlusCircle,
  FiChevronDown,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";
import LogoutButton from "../LogOut";
import { useSelector } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
  selectRoleId,
  selectFullName,
} from "../../redux/auth/authSlice";
import { roleText } from "../../utils/roles";

const Topbar = () => {
  const [open, setOpen] = useState(false);

  const user = useSelector(selectUser); // full user object
  const isAuthed = useSelector(selectIsAuthenticated); // boolean
  const roleId = useSelector(selectRoleId); // number or null
  const fullName = useSelector(selectFullName); // string

  return (
    <header className="topbar">
      <div className="topbar__search">
        <input placeholder="Search products, orders, customers…" />
        <button aria-label="Search">
          <FiSearch />
        </button>
      </div>

      <div className="topbar__right">
        <button className="topbar__new">
          <FiPlusCircle className="icon" /> New Order
        </button>

        <button className="topbar__icon" aria-label="Notifications">
          <FiBell className="icon" />
        </button>

        <div className="topbar__user">
          <div className="topbar__avatar" />
          <div className="topbar__meta">
            <div className="topbar__name">{fullName}</div>
            <div className="topbar__role">{roleText(roleId)}</div>
          </div>
          <button
            className="topbar__chev"
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
          >
            <FiChevronDown className="icon" />
          </button>

          {open && (
            <div className="dropdown">
              {/* <button className="dropdown__item">
                <FiLogOut className="icon" />
                Logout
              </button> */}
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
