import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaBuilding, FaClock, FaCheckCircle, FaBell } from "react-icons/fa";
import styles from "./HomeContent.module.css";
import { ThemeContext } from "../DashboardAdmin"; // pastikan path benar

const HomeContent = () => {
  const { theme } = useContext(ThemeContext);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const data = {
    totalUser: 6,
    totalProperti: 46,
    propertiPending: 12,
    propertiApproved: 34,
  };

  const notifications = [
    { id: 1, text: "User Andi mengirim permintaan posting properti." },
    { id: 2, text: "User Budi telah bergabung." },
    { id: 3, text: "User Citra mengirim permintaan posting properti." },
  ];

  return (
    <div className={`${styles.container} container-fluid ${theme === "dark" ? "dark" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2>Selamat Datang, Admin</h2>
            <p>{today}</p>
          </div>
        </div>

        {/* Statistik */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className={`${styles.card} shadow-sm`}>
              <FaUsers className={styles.iconUser} />
              <h6>Total User</h6>
              <p className={styles.number}>{data.totalUser}</p>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className={`${styles.card} shadow-sm`}>
              <FaBuilding className={styles.iconProperti} />
              <h6>Total Properti</h6>
              <p className={styles.number}>{data.totalProperti}</p>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className={`${styles.card} shadow-sm`}>
              <FaClock className={styles.iconPending} />
              <h6>Properti Pending</h6>
              <p className={styles.number}>{data.propertiPending}</p>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className={`${styles.card} shadow-sm`}>
              <FaCheckCircle className={styles.iconApproved} />
              <h6>Disetujui</h6>
              <p className={styles.number}>{data.propertiApproved}</p>
            </div>
          </div>
        </div>

        {/* Notifikasi */}
        <div className={`${styles.notifications} shadow-sm`}>
          <div className="d-flex align-items-center mb-2">
            <FaBell className="me-2 text-primary" />
            <h5 className="m-0">Notifikasi Aktivitas</h5>
          </div>
          <ul>
            {notifications.map((notif) => (
              <li key={notif.id}>{notif.text}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeContent;
