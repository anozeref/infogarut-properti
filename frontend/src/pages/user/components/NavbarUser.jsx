import React, { useState } from "react";
import {
  FaBell,
  FaUserCircle,
  FaHome,
  FaSignOutAlt,
  FaCog,
  FaGlobe, // ikon tambahan
} from "react-icons/fa";
import styles from "./NavbarUser.module.css";
import logo from "../assets/logo.png";

export default function NavbarUser() {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleNotif = () => {
    setShowNotif(!showNotif);
    setShowProfile(false); // Tutup dropdown lain
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotif(false);
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <img src={logo} alt="Logo" className={styles.logoImg} />
      </div>

      {/* Tombol Kembali ke Landing Page */}
      <div className={styles.landingLink}>
        <a href="/landing" className={styles.landingBtn}>
          <FaGlobe className={styles.landingIcon} /> Kembali ke Landing Page
        </a>
      </div>

      {/* Bagian kanan (notifikasi & profil) */}
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
              <p>
                <FaCog /> Pengaturan Akun
              </p>
              <p>
                <FaSignOutAlt /> Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
