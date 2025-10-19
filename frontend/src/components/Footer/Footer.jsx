// src/components/Footer/Footer.jsx
import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const hideHeaderRoutes = ["/login", "/register"];
  if (hideHeaderRoutes.includes(location.pathname)) {
    return null;
  }
  return (
    <footer className={styles.footer}>
      <p>© 2025 Propertease. Hak cipta dilindungi undang-undang.</p>
      <p className={styles.subtext}>Rumah Impian Anda Menanti</p>
    </footer>
  );
};

export default Footer;