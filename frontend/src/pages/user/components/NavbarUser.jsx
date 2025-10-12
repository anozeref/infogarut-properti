import React, { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaGlobe,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./NavbarUser.module.css";
import logo from "../assets/logo.png";

export default function NavbarUser({ darkMode, toggleTheme }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const toggleNotif = () => {
    setShowNotif(!showNotif);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotif(false);
  };

  // ✅ Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowNotif(false);
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`${styles.navbar} ${darkMode ? styles.dark : ""}`}>
      {/* 🔷 Logo */}
      <div className={styles.logo}>
        <Link to="/landing">
          <img src={logo} alt="Logo" className={styles.logoImg} />
        </Link>
      </div>

      {/* 🌐 Tombol Kembali ke Landing Page */}
      <div className={styles.landingLink}>
        <Link
          to="/landing"
          className={`${styles.landingBtn} ${
            darkMode ? styles.landingBtnDark : ""
          }`}
        >
          <FaGlobe className={styles.landingIcon} /> Kembali ke Landing Page
        </Link>
      </div>

      {/* 🔔 Bagian kanan navbar */}
      <div className={styles.navbarRight}>
        {/* Notifikasi */}
        <div className={styles.notif} ref={notifRef}>
          <button className={styles.notifBtn} onClick={toggleNotif}>
            <FaBell size={20} />
          </button>
          {showNotif && (
            <div
              className={`${styles.notifBox} ${
                darkMode ? styles.notifBoxDark : ""
              }`}
            >
              <p>🏠 Properti kamu disetujui!</p>
              <p>🕓 Properti “Rumah Minimalis” masih ditinjau</p>
              <p>❌ Properti “Villa Lama” ditolak</p>
            </div>
          )}
        </div>

        {/* 🌙 / ☀️ Tombol Tema */}
        <button className={styles.themeBtn} onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* 👤 Profil */}
        <div className={styles.userLogo} ref={profileRef}>
          <FaUserCircle size={28} onClick={toggleProfile} />
          {showProfile && (
            <div
              className={`${styles.profileBox} ${
                darkMode ? styles.profileBoxDark : ""
              }`}
            >
              {/* 🔧 Pengaturan Akun */}
              <Link
                to="/profileuser"
                className={`${styles.settingBtn} ${
                  darkMode ? styles.settingBtnDark : ""
                }`}
              >
                <FaCog className={styles.settingIcon} /> Pengaturan Akun
              </Link>

              {/* 🚪 Logout */}
              <button
                className={`${styles.settingBtn} ${
                  darkMode ? styles.settingBtnDark : ""
                }`}
                onClick={() => console.log("Logout clicked")}
              >
                <FaSignOutAlt className={styles.settingIcon} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
