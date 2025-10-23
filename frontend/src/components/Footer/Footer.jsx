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
      <p>© 2025 infogarut Properti. All Rights Reserved.</p>
      <p className={styles.subtext}>Temukan Hunian dan Investasi Terbaik di Garut</p>
    </footer>
  );
};

export default Footer;