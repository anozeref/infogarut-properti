import React from "react";
import { FaMapMarkerAlt, FaMoneyBillWave, FaEdit, FaTrash } from "react-icons/fa";
import styles from "./CardProperty.module.css";

export default function CardProperty({ image, type, title, location, price, desc }) {
  const fallbackImage = "https://via.placeholder.com/300x160?text=No+Image";

  return (
    <div className={styles.card}>
      <img
        src={image || fallbackImage}
        alt={title || "Gambar Properti"}
        onError={(e) => (e.target.src = fallbackImage)}
      />
      <div className={styles.cardBody}>
        {type && <span className={styles.badge}>{type}</span>}
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
          <button className={styles.editBtn} title="Edit properti">
            <FaEdit />
          </button>
          <button className={styles.deleteBtn} title="Hapus properti">
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
