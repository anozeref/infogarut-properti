// src/pages/Properti/Properti.jsx
import React, { useState, useEffect } from 'react';
import styles from './Properti.module.css';
import PropertyCard from '../../components/PropertyCard/PropertyCard.jsx';
import { useSearchParams, Link } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5"; // Pastikan ikon ini di-import

// Data properti Anda (tidak ada perubahan)
const propertiesData = [
    { id: 1, image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000", location: "Malibu, California", title: "Vila Tepi Laut Modern", type: "Villa", jenis: "Kredit", beds: 5, baths: 5, area: "4.500 kaki²", price: 50000000000 },
    { id: 2, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000", location: "New York, New York", title: "Apartemen Nyaman di Pusat Kota", type: "Apartemen", jenis: "Cash", beds: 2, baths: 2, area: "1.200 kaki²", price: 12500000000 },
    { id: 3, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000", location: "Austin, Texas", title: "Rumah Keluarga yang Luas", type: "Rumah", jenis: "Kredit", beds: 4, baths: 3, area: "2.800 kaki²", price: 9000000000 },
    { id: 4, image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2000", location: "Chicago, Illinois", title: "Suite Penthouse Mewah", type: "Apartemen", jenis: "Over Kredit", beds: 3, baths: 4, area: "3.500 kaki²", price: 30000000000 },
    { id: 5, image: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=2000", location: "Arlington, Virginia", title: "Rumah Bandar Pinggiran Kota", type: "Rumah", jenis: "Over Kredit", beds: 3, baths: 3, area: "2.100 kaki²", price: 11500000000 },
    { id: 6, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2000", location: "Asheville, North Carolina", title: "Perumahan Asri Pedesaan", type: "Perumahan", jenis: "Kredit", beds: 3, baths: 2, area: "2.400 kaki²", price: 8000000000 },
];

const Properti = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [tipeFilter, setTipeFilter] = useState('Semua Tipe');
    const [jenisFilter, setJenisFilter] = useState('Semua Jenis');

    useEffect(() => {
        const tipeDariUrl = searchParams.get('tipe');
        if (tipeDariUrl) {
            setTipeFilter(tipeDariUrl);
        } else {
            setTipeFilter('Semua Tipe');
        }
    }, [searchParams]);
    
    const filteredProperties = propertiesData.filter(property => {
        const tipeMatch = tipeFilter === 'Semua Tipe' || property.type.toLowerCase() === tipeFilter.toLowerCase();
        const jenisMatch = jenisFilter === 'Semua Jenis' || property.jenis.toLowerCase() === jenisFilter.toLowerCase();
        return tipeMatch && jenisMatch;
    });

    const handleResetFilters = () => {
        setTipeFilter('Semua Tipe');
        setJenisFilter('Semua Jenis');
        setSearchParams({});
    };

    return (
        <div className={styles.pageContainer}>

            {/* FITUR BARU DITAMBAHKAN DI SINI */}
            <Link to="/" className={styles.backLink}>
                <IoArrowBack /> Kembali ke Beranda
            </Link>

            <div className={styles.filterSection}>
                <h2 className={styles.title}>Temukan Properti Sempurna Anda</h2>
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label>Cari Lokasi</label>
                        <input type="text" placeholder="mis. Malibu" />
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Tipe Properti</label>
                        <select value={tipeFilter} onChange={(e) => setTipeFilter(e.target.value)}>
                            <option value="Semua Tipe">Semua Tipe</option>
                            <option value="Rumah">Rumah</option>
                            <option value="Apartemen">Apartemen</option>
                            <option value="Villa">Villa</option>
                            <option value="Perumahan">Perumahan</option>
                            <option value="Tanah">Tanah</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Jenis Properti</label>
                        <select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)}>
                            <option value="Semua Jenis">Semua Jenis</option>
                            <option value="Kredit">Kredit</option>
                            <option value="Over Kredit">Over Kredit</option>
                            <option value="Cash">Cash</option>
                        </select>
                    </div>
                    <button className={styles.filterButton} onClick={handleResetFilters}>
                        Atur Ulang Filter
                    </button>
                </div>
            </div>

            <div className={styles.resultsSection}>
                <p className={styles.resultsCount}>{filteredProperties.length} properti ditemukan</p>
                <div className={styles.propertyGrid}>
                    {filteredProperties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Properti;