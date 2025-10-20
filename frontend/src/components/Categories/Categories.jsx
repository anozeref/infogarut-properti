// src/components/Categories/Categories.jsx
import React from 'react';
import styles from './Categories.module.css';
import { Link } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { LuCastle, LuBuilding } from "react-icons/lu"; // 1. Import ikon baru (LuBuilding)
import { TbDimensions } from "react-icons/tb";
import { BsBuildings, BsShop } from "react-icons/bs"; // 1. Import ikon baru (BsShop)

const categoriesData = [
  {
    icon: <IoHomeOutline size={40} />,
    title: "Rumah",
    description: "Temukan rumah keluarga yang nyaman dan modern."
  },
  {
    icon: <LuCastle size={40} />,
    title: "Villa",
    description: "Nikmati kemewahan dan privasi di villa eksklusif."
  },
  {
    icon: <TbDimensions size={40} />,
    title: "Tanah",
    description: "Investasi di lokasi strategis untuk masa depan."
  },
  {
    icon: <BsBuildings size={40} />,
    title: "Perumahan",
    description: "Pilih hunian di lingkungan yang terencana dan aman."
  },
  // 2. Tambahkan kategori "Kost"
  {
    icon: <LuBuilding size={40} />, // Menggunakan ikon gedung
    title: "Kost",
    description: "Cari kamar kost yang sesuai dengan kebutuhan dan budget Anda."
  },
  // 3. Tambahkan kategori "Ruko"
  {
    icon: <BsShop size={40} />, // Menggunakan ikon toko
    title: "Ruko",
    description: "Temukan ruko di lokasi strategis untuk memulai usaha Anda."
  }
];

// Komponen Card tidak perlu diubah
const CategoryCard = ({ icon, title, description }) => (
  <div className={styles.card}>
    <div className={styles.icon}>{icon}</div>
    <h3 className={styles.cardTitle}>{title}</h3>
    <p className={styles.cardDescription}>{description}</p>
  </div>
);

const Categories = () => {
  return (
    <section className={styles.categoriesSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Jelajahi Berdasarkan Kategori</h2>
        <p className={styles.subtitle}>Temukan properti yang sesuai dengan kebutuhan Anda.</p>
        <div className={styles.grid}>
          {categoriesData.map((cat, index) => (
            <Link key={index} to={`/properti?tipe=${cat.title}`} className={styles.cardLink}>
              <CategoryCard {...cat} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;