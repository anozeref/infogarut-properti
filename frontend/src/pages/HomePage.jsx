// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import HighlightProperti from '../components/HighlightProperti/HighlightProperti';
import Categories from '../components/Categories/Categories';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import Faq from '../components/Faq/Faq';

// Fungsi bantuan untuk mengubah string tanggal (DD/MM/YYYY HH:mm:ss atau ISO)
const parseCustomDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return null;
    
    // Coba parse format ISO dulu (lebih standar)
    if (dateString.includes('T') && dateString.includes('Z')) {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    }
    
    // Coba parse format DD/MM/YYYY HH:mm:ss
    const dateTimeParts = dateString.split(' ');
    if (dateTimeParts.length !== 2) return null; 

    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1];

    const dateParts = datePart.split('/');
    if (dateParts.length !== 3) return null;
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10); 
    const year = parseInt(dateParts[2], 10);

    const timeParts = timePart.split(':');
    if (timeParts.length !== 3) return null;
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        return null;
    }
    if (month < 1 || month > 12 || day < 1 || day > 31 || hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        return null; 
    }

    try {
        // Urutan: YYYY, MM-1, DD, HH, mm, ss
        return new Date(year, month - 1, day, hours, minutes, seconds);
    } catch (e) {
        console.error("Gagal membuat Date di HomePage:", e, "dari string:", dateString);
        return null; 
    }
};


const HomePage = () => {
  const [latestProperties, setLatestProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Ambil SEMUA properti (hapus _limit)
    fetch('http://localhost:3004/properties') 
      .then(res => res.json())
      .then(data => {
        // Urutkan SEMUA data
        const sortedData = [...data].sort((a, b) => {
            const dateA = parseCustomDate(a.postedAt);
            const dateB = parseCustomDate(b.postedAt);
            
            // Handle tanggal null/tidak valid
            if (!dateA && !dateB) return 0; 
            if (!dateA) return 1;  
            if (!dateB) return -1; 

            // Urutkan descending (terbaru dulu)
            return dateB.getTime() - dateA.getTime(); 
        });
        
        // Ambil 6 teratas SETELAH diurutkan
        const topSix = sortedData.slice(0, 6); 
        
        console.log("Top 6 Highlight setelah diurutkan:", topSix); // Untuk Debugging
        setLatestProperties(topSix); // Simpan hanya 6 teratas
      })
      .catch(error => console.error("Gagal mengambil properti terbaru:", error))
      .finally(() => setLoading(false));
  }, []); // Hanya berjalan sekali

  return (
    <>
      <Hero />
      {!loading && ( 
        <HighlightProperti properties={latestProperties} />
      )}
      <Categories />
      <WhyChooseUs />
      <Faq />
    </>
  );
};

export default HomePage;