// src/components/PropertyCard/PropertyCard.jsx
import React from 'react';
import styles from './PropertyCard.module.css';
import { Link } from 'react-router-dom';
import { IoLocationOutline } from "react-icons/io5";
import { LuBedDouble, LuBath } from "react-icons/lu";
import { RxRulerSquare } from "react-icons/rx";

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <Link to={`/properti/${property.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <img src={property.image} alt={property.title} className={styles.image} />
        <div className={styles.content}>
          <div className={styles.location}>
            <IoLocationOutline />
            <span>{property.location}</span>
          </div>
          <h3 className={styles.title}>{property.title}</h3>

          {/* Bagian yang diubah ada di sini */}
          <div className={styles.tags}>
            <span className={styles.tag}>{property.type}</span>
            {/* TAMBAHKAN BARIS DI BAWAH INI */}
            <span className={styles.tagJenis}>{property.jenis}</span>
          </div>
          
          <div className={styles.details}>
            <div className={styles.detailItem}><LuBedDouble /> {property.beds}</div>
            <div className={styles.detailItem}><LuBath /> {property.baths}</div>
            <div className={styles.detailItem}><RxRulerSquare /> {property.area}</div>
          </div>
          <div className={styles.price}>{formatPrice(property.price)}</div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;