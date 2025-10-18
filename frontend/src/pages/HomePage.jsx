// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react'; // 1. Import useState dan useEffect
import Hero from '../components/Hero/Hero';
import HighlightProperti from '../components/HighlightProperti/HighlightProperti'; // 2. Import HighlightProperti
import Categories from '../components/Categories/Categories';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import Faq from '../components/Faq/Faq';

const HomePage = () => {
  // 3. Tambahkan state untuk properti terbaru dan loading
  const [latestProperties, setLatestProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // 4. useEffect untuk mengambil data saat komponen dimuat
  useEffect(() => {
    setLoading(true); // Mulai loading
    fetch('http://localhost:3004/properties?statusPostingan=approved&_sort=postedAt&_order=desc&_limit=3')
      .then(res => res.json())
      .then(data => {
        setLatestProperties(data); // Simpan data ke state
      })
      .catch(error => console.error("Gagal mengambil properti terbaru:", error))
      .finally(() => setLoading(false)); // Selesai loading
  }, []); // Array dependensi kosong agar hanya berjalan sekali

  return (
    <>
      <Hero />
      {/* 5. Tampilkan HighlightProperti di antara Hero dan Categories */}
      {/* Hanya tampilkan jika loading selesai dan ada data */}
      {!loading && latestProperties.length > 0 && (
        <HighlightProperti properties={latestProperties} />
      )}
      <Categories />
      <WhyChooseUs />
      <Faq />
    </>
  );
};

export default HomePage;