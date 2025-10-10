// src/pages/PropertiDetail/PropertiDetail.jsx
import React from 'react';
import styles from './PropertiDetail.module.css';
import { Link, useParams } from 'react-router-dom';
import { IoLocationOutline } from "react-icons/io5";
import { LuBedDouble, LuBath } from "react-icons/lu";
import { RxRulerSquare } from "react-icons/rx";
import { IoArrowBack } from "react-icons/io5";

// Di aplikasi nyata, data ini akan diambil dari API berdasarkan ID
const propertyData = {
    id: 1,
    title: "Vila Darajat Pas",
    location: "Darajat",
    price: 50000000000,
    type: "Vila",
    beds: 5,
    baths: 5,
    area: "4.500",
    description: "Vila modern yang menakjubkan dengan pemandangan laut yang luar biasa. Memiliki ruang tamu berkonsep terbuka, kolam renang tanpa batas, dan akses langsung ke pantai. Sempurna bagi mereka yang menyukai kemewahan dan laut.",
    mainImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000",
    galleryImages: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000",
        "https://images.unsplash.com/photo-1613553424169-173617c05e12?q=80&w=2000",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000",
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
    // const { id } = useParams(); // Gunakan ini untuk mengambil ID dari URL di aplikasi nyata
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    return (
        <div className={styles.pageContainer}>
            {/* Bagian Atas: Navigasi dan Judul */}
            <div className={styles.headerSection}>
                <Link to="/properti" className={styles.backLink}><IoArrowBack /> Kembali ke Properti</Link>
                <div className={styles.titleLocation}>
                    <h1>{propertyData.title}</h1>
                    <p><IoLocationOutline /> {propertyData.location}</p>
                </div>
            </div>

            {/* Bagian Gambar */}
            <div className={styles.gallerySection}>
                <div className={styles.mainImage}>
                    <img src={propertyData.mainImage} alt="Main view" />
                </div>
                <div className={styles.thumbnailImages}>
                    {propertyData.galleryImages.map((img, index) => (
                        <img key={index} src={img} alt={`Thumbnail ${index + 1}`} />
                    ))}
                </div>
            </div>

            {/* Bagian Detail dan Agen */}
            <div className={styles.detailsGrid}>
                <div className={styles.propertyInfo}>
                    <div className={styles.priceType}>
                        <span className={styles.typeTag}>{propertyData.type}</span>
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