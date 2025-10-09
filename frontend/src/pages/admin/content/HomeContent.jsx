import React from "react";
import styles from "./HomeContent.module.css";

const HomeContent = () => {
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
    { id: 1, text: "👤 User Andi mengirim permintaan posting properti." },
    { id: 2, text: "🆕 User Budi telah bergabung." },
    { id: 3, text: "👤 User Citra mengirim permintaan posting properti." },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🏠 Selamat Datang, Admin</h2>
      <p className={styles.subtitle}>📅 Tanggal: {today}</p>

      <hr className={styles.divider} />

      <div className={`${styles.section} ${styles.single}`}>
        <h3>👥 Total User</h3>
        <p className={styles.number}>{data.totalUser}</p>
      </div>

      <hr className={styles.divider} />

      <div className={`${styles.section} ${styles.single}`}>
        <h3>🏘️ Total Properti</h3>
        <p className={styles.number}>{data.totalProperti}</p>
      </div>

      <div className={styles.row}>
        <div className={`${styles.section} ${styles.half}`}>
          <h3>⏳ Properti Pending</h3>
          <p className={styles.number}>{data.propertiPending}</p>
        </div>
        <div className={`${styles.section} ${styles.half}`}>
          <h3>✅ Properti Disetujui</h3>
          <p className={styles.number}>{data.propertiApproved}</p>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.notifications}>
        <h3>🔔 Notifikasi Aktivitas</h3>
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id}>{notif.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomeContent;
