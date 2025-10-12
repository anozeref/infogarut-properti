import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import styles from "./CardProperty.module.css";

export default function CardProperty({
  image,
  type,
  title,
  location,
  price,
  desc,
  darkMode,
  status, // ✅ Tambahan: status = "pending" | "aktif" | "ditolak"
}) {
  const [isHovered, setIsHovered] = useState(false);
  const fallbackImage =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=60";

  // 🎨 Warna badge berdasarkan status
  const getStatusBadgeStyle = () => {
    if (status === "pending") {
      return {
        backgroundColor: isHovered ? "#facc15" : "#fbbf24",
        text: "⏳ Menunggu Persetujuan",
      };
    }
    if (status === "aktif") {
      return {
        backgroundColor: isHovered ? "#16a34a" : "#22c55e",
        text: "✅ Aktif",
      };
    }
    if (status === "ditolak") {
      return {
        backgroundColor: isHovered ? "#dc2626" : "#ef4444",
        text: "❌ Ditolak",
      };
    }
    return null;
  };

  const badgeStyle = getStatusBadgeStyle();

  return (
    <div
      className={`${styles.card} ${darkMode ? styles.dark : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.3s ease",
        boxShadow: isHovered
          ? "0 8px 20px rgba(0,0,0,0.25)"
          : "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div className={styles.imageWrapper}>
        <img
          src={image || fallbackImage}
          alt={title || "Gambar Properti"}
          loading="lazy"
          onError={(e) => (e.target.src = fallbackImage)}
          className={styles.image}
        />
      </div>

      {/* 🟡 Status Badge (nempel di pojok kanan atas) */}
      {badgeStyle && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: badgeStyle.backgroundColor,
            color: "#fff",
            fontWeight: "bold",
            padding: "6px 10px",
            borderRadius: "8px",
            fontSize: "0.8rem",
            boxShadow: isHovered
              ? "0 4px 10px rgba(0,0,0,0.3)"
              : "0 2px 6px rgba(0,0,0,0.2)",
            transition: "all 0.25s ease",
          }}
        >
          {badgeStyle.text}
        </div>
      )}

      <div className={styles.cardBody}>
        {type && (
          <span
            className={`${styles.badge} ${darkMode ? styles.badgeDark : ""}`}
          >
            {type}
          </span>
        )}

        <h3 className={styles.cardTitle}>{title}</h3>

        {location && (
          <p className={styles.cardLocation}>
            <FaMapMarkerAlt className={styles.icon} /> {location}
          </p>
        )}

        {price && (
          <p className={styles.cardPrice}>
            <FaMoneyBillWave className={styles.icon} /> {price}
          </p>
        )}

        {desc && <p className={styles.cardDesc}>{desc}</p>}

        <div className={styles.cardActions}>
          <button
            className={`${styles.editBtn} ${
              darkMode ? styles.editBtnDark : ""
            }`}
            title="Edit properti"
          >
            <FaEdit />
          </button>
          <button
            className={`${styles.deleteBtn} ${
              darkMode ? styles.deleteBtnDark : ""
            }`}
            title="Hapus properti"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
