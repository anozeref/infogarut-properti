// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import Properti from './pages/Properti/Properti.jsx';
import PropertiDetail from './pages/PropertiDetail/PropertiDetail.jsx';
import DashboardAdmin from './pages/admin/DashboardAdmin.jsx';
import DashboardUser from './pages/user/DashboardUser.jsx'; // <--- import baru
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const router = createBrowserRouter([
  // 🌐 Area publik (user)
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "properti", element: <Properti /> },
      { path: "properti/:id", element: <PropertiDetail /> },
    ],
  },

  // 🧭 Area admin
  {
    path: "/admin/*",
    element: <DashboardAdmin />,
  },

  // 🧭 Area user
  {
    path: "/user/*", // <-- gunakan wildcard agar route internal DashboardUser aktif
    element: <DashboardUser />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
