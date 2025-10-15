import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../KelolaUserContent.module.css";

const ITEMS_PER_PAGE = 5;

const TabelUser = ({
  title,
  users,
  properties,
  renderActions,
  renderStatus,
  emptyMessage,
  dateColumnHeader,
  renderDateColumn,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  // Efek ini akan mereset paginasi ke halaman 1
  // setiap kali daftar user (misalnya karena filter) berubah.
  useEffect(() => {
    setCurrentPage(1);
  }, [users]);

  const paginate = (list) => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
  };

  const paginatedUsers = paginate(users);

  return (
    <div className={styles.tableWrapper}>
      <h3>{title}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Nama</th>
            <th>Email</th>
            <th>HP</th>
            <th>Properti</th>
            <th>Status</th>
            <th>{dateColumnHeader}</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, idx) => {
                const userPropsCount = properties.filter(
                  (p) => p.ownerId === user.id
                ).length;
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td>{idx + 1 + (currentPage - 1) * ITEMS_PER_PAGE}</td>
                    <td>{user.username}</td>
                    <td>{user.nama}</td>
                    <td>{user.email}</td>
                    <td>{user.noHp}</td>
                    <td>{userPropsCount}</td>
                    <td className={styles.statusCell}>{renderStatus(user)}</td>
                    <td>{renderDateColumn(user)}</td>
                    <td className={styles.actions}>{renderActions(user)}</td>
                  </motion.tr>
                );
              })
            ) : (
              // Ini adalah pesan saat data kosong (Empty State)
              <tr>
                <td colSpan="9" className={styles.emptyState}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={styles.pageBtn}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              disabled={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`${styles.pageBtn} ${
                currentPage === i + 1 ? styles.activePage : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={styles.pageBtn}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default TabelUser;