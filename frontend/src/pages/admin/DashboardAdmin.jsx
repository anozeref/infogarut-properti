  import React, { useState, createContext, useContext } from "react";
  import { Routes, Route, Navigate } from "react-router-dom";
  import SidebarAdmin from "./components/SidebarAdmin";
  import FooterAdmin from "./components/FooterAdmin";
  import HomeContent from "./content/HomeContent";
  import KelolaPropertiContent from "./content/KelolaPropertiContent";
  import KelolaUserContent from "./content/KelolaUserContent";
  import TambahPropertiContent from "./content/TambahPropertiContent";
  import PengaturanContent from "./content/PengaturanContent";
  import { motion } from "framer-motion";
  import styles from "./DashboardAdmin.module.css";
  import { AuthContext } from "../../context/AuthContext";

  // Context untuk tema dashboard admin
  export const ThemeContext = createContext();

  // Komponen utama Dashboard Admin
  const DashboardAdmin = () => {
    const { user } = useContext(AuthContext);
    const [isHovered, setIsHovered] = useState(false);
    const [theme, setTheme] = useState("light");

    // Cek autentikasi admin
    if (!user || user.role !== "admin") {
      return <Navigate to="/login" replace />;
    }

    // Toggle tema light/dark
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
                <Route path="pengaturan" element={<PengaturanContent />} />
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