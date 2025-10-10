// src/components/Faq/Faq.jsx
import React, { useState } from 'react';
import styles from './Faq.module.css';
import { IoChevronDown } from "react-icons/io5";

const faqData = [
  {
    question: "Bagaimana cara memulai proses pembelian properti?",
    answer: "Langkah pertama adalah menentukan anggaran Anda dan mencari properti yang sesuai. Setelah itu, hubungi agen kami untuk menjadwalkan kunjungan dan kami akan memandu Anda melalui proses negosiasi hingga selesai."
  },
  {
    question: "Dokumen apa saja yang saya perlukan?",
    answer: "Anda akan memerlukan dokumen identitas (KTP), NPWP, slip gaji atau bukti penghasilan, dan dokumen lain yang mungkin diminta oleh bank jika Anda mengajukan KPR."
  },
  {
    question: "Berapa lama proses pembelian biasanya berlangsung?",
    answer: "Prosesnya bervariasi, tetapi umumnya memakan waktu antara 1 hingga 3 bulan, tergantung pada kelengkapan dokumen dan proses persetujuan kredit dari bank."
  },
  {
    question: "Bisakah saya menegosiasikan harga properti?",
    answer: "Tentu saja. Negosiasi harga adalah bagian umum dari proses pembelian properti. Agen kami akan membantu Anda mendapatkan harga terbaik yang disepakati oleh kedua belah pihak."
  }
];

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