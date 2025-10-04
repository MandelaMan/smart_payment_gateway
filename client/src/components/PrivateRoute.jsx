import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "../redux/api/apiSlice";
import { ROLES, homeForRole } from "../utils/roles";

export default function PrivateRoute({ allowed = [] }) {
  const persistedUser = useSelector((s) => s.auth.user);
  const {
    data: freshUser,
    isFetching,
    isError,
  } = useGetMeQuery(undefined, { skip: !!persistedUser });
  const user = persistedUser || freshUser;
  const location = useLocation();

  if (isFetching && !user) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!user || isError)
    return <Navigate to="/" replace state={{ from: location }} />;

  // Admin can access everything; empty `allowed` means any logged-in user
  const roleOk =
    user.role_id === ROLES.ADMIN ||
    allowed.length === 0 ||
    allowed.includes(user.role_id);
  if (!roleOk) return <Navigate to={homeForRole(user.role_id)} replace />;

  return <Outlet />;
}
