import React from "react";
import styles from "./FooterAdmin.module.css";

const FooterAdmin = () => {
  return (
    <footer className={`text-center py-3 bg-light border-t ${styles.footer}`}>
      <small>© 2025 infogarut Properti | Admin Panel</small>
    </footer>
  );
};

export default FooterAdmin;
