import React from "react";
import styles from "./NavbarAdmin.module.css";

const NavbarAdmin = () => {
  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>infogarut Properti - Admin Panel</h1>
      <div className={styles.profile}>Admin</div>
    </nav>
  );
};

export default NavbarAdmin;
