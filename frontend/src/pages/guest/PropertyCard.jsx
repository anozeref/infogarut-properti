import React from 'react';
import styles from './PropertyCard.module.css';

// Komponen ini menerima 'property' sebagai prop
function PropertyCard({ property }) {
  // Format harga menjadi format Rupiah
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className={styles.card}>
      <img src={property.image} alt={property.title} className={styles.cardImage} />
      <div className={styles.cardBody}>
        <p className={styles.location}>{property.location}</p>
        <h3 className={styles.title}>{property.title}</h3>
        <div className={styles.specs}>
          <span>🛏️ {property.beds}</span>
          <span>🛁 {property.baths}</span>
          <span>🏠 {property.area} m²</span>
        </div>
        <p className={styles.price}>{formattedPrice}</p>
      </div>
    </div>
  );
}

export default PropertyCard;