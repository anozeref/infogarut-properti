// FooterAdmin.jsx
import React, { useContext } from "react";
import styles from "./FooterAdmin.module.css";
import { ThemeContext } from "../DashboardAdmin";

const FooterAdmin = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer
      className={styles.footer}
      style={{
        backgroundColor: theme === "dark" ? "#1f1f1f" : "#f8f9fa",
        color: theme === "dark" ? "#f1f1f1" : "#333",
      }}
    >
      <small>© 2025 infogarut Properti | Admin Panel</small>
    </footer>
  );
};

export default FooterAdmin;
