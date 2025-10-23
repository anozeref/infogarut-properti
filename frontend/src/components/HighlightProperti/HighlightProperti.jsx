// src/components/HighlightProperti/HighlightProperti.jsx
import React from 'react';
import Slider from "react-slick"; // Import Slider
import styles from './HighlightProperti.module.css';
import { Link } from 'react-router-dom';
import { IoLocationOutline } from "react-icons/io5";

// CSS untuk react-slick (WAJIB)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --- Komponen untuk satu kartu di dalam slider ---
const HighlightCard = ({ property }) => {
    const formatPrice = (price) => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(numericPrice);
    };

    // Membuat URL gambar dari backend
    const image = property.media && property.media.length > 0
        ? `http://localhost:3005/media/${property.media[0]}`
        : 'https://via.placeholder.com/300x200.png?text=No+Image'; // Gambar placeholder

    return (
        // Div pembungkus untuk padding slider
        <div className={styles.slideItem}>
            <Link to={`/properti/${property.id}`} className={styles.cardLink}>
                <div className={styles.card}>
                    <img src={image} alt={property.namaProperti} className={styles.cardImage} />
                    <div className={styles.cardContent}>
                        <h4 className={styles.cardTitle}>{property.namaProperti}</h4>
                        <p className={styles.cardLocation}><IoLocationOutline size={14}/> {property.lokasi}, Garut</p>
                        <p className={styles.cardPrice}>{formatPrice(property.harga)}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

// --- Komponen utama HighlightProperti ---
const HighlightProperti = ({ properties }) => {

    // Konfigurasi untuk Slider react-slick
    const settings = {
        dots: true, // Tampilkan titik navigasi
        infinite: properties && properties.length > 3, // Loop jika properti > 3
        speed: 500, // Kecepatan animasi
        slidesToShow: 3, // Tampilkan 3 slide di layar besar
        slidesToScroll: 1, // Geser 1 slide
        autoplay: true, // Geser otomatis
        autoplaySpeed: 3000, // Interval 3 detik
        pauseOnHover: true, // Berhenti saat mouse di atas
        responsive: [ // Pengaturan layar kecil
            { breakpoint: 1024, settings: { slidesToShow: 2 } }, // Tablet
            { breakpoint: 600, settings: { slidesToShow: 1, dots: false } } // Mobile
        ]
    };

    return (
        <section className={styles.highlightSection}>
            <div className={styles.container}>
                <h2 className={styles.title}>Properti Terbaru</h2>
                {/* Subtitle ditambahkan di sini */}
                <p className={styles.subtitle}>Temukan properti yang sesuai dengan kebutuhan Anda.</p>

                {/* Tampilkan Slider jika ada properti, jika tidak tampilkan pesan */}
                {properties && properties.length > 0 ? (
                    <Slider {...settings}>
                        {properties.map(property => (
                            <HighlightCard key={property.id} property={property} />
                        ))}
                    </Slider>
                ) : (
                    // Pesan jika tidak ada properti
                    <div className={styles.noPropertiesMessage}>
                        Belum ada properti terbaru saat ini.
                    </div>
                )}
            </div>
        </section>
    );
};

export default HighlightProperti;