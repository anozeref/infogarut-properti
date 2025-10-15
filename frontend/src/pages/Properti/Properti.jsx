// src/pages/Properti/Properti.jsx
import React, { useState, useEffect } from 'react';
import styles from './Properti.module.css';
import PropertyCard from '../../components/PropertyCard/PropertyCard.jsx';
import { useSearchParams } from 'react-router-dom';

const Properti = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [locationSearch, setLocationSearch] = useState('');
    const [tipeFilter, setTipeFilter] = useState('Semua Tipe');
    const [jenisFilter, setJenisFilter] = useState('Semua Jenis');

    useEffect(() => {
        setLoading(true);
        // Mengambil data dari endpoint 'properti' di db.json
        fetch('http://localhost:3004/properties')
            .then(res => res.json())
            .then(data => {
                setProperties(data);
            })
            .catch(error => console.error("Gagal mengambil data properti:", error))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const tipeDariUrl = searchParams.get('tipe');
        if (tipeDariUrl) {
            setTipeFilter(tipeDariUrl);
        } else {
            setTipeFilter('Semua Tipe');
        }
    }, [searchParams]);
    
    const filteredProperties = properties.filter(property => {
        // FILTER BARU: Hanya tampilkan properti yang sudah disetujui
        const statusMatch = property.statusPostingan === 'approved';

        const tipeMatch = tipeFilter === 'Semua Tipe' || property.tipeProperti.toLowerCase() === tipeFilter.toLowerCase();
        const jenisMatch = jenisFilter === 'Semua Jenis' || property.jenisProperti.toLowerCase() === jenisFilter.toLowerCase();
        const locationMatch = property.lokasi.toLowerCase().includes(locationSearch.toLowerCase());

        return statusMatch && tipeMatch && jenisMatch && locationMatch;
    });

    const handleResetFilters = () => {
        setLocationSearch('');
        setTipeFilter('Semua Tipe');
        setJenisFilter('Semua Jenis');
        setSearchParams({});
    };

    if (loading) {
        return <div className={styles.loading}>Memuat properti...</div>;
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.filterSection}>
                <h2 className={styles.title}>Temukan Properti Sempurna Anda</h2>
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label>Cari Lokasi</label>
                        <input 
                            type="text" 
                            placeholder="Cari kota, daerah, atau alamat..." 
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Tipe Properti</label>
                        <select value={tipeFilter} onChange={(e) => setTipeFilter(e.target.value)}>
                            <option value="Semua Tipe">Semua Tipe</option>
                            <option value="Rumah">Rumah</option>
                            <option value="Kos">Kos</option>
                            <option value="Ruko">Ruko</option>
                            <option value="Tanah">Tanah</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Jenis Properti</label>
                        <select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)}>
                            <option value="Semua Jenis">Semua Jenis</option>
                            <option value="Jual">Jual</option>
                            <option value="Sewa">Sewa</option>
                            <option value="Cicilan">Cicilan</option>
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