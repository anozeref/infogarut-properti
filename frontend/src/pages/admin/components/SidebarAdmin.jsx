// src/pages/admin/components/SidebarAdmin.jsx
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
// Perhatikan: FaCog tetap diimpor karena kita akan menggunakannya di bagian bawah
import { FaHome, FaBuilding, FaUsers, FaPlus, FaCog, FaArrowLeft, FaSun, FaMoon } from "react-icons/fa"; 
import { motion } from "framer-motion";
import styles from "./SidebarAdmin.module.css";
import { ThemeContext } from "../DashboardAdmin";

const SidebarAdmin = ({ isHovered, setIsHovered }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Daftar menu utama (Hanya Aksi Harian)
  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <FaHome /> },
    { path: "/admin/properti", label: "Kelola Properti", icon: <FaBuilding /> },
    { path: "/admin/user", label: "Kelola User", icon: <FaUsers /> },
    { path: "/admin/tambah", label: "Tambah Properti", icon: <FaPlus /> },
    // ❗ MENU PENGATURAN DIHAPUS DARI SINI ❗
  ];

  // Logic untuk menentukan apakah tombol Pengaturan sedang aktif
  const isPengaturanActive = location.pathname.startsWith("/admin/pengaturan");

  const handleBackToLanding = () => (window.location.href = "/");

  return (
    <motion.aside
      className={styles.sidebar}
      initial={{ width: 72 }}
      animate={{ width: isHovered ? 220 : 72 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* SECTION ATAS: Menu Utama */}
      <div className={styles.menuSection}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.menuItem} ${
              location.pathname === item.path ? styles.active : ""
            }`}
            title={item.label}
          >
            <span className={styles.icon}>{item.icon}</span>
            <motion.span
              className={styles.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {item.label}
            </motion.span>
          </Link>
        ))}
      </div>

      {/* SECTION BAWAH: Pengaturan & Utility */}
      <div className={styles.bottomSection}>
        
        {/* 1. TOMBOL PENGATURAN (Dipindahkan ke sini) */}
        <Link
          to="/admin/pengaturan"
          className={`${styles.menuItem} ${isPengaturanActive ? styles.active : ""}`}
          title="Pengaturan"
        >
          <span className={styles.icon}><FaCog /></span>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            Pengaturan
          </motion.span>
        </Link>

        {/* 2. TOMBOL DARK/LIGHT MODE */}
        <button onClick={toggleTheme} className={styles.menuItem} title={theme === "light" ? "Dark Mode" : "Light Mode"}>
          <span className={styles.icon}>{theme === "light" ? <FaMoon /> : <FaSun />}</span>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </motion.span>
        </button>

        {/* 3. TOMBOL KEMBALI */}
        <button onClick={handleBackToLanding} className={styles.menuItem} title="Kembali ke Landing">
          <span className={styles.icon}><FaArrowLeft /></span>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            Kembali
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
};

export default SidebarAdmin;