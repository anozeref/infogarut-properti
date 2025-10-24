// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import HighlightProperti from '../components/HighlightProperti/HighlightProperti';
import Categories from '../components/Categories/Categories';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import Faq from '../components/Faq/Faq';

// Fungsi bantu untuk ubah string tanggal ke objek Date
const parseCustomDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null;

  // Format ISO (2025-10-24T10:00:00Z)
  if (dateString.includes('T') && dateString.includes('Z')) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  // Format DD/MM/YYYY HH:mm:ss
  const [datePart, timePart] = dateString.split(' ');
  if (!datePart || !timePart) return null;

  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);

  if (
    [day, month, year, hours, minutes, seconds].some(isNaN) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  )
    return null;

  return new Date(year, month - 1, day, hours, minutes, seconds);
};

const HomePage = () => {
  const [latestProperties, setLatestProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3004/properties')
      .then((res) => res.json())
      .then((data) => {
        // 1️⃣ Filter hanya yang statusPostingan = "approved"
        const approvedData = data.filter(
          (item) => item.statusPostingan?.toLowerCase() === 'approved'
        );

        // 2️⃣ Urutkan berdasarkan postedAt terbaru
        const sortedData = approvedData.sort((a, b) => {
          const dateA = parseCustomDate(a.postedAt);
          const dateB = parseCustomDate(b.postedAt);

          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;

          return dateB.getTime() - dateA.getTime(); // terbaru dulu
        });

        // 3️⃣ Ambil 6 teratas
        const topSix = sortedData.slice(0, 6);

        console.log("Top 6 Properti Approved:", topSix);
        setLatestProperties(topSix);
      })
      .catch((error) => console.error("Gagal mengambil properti:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero />
      {!loading && <HighlightProperti properties={latestProperties} />}
      <Categories />
      <WhyChooseUs />
      <Faq />
    </>
  );
};

export default HomePage;
