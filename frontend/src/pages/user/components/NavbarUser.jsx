import React, { useState } from "react";
import styles from "./NavbarUser.module.css";

export default function Navbar() {
  const [notifActive, setNotifActive] = useState(false);

  const toggleNotif = () => {
    setNotifActive(!notifActive);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>🏠 Info Garut Properti</div>
      <div className={styles.navbarRight}>
        <div className={styles.notif}>
          <button className={styles.notifBtn} onClick={toggleNotif}>🔔</button>
          <div
            className={`${styles.notifBox} ${notifActive ? styles.active : ""}`}
          >
            <p>Tidak ada notifikasi baru</p>
          </div>
        </div>
        <div className={styles.userLogo}>U</div>
      </div>
    </div>
  );
}