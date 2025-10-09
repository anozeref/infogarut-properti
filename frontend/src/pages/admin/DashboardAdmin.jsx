import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SidebarAdmin from "./components/SidebarAdmin";
import FooterAdmin from "./components/FooterAdmin";
import HomeContent from "./content/HomeContent";
import KelolaPropertiContent from "./content/KelolaPropertiContent";
import KelolaUserContent from "./content/KelolaUserContent";
import TambahPropertiContent from "./content/TambahPropertiContent";
import KelolaPropertiAdminContent from "./content/KelolaPropertiAdminContent";
import { motion } from "framer-motion";
import styles from "./DashboardAdmin.module.css";

const DashboardAdmin = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardWrapper}>
        <SidebarAdmin isHovered={isHovered} setIsHovered={setIsHovered} />

        <motion.main
          className={styles.mainContent}
          animate={{ marginLeft: isHovered ? 220 : 72 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <Routes>
            <Route path="/admin" element={<HomeContent />} />
            <Route path="/admin/properti" element={<KelolaPropertiContent />} />
            <Route path="/admin/user" element={<KelolaUserContent />} />
            <Route path="/admin/tambah" element={<TambahPropertiContent />} />
            <Route path="/admin/kelola" element={<KelolaPropertiAdminContent />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </motion.main>
      </div>

      <FooterAdmin />
    </div>
  );
};

export default DashboardAdmin;
