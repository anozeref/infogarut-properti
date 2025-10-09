// import React from "react";

// export default function App() {
//   return (
//     <>
    
//     </>
//   );
// }

import React from "react";
import DashboardUser from "./pages/user/DashboardUser";

function App() {
  return <DashboardUser />;
import { BrowserRouter as Router } from "react-router-dom";
import DashboardAdmin from "./pages/admin/DashboardAdmin";

export default function App() {
  return (
    <Router>
      <DashboardAdmin />
    </Router>
  );
}

export default App;

