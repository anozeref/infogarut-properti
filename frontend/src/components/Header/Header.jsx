import React from 'react';
import styles from './Header.module.css';
import { FaUserCircle } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import logoImage from '../../assets/logo.png';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* ▼▼▼ BAGIAN INI YANG DIUBAH ▼▼▼ */}
        <a
          href="https://infogarut.id"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logo}
        >
          <img src={logoImage} alt="Logo Propertease Infogarut.id" />
        </a>
        {/* ▲▲▲ AKHIR DARI PERUBAHAN ▲▲▲ */}

        <div className={styles.rightSection}>
          <nav className={styles.nav}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Beranda
            </NavLink>
            <NavLink
              to="/properti"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Properti
            </NavLink>
          </nav>

          <Link to="/user" className={styles.userIcon}>
            <FaUserCircle size={28} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;