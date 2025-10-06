import React from 'react';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>INFOGARUT.ID</div>
      <div className={styles.links}>
        <a href="#beranda" className={styles.active}>Beranda</a>
        <a href="#properti">Properti</a>
      </div>
      <div className={styles.userIcon}>👤</div>
    </nav>
  );
}

export default Navbar;