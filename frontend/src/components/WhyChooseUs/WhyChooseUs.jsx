// src/components/WhyChooseUs/WhyChooseUs.jsx
import React from 'react';
import styles from './WhyChooseUs.module.css';
import { FaRegBuilding, FaUserTie, FaPenNib } from "react-icons/fa";
import { FiShield } from "react-icons/fi";

const features = [
    {
        icon: <FaRegBuilding size={32} />,
        title: "Pilihan Properti Terbaik",
        description: "Kami menawarkan daftar properti terkurasi yang memenuhi standar kualitas dan kenyamanan tertinggi."
    },
    {
        icon: <FaUserTie size={32} />,
        title: "Agen Profesional",
        description: "Tim agen kami yang berpengalaman siap membantu Anda di setiap langkah, memastikan transaksi berjalan lancar."
    },
    {
        icon: <FaPenNib size={32} />,
        title: "Proses Mudah & Cepat",
        description: "Kami menyederhanakan proses pembelian, membuatnya transparan dan bebas stres dari awal hingga akhir."
    },
    {
        icon: <FiShield size={32} />,
        title: "Aman & Terpercaya",
        description: "Keamanan transaksi Anda adalah prioritas kami. Kami memastikan semua proses legal dan aman."
    }
];

const WhyChooseUs = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Mengapa Memilih InfoGarutProperti?</h2>
                <p className={styles.subtitle}>
                    Kami berdedikasi untuk memberikan pengalaman terbaik dalam menemukan rumah impian Anda.
                </p>
                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.featureItem}>
                            <div className={styles.iconWrapper}>
                                {feature.icon}
                            </div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;