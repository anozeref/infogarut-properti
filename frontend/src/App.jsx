import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DashboardUser from "./pages/user/DashboardUser";

export default function App() {
  return (
    <Router>
      <DashboardAdmin />
      <DashboardUser />
    </Router>
  );
}
