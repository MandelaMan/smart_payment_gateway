import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { ROLES } from "./utils/roles.js";

import Login from "./pages/auth/Login.jsx";
import Customer from "./pages/dashboard/Customer.jsx";
import Shareholder from "./pages/dashboard/Shareholder.jsx";
import Admin from "./pages/dashboard/Admin.jsx";
import Staff from "./pages/dashboard/Staff.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Products from "./pages/sharedpages/Products.jsx";
import BOQPage from "./features/boq/BOQPage.jsx";

// Public root: show Login. If you want a separate /login, just change the path.
const publicRoutes = [{ path: "/", element: <Login /> }];

// Admin-only
const adminRoutes = [
  {
    element: <PrivateRoute allowed={[ROLES.ADMIN]} />,
    children: [{ path: "/dashboard", element: <Admin /> }],
  },
];

// Customer-only
const customerRoutes = [
  {
    element: <PrivateRoute allowed={[ROLES.CUSTOMER]} />,
    children: [{ path: "/dashboard/customer", element: <Customer /> }],
  },
];

// Shareholder-only
const shareholderRoutes = [
  {
    element: <PrivateRoute allowed={[ROLES.SHAREHOLDER]} />,
    children: [{ path: "/dashboard/shareholder", element: <Shareholder /> }],
  },
];

// Staff-only (uncomment if you add the page)

const staffRoutes = [
  {
    element: <PrivateRoute allowed={[ROLES.STAFF]} />,
    children: [{ path: "/dashboard/staff", element: <Staff /> }],
  },
];

const adminStaffRoutes = [
  {
    element: <PrivateRoute allowed={[ROLES.ADMIN, ROLES.STAFF]} />,
    children: [{ path: "/generate-boq", element: <BOQPage /> }],
  },
];

// Example of a route shared by ALL logged-in roles (just use allowed = [])
const sharedProtectedRoutes = [
  {
    element: <PrivateRoute allowed={[]} />, // any authenticated user
    children: [{ path: "/products", element: <Products /> }],
  },
];

const fallbackRoutes = [
  { path: "/404", element: <PageNotFound /> },
  { path: "*", element: <Navigate to="/404" replace /> },
];

const router = createBrowserRouter([
  ...publicRoutes,
  ...adminRoutes,
  ...customerRoutes,
  ...shareholderRoutes,
  ...adminStaffRoutes,
  ...staffRoutes,
  ...sharedProtectedRoutes,
  ...fallbackRoutes,
]);

const App = () => <RouterProvider router={router} />;
export default App;
