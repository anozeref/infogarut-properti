import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import styles from "./CardProperty.module.css";

export default function CardProperty({
  image,
  type,
  title,
  location,
  price,
  desc,
  darkMode,
  status, // "pending" | "aktif" | "ditolak"
  onDelete,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

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

  // ⚠️ Hapus Properti (SweetAlert2)
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Yakin hapus properti ini?",
      text: `Properti "${title}" akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e02424",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      background: darkMode ? "#1f2937" : "#fff",
      color: darkMode ? "#fff" : "#000",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Terhapus!",
        text: "Properti berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: darkMode ? "#1f2937" : "#fff",
        color: darkMode ? "#fff" : "#000",
      });

      if (onDelete) onDelete();
    }
  };

  // ✏️ Navigasi ke halaman EditProperty (tanpa id)
  const handleEdit = () => {
    navigate("/user/edit-property");
  };

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
      {/* Gambar */}
      <div className={styles.imageWrapper}>
        <img
          src={image || fallbackImage}
          alt={title || "Gambar Properti"}
          loading="lazy"
          onError={(e) => (e.target.src = fallbackImage)}
          className={styles.image}
        />
      </div>

      {/* Status Badge */}
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
          }}
        >
          {badgeStyle.text}
        </div>
      )}

      {/* Body Card */}
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

        {/* Tombol Edit & Delete */}
        <div className={styles.actionButtons}>
  <button
    className={`${styles.editBtn} ${darkMode ? styles.editBtnDark : ""}`}
    onClick={handleEdit}
  >
    <FaEdit />
  </button>

  <button
    className={`${styles.deleteBtn} ${darkMode ? styles.deleteBtnDark : ""}`}
    onClick={handleDelete}
  >
    <FaTrash />
  </button>
</div>

      </div>
    </div>
  );
}
