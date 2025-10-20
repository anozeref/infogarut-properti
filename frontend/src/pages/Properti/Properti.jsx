// src/pages/Properti/Properti.jsx
import React, { useState, useEffect } from 'react';
import styles from './Properti.module.css';
import PropertyCard from '../../components/PropertyCard/PropertyCard.jsx';
import { useSearchParams } from 'react-router-dom';

/**
 * Helper function untuk mengubah string tanggal (dari format DD/MM/YYYY HH:mm:ss atau ISO)
 * menjadi objek Date yang bisa dibandingkan.
 * @param {string} dateString - String tanggal dari db.json (misal: "17/10/2025 19:49:14" atau "2025-10-17T12:42:23.028Z")
 * @returns {Date} Objek Date
 */
const parsePostedAt = (dateString) => {
  // Prioritas 1: Cek format "DD/MM/YYYY HH:mm:ss"
  if (dateString && dateString.includes('/')) {
    const parts = dateString.split(' ');
    if (parts.length === 2) {
      const dateParts = parts[0].split('/'); // [DD, MM, YYYY]
      const timeParts = parts[1].split(':'); // [HH, mm, ss]

      // Pastikan semua bagian ada sebelum membuat objek Date
      if (dateParts.length === 3 && timeParts.length === 3) {
        // new Date(YYYY, MM-1, DD, HH, mm, ss)
        // Bulan (MM) di JS dimulai dari 0 (Januari=0)
        return new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]);
      }
    }
  }

  // Fallback (Anomali atau format ISO): Tangani "2025-10-15T17:35:04.953Z"
  // new Date() bisa langsung mem-parsing format ini.
  // Pastikan dateString valid sebelum membuat objek Date
  if (dateString) {
      return new Date(dateString);
  }
  
  // Jika dateString null/undefined/kosong, kembalikan tanggal yang sangat lama
  // agar properti ini muncul paling belakang jika tidak ada tanggal posting
  return new Date(0); 
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
        // Mengambil data dari endpoint 'properti' di db.json
        fetch('http://localhost:3004/properties')
            .then(res => res.json())
            .then(data => {
                // Urutkan data menggunakan fungsi helper parsePostedAt
                const sortedData = data.sort((a, b) => {
                    const dateA = parsePostedAt(a.postedAt);
                    const dateB = parsePostedAt(b.postedAt);
                    // Urutkan descending: data B - data A (terbaru ke terlama)
                    return dateB.getTime() - dateA.getTime(); // Menggunakan getTime() untuk perbandingan yang lebih aman
                });
                
                // Simpan data yang sudah diurutkan ke state
                setProperties(sortedData);
            })
            .catch(error => console.error("Gagal mengambil data properti:", error))
            .finally(() => {
                setLoading(false);
            });
    }, []); // Dependency array kosong agar fetch hanya berjalan sekali saat komponen mount

    useEffect(() => {
        const tipeDariUrl = searchParams.get('tipe');
        if (tipeDariUrl) {
            setTipeFilter(tipeDariUrl);
        } else {
            setTipeFilter('Semua Tipe');
        }
    }, [searchParams]);
    
    // Data yang sudah diurutkan (dari state) kemudian difilter
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
                            <option value="Kos">Villa</option>
                            <option value="Ruko">Ruko</option>
                            <option value="Tanah">Tanah</option>
                            <option value="Kost">Kost</option>
                            <option value="Tanah">Perumahan</option>
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
                    {/* Data yang di-map di sini sudah terurut DAN terfilter */}
                    {filteredProperties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Properti;