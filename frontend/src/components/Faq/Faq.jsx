// src/components/Faq/Faq.jsx
import React, { useState } from 'react';
import styles from './Faq.module.css';
import { IoChevronDown } from "react-icons/io5";

// DATA FAQ YANG BARU DIMASUKKAN DI SINI
const faqData = [
  {
    question: "Apa itu Infogarut Property?",
    answer: "Infogarut Property adalah platform informasi dan layanan properti di Garut yang membantu masyarakat menemukan hunian, tanah, maupun investasi terbaik. Kami menyediakan data terbaru, panduan lokasi, serta koneksi langsung dengan agen dan pemilik terpercaya di wilayah Garut."
  },
  {
    question: "Apakah semua properti yang ditampilkan di Infogarut Property sudah diverifikasi?",
    answer: "Ya. Setiap listing yang tampil di Infogarut Property melalui proses verifikasi untuk memastikan keaslian data dan kejelasan kepemilikan, agar calon pembeli merasa aman dan nyaman dalam bertransaksi."
  },
  {
    question: "Jenis properti apa saja yang bisa ditemukan di Infogarut Property?",
    answer: "Anda dapat menemukan berbagai jenis properti seperti rumah tinggal, tanah kavling, ruko, kos, hingga lahan investasi strategis di seluruh wilayah Garut, mulai dari kawasan perkotaan hingga daerah wisata."
  },
  {
    question: "Apakah Infogarut Property menyediakan layanan konsultasi atau bantuan investasi?",
    answer: "Tentu. Tim Infogarut Property siap memberikan panduan investasi lokal, termasuk analisis nilai properti, potensi pengembangan wilayah, serta tips membeli atau menjual properti dengan aman dan menguntungkan."
  },
  {
    question: "Bagaimana cara menghubungi tim Infogarut Property jika saya tertarik dengan salah satu listing?",
    answer: "Anda dapat langsung menghubungi kami melalui form kontak di website Infogarut Property, atau melalui WhatsApp dan email resmi yang tertera di setiap halaman listing. Tim kami akan merespons dengan cepat dan membantu proses transaksi Anda hingga tuntas."
  }
];

// Komponen FaqItem tidak perlu diubah
const FaqItem = ({ faq, index, toggleFAQ }) => {
  return (
    <div
      className={`${styles.faqItem} ${faq.open ? styles.open : ''}`}
      onClick={() => toggleFAQ(index)}
    >
      <div className={styles.faqQuestion}>
        {faq.question}
        <IoChevronDown className={styles.icon} />
      </div>
      <div className={styles.faqAnswer}>
        {faq.answer}
      </div>
    </div>
  );
};

// Komponen Faq utama tidak perlu diubah logikanya
const Faq = () => {
  const [faqs, setFaqs] = useState(
    faqData.map(item => ({...item, open: false}))
  );

  const toggleFAQ = index => {
    setFaqs(
      faqs.map((faq, i) => {
        if (i === index) {
          faq.open = !faq.open;
        } else {
          faq.open = false; // Menutup FAQ lain saat satu dibuka
        }
        return faq;
      })
    );
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Pertanyaan yang Sering Diajukan</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <FaqItem key={index} faq={faq} index={index} toggleFAQ={toggleFAQ} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;