import React from "react";
import styles from "./FooterAdmin.module.css";

const FooterAdmin = () => {
  // Membuat tahun menjadi dinamis, jadi tidak perlu diubah setiap tahun
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>
        © {currentYear} infogarut Properti • Dashboard Admin
      </p>
    </footer>
  );
};

export default FooterAdmin;