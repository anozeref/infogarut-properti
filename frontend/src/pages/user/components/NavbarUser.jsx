import React, { useState, useRef, useEffect, useContext } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaGlobe,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import styles from "./NavbarUser.module.css";
import logo from "../../../assets/logo.png";

export default function NavbarUser({ darkMode, toggleTheme }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);

  const toggleNotif = () => {
    setShowNotif(!showNotif);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
    setShowNotif(false);
  };

  // ✅ Fungsi logout
  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Yakin mau keluar?",
      text: "Kamu akan keluar dari akun ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
    });

    if (confirm.isConfirmed) {
      logout();
      Swal.fire({
        title: "Berhasil Logout!",
        text: "Kamu telah keluar dari akun.",
        icon: "success",
        confirmButtonColor: "#4f46e5",
      }).then(() => {
        navigate("/"); // 🔙 Kembali ke Landing Page
      });
    }
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
        <Link to="/">
          <img src={logo} alt="Logo" className={styles.logoImg} />
        </Link>
      </div>

      {/* 🌐 Tombol Kembali ke Landing Page */}
      <div className={styles.landingLink}>
        <Link
          to="/"
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
                to="/user/profileuser"
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
                onClick={handleLogout}
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
