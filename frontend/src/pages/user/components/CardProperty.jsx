import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaEdit,
  FaTrash,
  FaRulerCombined,
  FaBath,
  FaBed,
} from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./CardProperty.module.css";

export default function CardProperty({
  id,
  namaProperti,
  tipeProperti,
  jenisProperti, // jual | sewa
  periodeSewa,
  harga,
  luasTanah,
  luasBangunan,
  kamarTidur,
  kamarMandi,
  lokasi,
  deskripsi,
  media,
  status, // pending | aktif | ditolak
  darkMode,
  onDelete,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const fallbackImage =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=60";

  const image = Array.isArray(media) && media.length > 0 ? media[0] : fallbackImage;

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

  // ⚠️ Hapus Properti
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Yakin hapus properti ini?",
      text: `Properti "${namaProperti}" akan dihapus permanen.`,
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
      try {
        await axios.delete(`http://localhost:3004/properties/${id}`);
        Swal.fire({
          title: "Terhapus!",
          text: "Properti berhasil dihapus.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: darkMode ? "#1f2937" : "#fff",
          color: darkMode ? "#fff" : "#000",
        });

        if (onDelete) onDelete(id);
      } catch (error) {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menghapus properti.",
          icon: "error",
          background: darkMode ? "#1f2937" : "#fff",
          color: darkMode ? "#fff" : "#000",
        });
        console.error("Gagal hapus properti:", error);
      }
    }
  };

  // ✏️ Edit Properti
  const handleEdit = () => {
    navigate(`/user/edit-property/${id}`);
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
          src={image}
          alt={namaProperti || "Gambar Properti"}
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
        <div className={styles.badgeGroup}>
          {tipeProperti && (
            <span
              className={`${styles.badge} ${darkMode ? styles.badgeDark : ""}`}
            >
              {tipeProperti}
            </span>
          )}
          {jenisProperti && (
            <span
              className={`${styles.badgeSecondary} ${
                darkMode ? styles.badgeDark : ""
              }`}
            >
              {jenisProperti === "sewa" ? "Untuk Disewa" : "Dijual"}
            </span>
          )}
        </div>

        <h3 className={styles.cardTitle}>{namaProperti}</h3>

        {lokasi && (
          <p className={styles.cardLocation}>
            <FaMapMarkerAlt className={styles.icon} /> {lokasi}
          </p>
        )}

        {harga && (
          <p className={styles.cardPrice}>
            <FaMoneyBillWave className={styles.icon} /> Rp
            {harga.toLocaleString("id-ID")}{" "}
            {jenisProperti === "sewa" && periodeSewa && (
              <span className={styles.periode}>{periodeSewa}</span>
            )}
          </p>
        )}

        {/* Detail Properti */}
        <div className={styles.propertyDetails}>
          {luasTanah && (
            <span>
              <FaRulerCombined className={styles.iconSmall} /> {luasTanah} m²
            </span>
          )}
          {kamarTidur && (
            <span>
              <FaBed className={styles.iconSmall} /> {kamarTidur}
            </span>
          )}
          {kamarMandi && (
            <span>
              <FaBath className={styles.iconSmall} /> {kamarMandi}
            </span>
          )}
        </div>

        {deskripsi && (
          <p className={styles.cardDesc}>
            {deskripsi.length > 100
              ? deskripsi.slice(0, 100) + "..."
              : deskripsi}
          </p>
        )}

        {/* ✅ Tombol Edit & Delete hanya untuk Pending & Ditolak */}
        {(status === "pending" || status === "ditolak") && (
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
        )}
      </div>
    </div>
  );
}
