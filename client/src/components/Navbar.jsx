import { useSelector } from "react-redux";
import LogoutButton from "./LogOut"; // adjust path

const NavigationBar = () => {
  const user = useSelector((state) => state.auth.user); // comes from your authSlice

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-800 text-white">
      <nav className="flex items-center gap-4">
        <a href="/" className="hover:underline">
          Home
        </a>
        <a href="/about" className="hover:underline">
          About
        </a>

        {user ? (
          <div className="flex items-center gap-3">
            <LogoutButton />
          </div>
        ) : (
          <a
            href="/login"
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Login
          </a>
        )}
      </nav>
    </header>
  );
};

export default NavigationBar;
