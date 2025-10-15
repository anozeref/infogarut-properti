import React from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaTag,
  FaMapMarkerAlt,
  FaBuilding,
  FaUser,
  FaClock,
  FaInfoCircle,
  FaBed,
  FaBath,
  FaVectorSquare,
  FaHandshake,
} from "react-icons/fa";
import styles from "./DetailPropertyModal.module.css";

// Helper untuk format harga
const formatPrice = (price) => {
  const numPrice = Number(price);
  if (isNaN(numPrice)) return "Harga tidak valid";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numPrice);
};

// Helper untuk capitalize huruf pertama
const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function DetailPropertyModal({ data, onClose, ownerName, postedAt }) {
  if (!data) return null;

  // ====================== THIS IS THE CORRECTED LINE ======================
  // Construct the full URL pointing to your backend server (port 3005)
  const backendUrl = "http://localhost:3005";
  const imageUrl = data.media && data.media.length > 0
    ? `${backendUrl}/media/${data.media[0]}`
    : null;
  // ========================================================================
  
  const fullLocation = [data.lokasi, data.desa, data.kecamatan, "Garut"]
    .filter(Boolean)
    .join(", ");

  return (
    <motion.div
      className={styles.modalBackdrop}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {imageUrl && (
          <div className={styles.imageContainer}>
            <img src={imageUrl} alt={data.namaProperti} className={styles.modalImage} />
          </div>
        )}

        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.header}>
          <h3>{data.namaProperti || "Nama Properti"}</h3>
          <span className={styles.location}>
            <FaMapMarkerAlt /> {fullLocation}
          </span>
        </div>

        <div className={styles.priceSection}>
          <h2>{formatPrice(data.harga)}</h2>
          <span>{data.periodeSewa || ""}</span>
        </div>

        <div className={styles.propertyDetails}>
          <div className={styles.detailItem}>
            <FaTag />
            <span>{capitalize(data.tipeProperti) || "-"}</span>
          </div>
          <div className={styles.detailItem}>
            <FaHandshake />
            <span>{capitalize(data.jenisProperti) || "-"}</span>
          </div>
          {data.kamarTidur > 0 && (
            <div className={styles.detailItem}>
              <FaBed />
              <span>{data.kamarTidur} KT</span>
            </div>
          )}
          {data.kamarMandi > 0 && (
            <div className={styles.detailItem}>
              <FaBath />
              <span>{data.kamarMandi} KM</span>
            </div>
          )}
          {data.luasBangunan > 0 && (
            <div className={styles.detailItem}>
              <FaBuilding />
              <span>{data.luasBangunan} m² (Bangunan)</span>
            </div>
          )}
          {data.luasTanah > 0 && (
            <div className={styles.detailItem}>
              <FaVectorSquare />
              <span>{data.luasTanah} m² (Tanah)</span>
            </div>
          )}
        </div>
        
        <div className={styles.description}>
          <h4>Deskripsi</h4>
          <p>{data.deskripsi || "Tidak ada deskripsi."}</p>
        </div>

        <div className={styles.adminInfo}>
          <div className={styles.infoRow}>
            <FaUser />
            <span><strong>Pemilik:</strong> {ownerName || "-"}</span>
          </div>
          <div className={styles.infoRow}>
            <FaClock />
            <span><strong>Waktu Post:</strong> {postedAt || "-"}</span>
          </div>
          <div className={styles.infoRow}>
            <FaInfoCircle />
            <span><strong>Status:</strong> {data.statusPostingan || "-"}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.actionButton} onClick={onClose}>
            Tutup
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}