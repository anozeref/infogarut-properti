// src/pages/admin/DashboardAdmin.jsx
import React, { useState, createContext, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SidebarAdmin from "./components/SidebarAdmin";
import FooterAdmin from "./components/FooterAdmin";
import HomeContent from "./content/HomeContent";
import KelolaPropertiContent from "./content/KelolaPropertiContent";
import KelolaUserContent from "./content/KelolaUserContent";
import TambahPropertiContent from "./content/TambahPropertiContent";
import { motion } from "framer-motion";
import styles from "./DashboardAdmin.module.css";
import { AuthContext } from "../../context/AuthContext"; // pastikan path benar

export const ThemeContext = createContext();

const DashboardAdmin = () => {
  const { user } = useContext(AuthContext); // ambil data user
  const [isHovered, setIsHovered] = useState(false);
  const [theme, setTheme] = useState("light"); // light | dark

  // Jika bukan admin, redirect ke login
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`${styles.dashboardContainer}`} data-theme={theme}>
        <div className={styles.dashboardWrapper}>
          <SidebarAdmin isHovered={isHovered} setIsHovered={setIsHovered} />

          <motion.main
            className={styles.mainContent}
            animate={{ marginLeft: isHovered ? 220 : 72 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <Routes>
              <Route index element={<HomeContent />} /> {/* path="/" */}
              <Route path="properti" element={<KelolaPropertiContent />} />
              <Route path="user" element={<KelolaUserContent />} />
              <Route path="tambah" element={<TambahPropertiContent />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.main>
        </div>

        <FooterAdmin />
      </div>
    </ThemeContext.Provider>
  );
};

export default DashboardAdmin;
