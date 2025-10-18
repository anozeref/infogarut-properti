// src/components/HighlightProperti/HighlightProperti.jsx
import React from 'react';
import Slider from "react-slick";
import styles from './HighlightProperti.module.css';
import { Link } from 'react-router-dom';
import { IoLocationOutline } from "react-icons/io5";

// CSS untuk react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --- Komponen HighlightCard tetap sama ---
const HighlightCard = ({ property }) => {
    const formatPrice = (price) => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(numericPrice);
    };

    const image = property.media && property.media.length > 0
        ? `http://localhost:3005/media/${property.media[0]}`
        : 'https://via.placeholder.com/300x200.png?text=No+Image';

  return (
    <div className={styles.slideItem}>
        <Link to={`/properti/${property.id}`} className={styles.cardLink}>
            <div className={styles.card}>
                <img src={image} alt={property.namaProperti} className={styles.cardImage} />
                <div className={styles.cardContent}>
                    <h4 className={styles.cardTitle}>{property.namaProperti}</h4>
                    <p className={styles.cardLocation}><IoLocationOutline size={14}/> {property.kecamatan}, Garut</p>
                    <p className={styles.cardPrice}>{formatPrice(property.harga)}</p>
                </div>
            </div>
        </Link>
    </div>
  );
};

// Komponen utama HighlightProperti
const HighlightProperti = ({ properties }) => {
  // 1. HAPUS kondisi 'return null' di sini

  const settings = {
    dots: true,
    infinite: properties && properties.length > 3, // Periksa properties dulu
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1, dots: false } }
    ]
  };

  return (
    <section className={styles.highlightSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Properti Terbaru</h2>

        {/* 2. Tambahkan kondisi untuk menampilkan slider atau pesan */}
        {properties && properties.length > 0 ? (
          <Slider {...settings}>
            {properties.map(property => (
              <HighlightCard key={property.id} property={property} />
            ))}
          </Slider>
        ) : (
          // Tampilkan pesan jika tidak ada properti
          <div className={styles.noPropertiesMessage}>
            Belum ada properti terbaru saat ini.
          </div>
        )}
      </div>
    </section>
  );
};

export default HighlightProperti;