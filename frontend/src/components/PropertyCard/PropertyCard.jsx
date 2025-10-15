// src/components/PropertyCard/PropertyCard.jsx
import React from 'react';
import styles from './PropertyCard.module.css';
import { Link } from 'react-router-dom';
import { IoLocationOutline } from "react-icons/io5";
import { LuBedDouble, LuBath } from "react-icons/lu";
import { RxRulerSquare } from "react-icons/rx";

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    // Mengubah string menjadi angka sebelum format
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(numericPrice);
  };

  // Mengambil gambar pertama dari array 'media' sebagai gambar utama kartu
  const mainImage = property.media && property.media.length > 0 ? `/images/${property.media[0]}` : 'https://via.placeholder.com/400x300.png?text=No+Image';

  return (
    <Link to={`/properti/${property.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <img src={mainImage} alt={property.namaProperti} className={styles.image} />
        <div className={styles.content}>
          <div className={styles.location}>
            <IoLocationOutline />
            <span>{property.lokasi}</span>
          </div>
          <h3 className={styles.title}>{property.namaProperti}</h3>

          <div className={styles.tags}>
            <span className={styles.tag}>{property.tipeProperti}</span>
            <span className={styles.tagJenis}>{property.jenisProperti}</span>
          </div>
          
          <div className={styles.details}>
            <div className={styles.detailItem}><LuBedDouble /> {property.kamarTidur}</div>
            <div className={styles.detailItem}><LuBath /> {property.kamarMandi}</div>
            <div className={styles.detailItem}><RxRulerSquare /> {property.luasBangunan} m²</div>
          </div>
          <div className={styles.price}>
            {formatPrice(property.harga)}
            {property.periodeSewa && <span className={styles.periodeSewa}>{property.periodeSewa}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;