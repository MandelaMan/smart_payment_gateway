import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
// import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Customer from "./pages/dashboard/Customer.jsx";
import Shareholder from "./pages/dashboard/Shareholder.jsx";
import Admin from "./pages/dashboard/Admin.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/dashboard", element: <Admin /> },
  { path: "/dashboard/customer", element: <Customer /> },
  { path: "/dashboard/shareholder", element: <Shareholder /> },
  { path: "*", element: <PageNotFound /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
