import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBuilding, FaUsers, FaPlus, FaTools, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "./SidebarAdmin.module.css";

const SidebarAdmin = ({ isHovered, setIsHovered }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <FaHome /> },
    { path: "/admin/properti", label: "Kelola Properti", icon: <FaBuilding /> },
    { path: "/admin/user", label: "Kelola User", icon: <FaUsers /> },
    { path: "/admin/tambah", label: "Tambah Properti", icon: <FaPlus /> },
    { path: "/admin/kelola", label: "Kelola Properti Admin", icon: <FaTools /> },
  ];

  const handleBackToLanding = () => (window.location.href = "/");

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{ width: isHovered ? 220 : 80 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={styles.sidebar}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.menuSection}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.menuItem} ${
              location.pathname === item.path ? styles.active : ""
            }`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <motion.span
              className={styles.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.span>
          </Link>
        ))}
      </div>

      <div className={styles.bottomSection}>
        <button onClick={handleBackToLanding} className={styles.menuItem}>
          <span className={styles.icon}><FaArrowLeft /></span>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.2 }}
          >
            Kembali ke Landing
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
};

export default SidebarAdmin;
