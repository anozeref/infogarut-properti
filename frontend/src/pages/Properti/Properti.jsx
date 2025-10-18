// src/pages/Properti/Properti.jsx
import React, { useState, useEffect } from 'react';
import styles from './Properti.module.css';
import PropertyCard from '../../components/PropertyCard/PropertyCard.jsx';
import { useSearchParams } from 'react-router-dom';

// Fungsi bantuan BARU yang lebih teliti untuk format DD/MM/YYYY HH:mm:ss
const parseCustomDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return null;
    
    // Pisahkan tanggal dan waktu
    const dateTimeParts = dateString.split(' ');
    if (dateTimeParts.length !== 2) return null; // Harus ada tanggal dan waktu

    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1];

    // Pisahkan bagian tanggal (DD/MM/YYYY)
    const dateParts = datePart.split('/');
    if (dateParts.length !== 3) return null; // Harus ada DD, MM, YYYY
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10); // Bulan (1-12)
    const year = parseInt(dateParts[2], 10);

    // Pisahkan bagian waktu (HH:mm:ss)
    const timeParts = timePart.split(':');
    if (timeParts.length !== 3) return null; // Harus ada HH, mm, ss
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);

    // Periksa apakah semua bagian adalah angka yang valid
    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        return null;
    }

    // Buat objek Date (Bulan dikurangi 1 karena JS bulan 0-11)
    return new Date(year, month - 1, day, hours, minutes, seconds);
};


const Properti = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [locationSearch, setLocationSearch] = useState('');
    const [tipeFilter, setTipeFilter] = useState('Semua Tipe');
    const [jenisFilter, setJenisFilter] = useState('Semua Jenis');

    useEffect(() => {
        setLoading(true);
        // Hapus parameter sort dari URL fetch
        fetch('http://localhost:3004/properties')
            .then(res => res.json())
            .then(data => {
                // Lakukan pengurutan di sini SETELAH data diterima
                const sortedData = [...data].sort((a, b) => {
                    const dateA = parseCustomDate(a.postedAt);
                    const dateB = parseCustomDate(b.postedAt);
                    
                    // Jika salah satu tanggal tidak bisa di-parse, jangan ubah urutan
                    if (!dateA) return 1;  // Taruh yg tidak valid di akhir
                    if (!dateB) return -1; // Taruh yg tidak valid di akhir

                    // Urutkan descending (terbaru dulu)
                    return dateB.getTime() - dateA.getTime(); 
                });
                setProperties(sortedData); // Simpan data yang sudah terurut
            })
            .catch(error => console.error("Gagal mengambil data properti:", error))
            .finally(() => {
                setLoading(false);
            });
    }, []); // Hanya berjalan sekali

    useEffect(() => {
        const tipeDariUrl = searchParams.get('tipe');
        if (tipeDariUrl) {
            setTipeFilter(tipeDariUrl);
        } else {
            setTipeFilter('Semua Tipe');
        }
    }, [searchParams]);
    
    // Filter seperti biasa (data sudah terurut di state 'properties')
    const filteredProperties = properties.filter(property => {
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
                     {/* ... Filter Anda tidak berubah ... */}
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
                             <option value="Villa">Villa</option>
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
                    {/* Map data yang sudah difilter dan diurutkan */}
                    {filteredProperties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Properti;