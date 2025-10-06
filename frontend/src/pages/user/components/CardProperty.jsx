import React from "react";
import styles from "./CardProperty.module.css";

export default function CardProperty({ image, type, title, location, price, desc }) {
  return (
    <div className={styles.card}>
      <img src={image} alt={title} />
      <div className={styles.cardBody}>
        <span className={styles.badge}>{type}</span>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardLocation}>{location}</p>
        <p className={styles.cardPrice}>{price}</p>
        <p className={styles.cardDesc}>{desc}</p>
        <div className={styles.cardActions}>
          <span>✏️</span>
          <span>🗑️</span>
        </div>
      </div>
    </div>
  );
}
