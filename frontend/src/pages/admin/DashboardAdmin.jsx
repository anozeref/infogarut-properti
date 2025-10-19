import React, { useState, createContext, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SidebarAdmin from "./components/SidebarAdmin";
import FooterAdmin from "./components/FooterAdmin";
import HomeContent from "./content/HomeContent";
import KelolaPropertiContent from "./content/KelolaPropertiContent";
import KelolaUserContent from "./content/KelolaUserContent";
import TambahPropertiContent from "./content/TambahPropertiContent";
import PengaturanContent from "./content/PengaturanContent"; // 👈 1. TAMBAHKAN IMPORT INI
import { motion } from "framer-motion";
import styles from "./DashboardAdmin.module.css";
import { AuthContext } from "../../context/AuthContext";

export const ThemeContext = createContext();

const DashboardAdmin = () => {
  const { user } = useContext(AuthContext);
  const [isHovered, setIsHovered] = useState(false);
  const [theme, setTheme] = useState("light");

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`${styles.dashboardContainer}`} data-theme={theme}>
        <motion.div
          className={styles.dashboardWrapper}
          animate={{ "--sidebar-width": isHovered ? "220px" : "72px" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <SidebarAdmin isHovered={isHovered} setIsHovered={setIsHovered} />

          <main className={styles.mainContent}>
            <Routes>
              <Route index element={<HomeContent />} />
              <Route path="properti" element={<KelolaPropertiContent />} />
              <Route path="user" element={<KelolaUserContent />} />
              <Route path="tambah" element={<TambahPropertiContent />} />
              <Route path="pengaturan" element={<PengaturanContent />} /> {/* 👈 2. TAMBAHKAN ROUTE INI */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <FooterAdmin />
          </main>
        </motion.div>
      </div>
    </ThemeContext.Provider>
  );
};

export default DashboardAdmin;