import React from "react";
import styles from "./SidebarAdmin.module.css";

const SidebarAdmin = ({ activePage, setActivePage }) => {
  const handleBackToLanding = () => {
    navigate("/"); // arahkan ke Landing.jsx (route "/")
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.menuSection}>
        <ul>
          <li
            className={activePage === "home" ? styles.active : ""}
            onClick={() => setActivePage("home")}
          >
            🏠 Dashboard
          </li>
          <li
            className={activePage === "properti" ? styles.active : ""}
            onClick={() => setActivePage("properti")}
          >
            🏘 Kelola Properti
          </li>
          <li
            className={activePage === "user" ? styles.active : ""}
            onClick={() => setActivePage("user")}
          >
            👥 Kelola User
          </li>
        </ul>
      </div>

      <div className={styles.bottomSection}>
        <li className={styles.back} onClick={handleBackToLanding}>
          ↩️ Kembali ke Landing
        </li>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
