// src/pages/admin/content/components/Pagination.jsx
import React from "react";
import styles from "../KelolaPropertiContent.module.css"; // Menggunakan style dari parent

export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePage : ""}`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}