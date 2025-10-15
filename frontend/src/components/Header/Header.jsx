// src/components/Header/Header.jsx
import React, { useContext } from "react";
import styles from "./Header.module.css";
import { FaUserCircle } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo.png";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
    if (!user) navigate("/login");
    else if (user.role === "admin") navigate("/admin");
    else if (user.role === "user") navigate("/user");
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Keluar",
      cancelButtonText: "Batal",
    }).then((res) => {
      if (res.isConfirmed) {
        logout();
        navigate("/"); // redirect ke home
        Swal.fire("Keluar!", "Anda berhasil keluar.", "success");
      }
    });
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
        <a
          href="https://infogarut.id"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logo}
        >
          <img src={logoImage} alt="Logo Propertease Infogarut.id" />
        </a>
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
            
            {/* TAUTAN BLOG BARU DITAMBAHKAN DI SINI */}
            <a
              href="https://infogarut.id"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              Blog
            </a>
            
          </nav>

          <button
            onClick={handleUserClick}
            className={styles.userIcon}
            title={user ? user.nama.split(" ")[0] : "Masuk"}
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