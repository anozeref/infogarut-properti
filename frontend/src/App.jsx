import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import DashboardAdmin from "./pages/admin/DashboardAdmin";

export default function App() {
  return (
    <Router>
      <DashboardAdmin />
    </Router>
  );
}
