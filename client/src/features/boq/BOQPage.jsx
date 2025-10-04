// src/features/boq/BOQPage.jsx
import React, { useState, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import QuickActions from "../../components/dashboard/QuickActions.jsx";
import BOQBuilder from "./components/BOQBuilder.jsx";
import BOQHistory from "./components/BOQHistory.jsx";
import BOQTemplates from "./components/BOQTemplates.jsx";
import BOQImport from "./components/BOQImport.jsx";
import BOQDetail from "./components/BOQDetail.jsx";
import { FiPlusCircle, FiClock, FiFileText, FiUpload } from "react-icons/fi";

import BOQReportAnalytics from "./components/BOQReportAnalytics.jsx";
import Cataloglist from "../catalog/components/CatalogList.jsx";

const BOQPage = () => {
  const [view, setView] = useState("create-boq"); // 'create' | 'history' | 'templates' | 'import' | 'detail'
  const [selectedId, setSelectedId] = useState(null);

  const actions = useMemo(
    () => [
      {
        id: "create-boq",
        title: "Create BOQ",
        desc: "Start a fresh bill of quantities",
        icon: <FiPlusCircle />,
      },
      {
        id: "history",
        title: "View BOQs",
        desc: "Browse and reopen recent BOQs",
        icon: <FiClock />,
      },
      {
        id: "create-item",
        title: "Manage Catalog",
        desc: "Browse, create, update, delete catalog items",
        icon: <FiFileText />,
      },
      {
        id: "boq-report-analytics",
        title: "BOQ Report & Analytics",
        desc: "View cost breakdowns, material usage, and variance reports.",
        icon: <FiFileText />,
      },
    ],
    []
  );

  return (
    <DashboardLayout>
      <div className="page-head">
        <h1>Bill of Quantities</h1>
        <p className="muted">Create, review, and manage BOQs.</p>
      </div>

      {/* QuickActions control page view (detail view is not listed here intentionally) */}
      <QuickActions
        items={actions}
        activeId={view}
        onAction={setView}
        columns={4}
      />

      <div className="panel panel--tight" style={{ marginTop: 12 }}>
        {view === "create-boq" && <BOQBuilder title="Project BOQ" />}
        {view === "history" && (
          <BOQHistory
            onOpen={(id) => {
              setSelectedId(id);
              setView("detail");
            }}
          />
        )}
        {view === "detail" && (
          <BOQDetail
            id={selectedId}
            onBack={() => {
              setView("history");
            }}
          />
        )}
        {view === "create-item" && (
          <Cataloglist onImported={() => setView("history")} />
        )}
        {/* {view === "boq-report-analytics" && (
          <BOQReportAnalytics onOpen={() => setView("history")} />
        )} */}
      </div>
    </DashboardLayout>
  );
};

export default BOQPage;
