// src/pages/PropertiDetail/PropertiDetail.jsx
import React, { useState, useEffect } from 'react';
import styles from './PropertiDetail.module.css';
import { Link, useParams } from 'react-router-dom';
import { IoLocationOutline, IoArrowBack } from "react-icons/io5";
import { LuBedDouble, LuBath } from "react-icons/lu";
import { RxRulerSquare } from "react-icons/rx";

const PropertiDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        setLoading(true);
        // Mengambil data properti dari json-server (port 3004)
        fetch(`http://localhost:3004/properties/${id}`)
            .then(res => res.json())
            .then(data => {
                setProperty(data);
                if (data && data.media && data.media.length > 0) {
                    // PERBAIKAN: Gunakan URL lengkap ke server backend (port 3005) dan folder 'media'
                    setActiveImage(`http://localhost:3005/media/${data.media[0]}`);
                }
            })
            .catch(error => console.error("Gagal mengambil detail properti:", error))
            .finally(() => setLoading(false));
    }, [id]);

    const handleThumbnailClick = (imageName) => {
        // PERBAIKAN: Gunakan URL lengkap ke server backend (port 3005)
        setActiveImage(`http://localhost:3005/media/${imageName}`);
    };

    const formatPrice = (price) => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(numericPrice);
    };

    if (loading) {
        return <div className={styles.pageContainer}>Memuat detail properti...</div>;
    }

    if (!property) {
        return <div className={styles.pageContainer}>Properti tidak ditemukan.</div>;
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.headerSection}>
                <Link to="/properti" className={styles.backLink}><IoArrowBack /> Kembali ke Properti</Link>
                <div className={styles.titleLocation}>
                    <h1>{property.namaProperti}</h1>
                    <p><IoLocationOutline /> {property.lokasi}</p>
                </div>
            </div>

            <div className={styles.gallerySection}>
                <div className={styles.mainImage}>
                    <img src={activeImage} alt="Tampilan utama" />
                </div>
                <div className={styles.thumbnailImages}>
                    {property.media && property.media.map((imgName, index) => (
                        <img 
                            key={index} 
                            // PERBAIKAN: Gunakan URL lengkap di sini juga
                            src={`http://localhost:3005/media/${imgName}`} 
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => handleThumbnailClick(imgName)}
                            // PERBAIKAN: Sesuaikan perbandingan className
                            className={activeImage === `http://localhost:3005/media/${imgName}` ? styles.activeThumbnail : ''}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.detailsGrid}>
                <div className={styles.propertyInfo}>
                    <div className={styles.priceType}>
                        <div className={styles.tagsContainer}>
                           <span className={styles.typeTag}>{property.tipeProperti}</span>
                           <span className={styles.jenisTag}>{property.jenisProperti}</span>
                        </div>
                        <span className={styles.price}>
                            {formatPrice(property.harga)}
                            {property.periodeSewa && <span className={styles.periodeSewa}>{property.periodeSewa}</span>}
                        </span>
                    </div>
                    <h2>Detail Properti</h2>
                    <hr className={styles.divider} />
                    <div className={styles.specs}>
                        <div><LuBedDouble size={24}/> {property.kamarTidur} Kamar Tidur</div>
                        <div><LuBath size={24}/> {property.kamarMandi} Kamar Mandi</div>
                        <div><RxRulerSquare size={24}/> {property.luasBangunan} m² Luas Bangunan</div>
                    </div>
                    <h2>Deskripsi</h2>
                    <p className={styles.description}>{property.deskripsi}</p>
                </div>
                <div className={styles.agentCard}>
                    <div className={styles.agentContact}>
                        <p>Kontak Pemasang Iklan:</p>
                        <p><strong>Hubungi untuk info lebih lanjut</strong></p>
                    </div>
                    <button className={styles.contactButton}>Hubungi Agen</button>
                </div>
            </div>
        </div>
    );
};

export default PropertiDetail;