import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import "../../styles/dashboard.scss";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <Sidebar />
      </aside>

      <main className="app-shell__main">
        <Topbar />
        <div className="app-shell__content">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
