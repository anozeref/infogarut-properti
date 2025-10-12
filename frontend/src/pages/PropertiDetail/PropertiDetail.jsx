// src/pages/PropertiDetail/PropertiDetail.jsx
import React, { useState } from 'react';
import styles from './PropertiDetail.module.css';
import { Link } from 'react-router-dom';
import { IoLocationOutline, IoArrowBack } from "react-icons/io5";
import { LuBedDouble, LuBath } from "react-icons/lu";
import { RxRulerSquare } from "react-icons/rx";

// Data properti lengkap
const propertyData = {
    id: 1,
    title: "Vila Tepi Laut Modern",
    location: "Malibu, California",
    price: 50000000000,
    type: "Vila",
    jenis: "Kredit", // Properti 'jenis' sudah ada di sini
    beds: 5,
    baths: 5,
    area: "4.500",
    description: "Vila modern yang menakjubkan dengan pemandangan laut yang luar biasa. Memiliki ruang tamu berkonsep terbuka, kolam renang tanpa batas, dan akses langsung ke pantai. Sempurna bagi mereka yang menyukai kemewahan dan laut.",
    mainImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000",
    galleryImages: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000",
        "https://images.unsplash.com/photo-1613553424169-173617c05e12?q=80&w=2000",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d_0e2?q=80&w=2000",
    ],
    agent: {
        name: "Jane Doe",
        title: "Agen Properti",
        email: "jane.doe@propertease.com",
        phone: "123-456-7890",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2000"
    }
};

const PropertiDetail = () => {
    const [activeImage, setActiveImage] = useState(propertyData.mainImage);

    const handleThumbnailClick = (imageUrl) => {
        setActiveImage(imageUrl);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    return (
        <div className={styles.pageContainer}>
            {/* --- Bagian Header --- */}
            <div className={styles.headerSection}>
                <Link to="/properti" className={styles.backLink}><IoArrowBack /> Kembali ke Properti</Link>
                <div className={styles.titleLocation}>
                    <h1>{propertyData.title}</h1>
                    <p><IoLocationOutline /> {propertyData.location}</p>
                </div>
            </div>

            {/* --- Bagian Galeri --- */}
            <div className={styles.gallerySection}>
                <div className={styles.mainImage}>
                    <img src={activeImage} alt="Main view" />
                </div>
                <div className={styles.thumbnailImages}>
                    {propertyData.galleryImages.map((img, index) => (
                        <img 
                            key={index} 
                            src={img} 
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => handleThumbnailClick(img)}
                            className={activeImage === img ? styles.activeThumbnail : ''}
                        />
                    ))}
                </div>
            </div>

            {/* --- Bagian Detail & Agen --- */}
            <div className={styles.detailsGrid}>
                <div className={styles.propertyInfo}>
                    <div className={styles.priceType}>
                        <div className={styles.tagsContainer}>
                           <span className={styles.typeTag}>{propertyData.type}</span>
                           <span className={styles.jenisTag}>{propertyData.jenis}</span>
                        </div>
                        <span className={styles.price}>{formatPrice(propertyData.price)}</span>
                    </div>
                    <h2>Detail Properti</h2>
                    <hr className={styles.divider} />
                    <div className={styles.specs}>
                        <div><LuBedDouble size={24}/> {propertyData.beds} Kamar Tidur</div>
                        <div><LuBath size={24}/> {propertyData.baths} Kamar Mandi</div>
                        <div><RxRulerSquare size={24}/> {propertyData.area} kaki² Luas</div>
                    </div>
                    <h2>Deskripsi</h2>
                    <p className={styles.description}>{propertyData.description}</p>
                </div>
                <div className={styles.agentCard}>
                    <img src={propertyData.agent.avatar} alt={propertyData.agent.name} className={styles.agentAvatar} />
                    <h3>{propertyData.agent.name}</h3>
                    <p className={styles.agentTitle}>{propertyData.agent.title}</p>
                    <div className={styles.agentContact}>
                        <p><strong>Email:</strong> {propertyData.agent.email}</p>
                        <p><strong>Telepon:</strong> {propertyData.agent.phone}</p>
                    </div>
                    <button className={styles.contactButton}>Hubungi Agen</button>
                </div>
            </div>
        </div>
    );
};

export default PropertiDetail;