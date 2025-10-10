// src/pages/Properti/Properti.jsx
import React from 'react';
import styles from './Properti.module.css';
import PropertyCard from "../../components/PropertyCard/PropertyCard.jsx";

// Di aplikasi nyata, data ini akan datang dari API
const propertiesData = [
    { id: 1, image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000", location: "Malibu, California", title: "Vila Tepi Laut Modern", type: "Villa", beds: 5, baths: 5, area: "4.500 kaki²", price: 50000000000 },
    { id: 2, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000", location: "New York, New York", title: "Apartemen Nyaman di Pusat Kota", type: "Apartemen", beds: 2, baths: 2, area: "1.200 kaki²", price: 12500000000 },
    { id: 3, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000", location: "Austin, Texas", title: "Rumah Keluarga yang Luas", type: "Rumah", beds: 4, baths: 3, area: "2.800 kaki²", price: 9000000000 },
    { id: 4, image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2000", location: "Chicago, Illinois", title: "Suite Penthouse Mewah", type: "Apartemen", beds: 3, baths: 4, area: "3.500 kaki²", price: 30000000000 },
    { id: 5, image: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=2000", location: "Arlington, Virginia", title: "Rumah Bandar Pinggiran Kota", type: "Rumah Bandar", beds: 3, baths: 3, area: "2.100 kaki²", price: 11500000000 },
    { id: 6, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2000", location: "Asheville, North Carolina", title: "Perumahan Asri Pedesaan", type: "Perumahan", beds: 3, baths: 2, area: "2.400 kaki²", price: 8000000000 },
];

const Properti = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.filterSection}>
        <h2 className={styles.title}>Temukan Properti Sempurna Anda</h2>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Cari Lokasi</label>
            <input type="text" placeholder="mis. Malibu" />
          </div>
          <div className={styles.filterGroup}>
            <label>Tipe Properti</label>
            <select>
              <option>Semua Tipe</option>
              <option>Rumah</option>
              <option>Apartemen</option>
              <option>Villa</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Jenis Properti</label>
            <select>
              <option>Semua Jenis</option>
              <option>Kredit</option>
              <option>Over Kredit</option>
            </select>
          </div>
          <button className={styles.filterButton}>Atur Ulang Filter</button>
        </div>
      </div>

      <div className={styles.resultsSection}>
        <p className={styles.resultsCount}>{propertiesData.length} properti ditemukan</p>
        <div className={styles.propertyGrid}>
          {propertiesData.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properti;