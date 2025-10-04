// import { useState, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import QuickActions from "../../components/dashboard/QuickActions.jsx";
import StatsGrid from "../../components/dashboard/StatsGrid.jsx";
import SalesChart from "../../components/dashboard/SalesChart.jsx";
import CustomerInsights from "../../components/dashboard/CustomerInsights.jsx";
import Promotions from "../../components/dashboard/Promotions.jsx";
import BOQBuilder from "../../features/boq/components/BOQBuilder.jsx";
import { FiPlusCircle, FiClock, FiFileText, FiUpload } from "react-icons/fi";

import { useSelector } from "react-redux";
import {
  selectUser,
  // selectIsAuthenticated,
  // selectRoleId,
  // selectFullName,
} from "../../redux/auth/authSlice";

const Staff = () => {
  // const [view, setView] = useState("create"); // 'create' | 'history' | 'templates' | 'import'

  // const actions = useMemo(
  //   () => [
  //     {
  //       id: "create",
  //       title: "User Management",
  //       desc: "Create customer, user, shareholder, pop",
  //       icon: <FiPlusCircle />,
  //     },
  //     {
  //       id: "manage",
  //       title: "Product Management",
  //       desc: "Manage package lists , items, pops,",
  //       icon: <FiClock />,
  //     },
  //     {
  //       id: "subscriptions",
  //       title: "Subscription Management",
  //       desc: "Manage customer disconnections, due dates",
  //       icon: <FiFileText />,
  //     },
  //     {
  //       id: "transactions",
  //       title: "Customer Transactions",
  //       desc: "Manage customer transactions",
  //       icon: <FiUpload />,
  //     },
  //   ],
  //   []
  // );
  const user = useSelector(selectUser); // full user object
  // const isAuthed = useSelector(selectIsAuthenticated); // boolean
  // const roleId = useSelector(selectRoleId); // number or null
  // const fullName = useSelector(selectFullName); // string

  return (
    <DashboardLayout>
      <div className="page-head">
        <h1>Hi, {user.first_name}</h1>
        <p className="muted">
          An overview of hat’s happening at Starlynx Utility Limited
        </p>
      </div>
      {/* <QuickActions
        items={actions}
        activeId={view}
        onAction={setView}
        columns={4}
      /> */}
      <div className="grid-12">
        <div className="col-8">
          <StatsGrid />
          <Promotions />
          <SalesChart />
        </div>
        <div className="col-4">
          <CustomerInsights />
        </div>
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

export default Staff;
