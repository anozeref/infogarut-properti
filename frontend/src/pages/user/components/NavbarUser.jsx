// src/components/NavbarUser/NavbarUser.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaUserCircle, FaSignOutAlt, FaCog, FaGlobe } from "react-icons/fa";
import styles from "./NavbarUser.module.css";
import logo from "../../../assets/logo.png";

export default function NavbarUser() {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleNotif = () => {
    setShowNotif(prev => !prev);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(prev => !prev);
    setShowNotif(false);
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="Logo Propertease Infogarut.id" className={styles.logoImg} />
        </Link>
      </div>

      {/* Tombol Kembali ke Landing Page */}
      <div className={styles.landingLink}>
        <Link to="/" className={styles.landingBtn}>
          <FaGlobe className={styles.landingIcon} /> Kembali ke Landing Page
        </Link>
      </div>

      {/* Bagian kanan: notifikasi & profil */}
      <div className={styles.navbarRight}>
        {/* Notifikasi */}
        <div className={styles.notif}>
          <button className={styles.notifBtn} onClick={toggleNotif}>
            <FaBell size={20} />
          </button>
          {showNotif && (
            <div className={styles.notifBox}>
              <p>🏠 Properti kamu disetujui!</p>
              <p>🕓 Properti “Rumah Minimalis” masih ditinjau</p>
              <p>❌ Properti “Villa Lama” ditolak</p>
            </div>
          )}
        </div>

        {/* Profil User */}
        <div className={styles.userLogo} onClick={toggleProfile}>
          <FaUserCircle size={28} />
          {showProfile && (
            <div className={styles.profileBox}>
              <Link to="/user/settings" className={styles.profileItem}>
                <FaCog /> Pengaturan Akun
              </Link>
              <button className={styles.profileItem} onClick={() => console.log("Logout")}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
