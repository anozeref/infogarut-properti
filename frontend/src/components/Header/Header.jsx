import React from "react";
import styles from "./Header.module.css";
import { FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo.png";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (!user) navigate("/login");
    else if (user.role === "admin") navigate("/admin");
    else if (user.role === "user") navigate("/user");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          href="https://infogarut.id"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logo}
        >
          <img src={logoImage} alt="Logo Propertease Infogarut.id" />
        </a>

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

          <button
            onClick={handleUserClick}
            className={styles.userIcon}
            title={user ? user.name : "Masuk"}
          >
            <FaUserCircle size={28} />
          </button>

          {user && (
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Keluar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
