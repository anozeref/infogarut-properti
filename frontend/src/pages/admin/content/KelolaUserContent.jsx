import React, { useState } from "react";
import { FaCheck, FaClock, FaBan } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import styles from "./KelolaUserContent.module.css";

// Dummy data user
const usersData = [
  { id: 2, username: "andi", name: "Andi Setiawan", email: "andi@mail.com", hp: "081234567890", joined: "2025-01-10", verified: true },
  { id: 3, username: "budi", name: "Budi Santoso", email: "budi@mail.com", hp: "081234567891", joined: "2025-02-15", verified: false },
  { id: 4, username: "citra", name: "Citra Rahma", email: "citra@mail.com", hp: "081234567892", joined: "2025-03-05", verified: true },
  { id: 5, username: "dina", name: "Dina Lestari", email: "dina@mail.com", hp: "081234567893", joined: "2025-04-01", verified: false },
];

const propertiesData = [
  { id: 1, ownerId: 2 },
  { id: 2, ownerId: 2 },
  { id: 3, ownerId: 3 },
  { id: 4, ownerId: 4 },
];

const paginate = (array, page, perPage = 5) => {
  const start = (page - 1) * perPage;
  return array.slice(start, start + perPage);
};

const KelolaUserContent = () => {
  const [users, setUsers] = useState(usersData);
  const [currentPageVerified, setCurrentPageVerified] = useState(1);
  const [currentPageUnverified, setCurrentPageUnverified] = useState(1);

  const handleVerify = (id) => {
    const target = users.find(u => u.id === id);
    Swal.fire({
      title: `Verifikasi "${target.username}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, verifikasi",
      cancelButtonText: "Batal",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d"
    }).then(result => {
      if (result.isConfirmed) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, verified: true } : u));
        Swal.fire({
          title: "Terverifikasi!",
          icon: "success",
          text: `"${target.username}" berhasil diverifikasi.`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleSuspend = (id) => {
    const target = users.find(u => u.id === id);
    Swal.fire({
      title: `Suspend "${target.username}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, suspend",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ffc107",
      cancelButtonColor: "#6c757d"
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Disuspend!",
          icon: "success",
          text: `"${target.username}" berhasil disuspend.`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleBanned = (id) => {
    const target = users.find(u => u.id === id);
    Swal.fire({
      title: `Banned "${target.username}"?`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Ya, banned",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d"
    }).then(result => {
      if (result.isConfirmed) {
        setUsers(prev => prev.filter(u => u.id !== id));
        Swal.fire({
          title: "Dibanned!",
          icon: "success",
          text: `"${target.username}" telah dibanned.`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const verifiedUsers = users.filter(u => u.verified);
  const unverifiedUsers = users.filter(u => !u.verified);

  const renderPagination = (totalItems, currentPage, setPage) => {
    const totalPages = Math.ceil(totalItems / 5);
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <div className={styles.pagination}>
        {pages.map(p => (
          <button
            key={p}
            disabled={p === currentPage}
            className={p === currentPage ? styles.activePage : ""}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}
      </div>
    );
  };

  const renderTable = (list, isVerified = false) => (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Nama</th>
            <th>Email</th>
            <th>HP</th>
            <th>Properti Post</th>
            <th>Status</th>
            <th>Tgl Bergabung</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {list.map((user, idx) => {
              const userProperties = propertiesData.filter(p => p.ownerId === user.id);
              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <td>{idx + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.hp}</td>
                  <td>{userProperties.length}</td>
                  <td className={styles.statusCell}>
                    {user.verified ? (
                      <span className={`${styles.statusIcon} ${styles.approved}`}><FaCheck /></span>
                    ) : (
                      <span className={`${styles.statusIcon} ${styles.pending}`}><FaClock /></span>
                    )}
                  </td>
                  <td>{user.joined}</td>
                  <td className={styles.actions}>
                    {!user.verified && (
                      <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleVerify(user.id)} className={`${styles.iconBtn} ${styles.verifyBtn}`} title="Verify">
                        <FaCheck />
                      </motion.button>
                    )}
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleSuspend(user.id)} className={`${styles.iconBtn} ${styles.suspendBtn}`} title="Suspend">
                      <FaClock />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleBanned(user.id)} className={`${styles.iconBtn} ${styles.bannedBtn}`} title="Banned">
                      <FaBan />
                    </motion.button>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Kelola User</h2>
      </div>

      <div className={styles.section}>
        <p className={styles.subTitle}>User Belum Diverifikasi ({unverifiedUsers.length})</p>
        {renderTable(paginate(unverifiedUsers, currentPageUnverified), false)}
        {renderPagination(unverifiedUsers.length, currentPageUnverified, setCurrentPageUnverified)}
      </div>

      <div className={styles.section}>
        <p className={styles.subTitle}>User Terverifikasi ({verifiedUsers.length})</p>
        {renderTable(paginate(verifiedUsers, currentPageVerified), true)}
        {renderPagination(verifiedUsers.length, currentPageVerified, setCurrentPageVerified)}
      </div>
    </div>
  );
};

export default KelolaUserContent;
