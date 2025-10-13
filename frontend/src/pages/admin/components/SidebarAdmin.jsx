import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBuilding, FaUsers, FaPlus, FaArrowLeft, FaSun, FaMoon } from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "./SidebarAdmin.module.css";
import { ThemeContext } from "../DashboardAdmin"; // pastikan path benar

const SidebarAdmin = ({ isHovered, setIsHovered }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <FaHome /> },
    { path: "/admin/properti", label: "Kelola Properti", icon: <FaBuilding /> },
    { path: "/admin/user", label: "Kelola User", icon: <FaUsers /> },
    { path: "/admin/tambah", label: "Tambah Properti", icon: <FaPlus /> },
  ];

  const handleBackToLanding = () => (window.location.href = "/");

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{ width: isHovered ? 220 : 80 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`${styles.sidebar} ${theme === "dark" ? styles.dark : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Menu Items */}
      <div className={styles.menuSection}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.menuItem} ${location.pathname === item.path ? styles.active : ""}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <motion.span
              className={styles.label}
              style={{ whiteSpace: "normal", wordBreak: "break-word" }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.span>
          </Link>
        ))}
      </div>

      {/* Bottom Section: Theme + Back */}
      <div className={styles.bottomSection}>
        {/* Light/Dark Theme */}
        <button
          onClick={toggleTheme}
          className={styles.menuItem}
          style={{
            backgroundColor: theme === "dark" ? "#2a2a3a" : "transparent",
            color: theme === "dark" ? "#f1f1f1" : "inherit",
          }}
        >
          <span className={styles.icon}>{theme === "light" ? <FaMoon /> : <FaSun />}</span>
          <motion.span
            className={styles.label}
            style={{ whiteSpace: "normal", wordBreak: "break-word" }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </motion.span>
        </button>

        {/* Back to Landing */}
<button
  onClick={handleBackToLanding}
  className={styles.menuItem}
  style={{
    backgroundColor: theme === "dark" ? "#2a2a3a" : "transparent",
    color: theme === "dark" ? "#f1f1f1" : "inherit",
  }}
>
  <span className={styles.icon}><FaArrowLeft /></span>
  <motion.span
    className={styles.label}
    style={{ whiteSpace: "normal", wordBreak: "break-word" }}
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
