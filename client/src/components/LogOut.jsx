import React from "react";
import { useLogoutMutation } from "../redux/api/apiSlice"; // adjust the path
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  const [logout, { isLoading, isError }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap(); // triggers the mutation
      // Redirect after logout
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    // <button
    //   onClick={handleLogout}
    //   disabled={isLoading}
    //   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
    // >
    //   {isLoading ? "Logging out..." : "Logout"}
    //   {isError && <span className="ml-2 text-sm text-red-200">Error</span>}
    // </button>

    <button
      className="dropdown__item"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <FiLogOut className="icon" />
      {isLoading ? "Logging out..." : "Logout"}
      {isError && <span className="ml-2 text-sm text-red-200">Error</span>}
    </button>
  );
};

export default LogoutButton;
