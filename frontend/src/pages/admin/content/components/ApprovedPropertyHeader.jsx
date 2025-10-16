// src/pages/admin/content/components/ApprovedPropertyHeader.jsx
import React from "react";
import styles from "../KelolaPropertiContent.module.css"; // Menggunakan style dari parent

export default function ApprovedPropertyHeader({ count, view, onViewChange }) {
  return (
    <div className={styles.header}>
      <p className={styles.subHeader}>
        Properti Disetujui ({count})
      </p>
      <div className={styles.toggleContainer}>
        <span>User</span>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={view === "admin"}
            onChange={() => onViewChange(view === "user" ? "admin" : "user")}
          />
          <span className={styles.slider}></span>
        </label>
        <span>Admin</span>
      </div>
    </div>
  );
}