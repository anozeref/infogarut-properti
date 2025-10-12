import React, { useState } from "react";
import { FaCheck, FaClock, FaBan, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import styles from "./KelolaUserContent.module.css";

// Dummy data
const usersData = [
  { id: 2, username: "andi", name: "Andi Setiawan", email: "andi@mail.com", hp: "081234567890", joined: "2025-01-10", verified: true },
  { id: 3, username: "budi", name: "Budi Santoso", email: "budi@mail.com", hp: "081234567891", joined: "2025-02-15", verified: false },
  { id: 4, username: "citra", name: "Citra Rahma", email: "citra@mail.com", hp: "081234567892", joined: "2025-03-05", verified: true },
  { id: 5, username: "dina", name: "Dina Lestari", email: "dina@mail.com", hp: "081234567893", joined: "2025-04-01", verified: false },
];

const propertiesData = [
  { id: 1, ownerId: 2, title: "Rumah Minimalis", tipe: "Rumah", status: "approved", price: 350000000, periode: "1 tahun" },
  { id: 2, ownerId: 2, title: "Kost Mahasiswa", tipe: "Kost", status: "pending", price: 1200000, periode: "1 bulan" },
  { id: 3, ownerId: 3, title: "Vila Eksklusif", tipe: "Villa", status: "approved", price: 1500000000, periode: "2 tahun" },
  { id: 4, ownerId: 4, title: "Ruko Strategis", tipe: "Ruko", status: "approved", price: 850000000, periode: "-" },
];

const ITEMS_PER_PAGE = 5;

const KelolaUserContent = () => {
  const [users, setUsers] = useState(usersData);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewVerified, setViewVerified] = useState("user"); // toggle
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter + search
  const filteredUsers = users
    .filter(u => viewVerified === "verified" ? u.verified : !u.verified)
    .filter(u =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination helper
  const paginate = (list, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
  };

  const renderPagination = (totalItems, currentPage, setPage) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <div className={styles.pagination}>
        <button onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={styles.pageBtn}>‹</button>
        {pages.map(p => (
          <button
            key={p}
            disabled={p === currentPage}
            className={`${styles.pageBtn} ${p === currentPage ? styles.activePage : ""}`}
            onClick={() => setPage(p)}
            title={`Halaman ${p}`} // tooltip
          >{p}</button>
        ))}
        <button onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={styles.pageBtn}>›</button>
      </div>
    );
  };

  // Actions
  const handleVerify = id => {
    const target = users.find(u => u.id === id);
    Swal.fire({
      title: `Verifikasi "${target.username}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, verifikasi",
      cancelButtonText: "Batal",
      confirmButtonColor: "#28a745",
    }).then(result => {
      if (result.isConfirmed) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, verified: true } : u));
        Swal.fire({ title: "Terverifikasi!", icon: "success", timer: 1200, showConfirmButton: false });
      }
    });
  };

  const handleSuspend = id => {
    const target = users.find(u => u.id === id);
    Swal.fire({
      title: `Suspend "${target.username}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, suspend",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ffc107",
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({ title: "Disuspend!", icon: "success", timer: 1200, showConfirmButton: false });
      }
    });
  };

  const handleBanned = id => {
    const target = users.find(u => u.id === id);
    Swal.fire({
      title: `Banned "${target.username}"?`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Ya, banned",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc3545",
    }).then(result => {
      if (result.isConfirmed) {
        setUsers(prev => prev.filter(u => u.id !== id));
        Swal.fire({ title: "Dibanned!", icon: "success", timer: 1200, showConfirmButton: false });
      }
    });
  };

  const handleDetail = user => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Table render
  const renderTable = list => (
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
                <motion.tr key={user.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <td>{idx + 1 + (currentPage - 1) * ITEMS_PER_PAGE}</td>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.hp}</td>
                  <td>{userProperties.length}</td>
                  <td className={styles.statusCell}>
                    {user.verified ? <span className={`${styles.statusIcon} ${styles.approved}`} title="Terverifikasi"><FaCheck /></span>
                      : <span className={`${styles.statusIcon} ${styles.pending}`} title="Belum Diverifikasi"><FaClock /></span>}
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
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDetail(user)} className={`${styles.iconBtn} ${styles.detailBtn}`} title="Detail">
                      <FaInfoCircle />
                    </motion.button>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
      {list.length === 0 && <p style={{ padding: "10px" }}>Tidak ada user ditemukan.</p>}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Kelola User</h2>
      </div>

      <div className={styles.controls}>
        <input type="text" placeholder="Cari user..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={styles.searchInput} />
        <div className={styles.toggleContainer}>
          <span>Belum Diverifikasi</span>
          <label>
            <input type="checkbox" checked={viewVerified === "verified"} onChange={() => setViewVerified(viewVerified === "verified" ? "user" : "verified")} />
            <div className={styles.slider}><div className={styles.sliderBall}></div></div>
          </label>
          <span>Terverifikasi</span>
        </div>
      </div>

      {renderTable(paginate(filteredUsers, currentPage))}
      {renderPagination(filteredUsers.length, currentPage, setCurrentPage)}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && selectedUser && (
          <motion.div className={styles.modalBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modalContent} initial={{ y: -50 }} animate={{ y: 0 }} exit={{ y: -50 }}>
              <div className={styles.modalLeft}>
                <h3>Profil User</h3>
                <p><b>Username:</b> {selectedUser.username}</p>
                <p><b>Nama:</b> {selectedUser.name}</p>
                <p><b>Email:</b> {selectedUser.email}</p>
                <p><b>HP:</b> {selectedUser.hp}</p>
                <p><b>Status:</b> {selectedUser.verified ? "Terverifikasi" : "Belum Diverifikasi"}</p>
                <p><b>Tanggal Bergabung:</b> {selectedUser.joined}</p>
              </div>
              <div className={styles.modalRight}>
                <h3>Properti</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Judul</th>
                      <th>Tipe</th>
                      <th>Status</th>
                      <th>Harga</th>
                      <th>Periode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertiesData.filter(p => p.ownerId === selectedUser.id).map((p, i) => (
                      <tr key={p.id}>
                        <td>{i + 1}</td>
                        <td>{p.title}</td>
                        <td>{p.tipe}</td>
                        <td>{p.status}</td>
                        <td>{p.price?.toLocaleString()}</td>
                        <td>{p.periode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className={styles.modalClose} onClick={() => setModalOpen(false)}>×</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KelolaUserContent;
