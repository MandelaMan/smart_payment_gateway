import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import QuickActions from "../../components/dashboard/QuickActions.jsx";
import StatsGrid from "../../components/dashboard/StatsGrid.jsx";
import SalesChart from "../../components/dashboard/SalesChart.jsx";
import CustomerInsights from "../../components/dashboard/CustomerInsights.jsx";
import Promotions from "../../components/dashboard/Promotions.jsx";

// import { useSelector } from "react-redux";
// import {
//   selectUser,
//   selectIsAuthenticated,
//   selectRoleId,
//   selectFullName,
// } from "../../redux/auth/authSlice";

const Products = () => {
  // const user = useSelector(selectUser); // full user object
  // const isAuthed = useSelector(selectIsAuthenticated); // boolean
  // const roleId = useSelector(selectRoleId); // number or null
  // const fullName = useSelector(selectFullName); // string

  return (
    <DashboardLayout>
      <div className="page-head">
        <h1>Products</h1>
      </div>
    </DashboardLayout>
    // <div>
    //   {isAuthed ? (
    //     <>
    //       <span>Hello, {fullName || user.email}</span>
    //       <small> (role_id: {roleId})</small>
    //     </>
    //   ) : (
    //     <span>Not signed in</span>
    //   )}
    // </div>
  );
};

export default Products;
