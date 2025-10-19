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
import { io } from "socket.io-client";

// === Hubungkan ke server backend (pastikan port-nya benar) ===
const SOCKET_URL = "http://localhost:3005"; 
const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

export default function NavbarUser({ darkMode, toggleTheme }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Toggle Notifikasi & Profile
  const toggleNotif = () => {
    setShowNotif(!showNotif);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
    setShowNotif(false);
  };

  // Logout
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
      }).then(() => navigate("/"));
    }
  };

  // Tutup dropdown jika klik di luar
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

  // Socket.IO setup
  useEffect(() => {
    if (!user?.id) return;

    // Join room khusus user
    socket.emit("joinUserRoom", user.id);
    console.log("👤 Join room user:", user.id);

    // Connected
    socket.on("connect", () => {
      console.log("🟢 Socket.IO connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Gagal konek ke Socket.IO:", err.message);
    });

    // Event notifikasi properti update
    socket.on("propertyStatusUpdated", (data) => {
      console.log("📢 Event propertyStatusUpdated:", data);
      if (String(data.ownerId) === String(user.id)) {
        const msg =
          data.statusPostingan === "approved"
            ? `✅ Properti "${data.namaProperti}" telah disetujui admin.`
            : `❌ Properti "${data.namaProperti}" ditolak atau diubah admin.`;
        setNotifications((prev) => [{ message: msg, time: new Date() }, ...prev]);
      }
    });

    // Event notifikasi upload baru
    socket.on("notif_upload", (data) => {
      console.log("📢 Event notif_upload:", data);
      const msg = data.message || `${data.files?.length || 0} file baru diupload.`;
      setNotifications((prev) => [{ message: msg, time: new Date() }, ...prev]);
    });

    // Event tambahan global (opsional)
    socket.on("notif_property_approved", (data) => {
      if (String(data.ownerId) === String(user.id)) {
        const msg = `✅ Properti "${data.namaProperti}" disetujui!`;
        setNotifications((prev) => [{ message: msg, time: new Date() }, ...prev]);
      }
    });

    socket.on("notif_property_rejected", (data) => {
      if (String(data.ownerId) === String(user.id)) {
        const msg = `❌ Properti "${data.namaProperti}" ditolak!`;
        setNotifications((prev) => [{ message: msg, time: new Date() }, ...prev]);
      }
    });

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("propertyStatusUpdated");
      socket.off("notif_upload");
      socket.off("notif_property_approved");
      socket.off("notif_property_rejected");
    };
  }, [user]);

  return (
    <nav className={`${styles.navbar} ${darkMode ? styles.dark : ""}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="Logo" className={styles.logoImg} />
        </Link>
      </div>

      {/* Tombol Kembali ke Landing Page */}
      <div className={styles.landingLink}>
        <Link
          to="/"
          className={`${styles.landingBtn} ${darkMode ? styles.landingBtnDark : ""}`}
        >
          <FaGlobe className={styles.landingIcon} /> Kembali ke Landing Page
        </Link>
      </div>

      {/* Bagian kanan */}
      <div className={styles.navbarRight}>
        {/* 🔔 Notifikasi */}
        <div className={styles.notif} ref={notifRef}>
          <button className={styles.notifBtn} onClick={toggleNotif}>
            <FaBell size={20} />
            {notifications.length > 0 && (
              <span className={styles.notifBadge}>{notifications.length}</span>
            )}
          </button>

          {showNotif && (
            <div className={`${styles.notifBox} ${darkMode ? styles.notifBoxDark : ""}`}>
              {notifications.length === 0 ? (
                <p className={styles.emptyNotif}>Tidak ada notifikasi baru</p>
              ) : (
                notifications.map((notif, i) => (
                  <p key={i} className={styles.notifItem}>
                    {notif.message}
                    <br />
                    <small>{new Date(notif.time).toLocaleTimeString("id-ID")}</small>
                  </p>
                ))
              )}
            </div>
          )}
        </div>

        {/* 🌙 Tema */}
        <button className={styles.themeBtn} onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* 👤 Profil */}
        <div className={styles.userLogo} ref={profileRef}>
          <FaUserCircle size={28} onClick={toggleProfile} />
          {showProfile && (
            <div className={`${styles.profileBox} ${darkMode ? styles.profileBoxDark : ""}`}>
              <Link
                to="/user/profileuser"
                className={`${styles.settingBtn} ${darkMode ? styles.settingBtnDark : ""}`}
              >
                <FaCog className={styles.settingIcon} /> Pengaturan Akun
              </Link>

              <button
                className={`${styles.settingBtn} ${darkMode ? styles.settingBtnDark : ""}`}
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
