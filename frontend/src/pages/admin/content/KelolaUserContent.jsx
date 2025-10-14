import React, { useState, useEffect, useContext } from "react";
import { FaCheck, FaClock, FaBan, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";
import styles from "./KelolaUserContent.module.css";
import { ThemeContext } from "../DashboardAdmin";

const ITEMS_PER_PAGE = 5;

const KelolaUserContent = () => {
  const { theme } = useContext(ThemeContext);

  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewVerified, setViewVerified] = useState("user");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ---------- Fetch data ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, propRes] = await Promise.all([
          axios.get("http://localhost:3004/users"),
          axios.get("http://localhost:3004/properties"),
        ]);

        // pastikan verified ada
        const normalizedUsers = userRes.data.map(u => ({
          ...u,
          verified: u.verified === true, // jika undefined, dianggap false
        }));

        setUsers(normalizedUsers);
        setProperties(propRes.data);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };
    fetchData();
  }, []);

  // ---------- Filtering ----------
  const filteredUsers = users
    .filter(u => u.role !== "admin") // exclude admin
    .filter(u => viewVerified === "verified" ? u.verified : !u.verified)
    .filter(u =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // ---------- Pagination ----------
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
          <button key={p} disabled={p === currentPage} className={`${styles.pageBtn} ${p === currentPage ? styles.activePage : ""}`} onClick={() => setPage(p)}>
            {p}
          </button>
        ))}
        <button onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={styles.pageBtn}>›</button>
      </div>
    );
  };

  // ---------- Actions ----------
  const handleVerify = async id => {
    const target = users.find(u => u.id === id);
    if (!target) return;

    const confirm = await Swal.fire({
      title: `Verifikasi "${target.username}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, verifikasi",
      cancelButtonText: "Batal",
      confirmButtonColor: "#28a745",
    });

    if (confirm.isConfirmed) {
      try {
        const updatedUser = { ...target, verified: true };
        await axios.put(`http://localhost:3004/users/${id}`, updatedUser);
        setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
        Swal.fire("Berhasil!", "User telah diverifikasi.", "success");
      } catch (err) {
        Swal.fire("Error!", "Gagal verifikasi user.", "error");
      }
    }
  };

  const handleSuspend = id => { /* Implementasi sendiri */ };
  const handleBanned = id => { /* Implementasi sendiri */ };
  const handleDetail = user => { setSelectedUser(user); setModalOpen(true); };

  // ---------- Render Table ----------
  const renderTable = list => (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th><th>Username</th><th>Nama</th><th>Email</th><th>HP</th><th>Properti Post</th><th>Status</th><th>Tgl Bergabung</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {list.map((user, idx) => {
              const userProperties = properties.filter(p => p.ownerId === user.id);
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
                    {!user.verified && <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleVerify(user.id)} className={`${styles.iconBtn} ${styles.verifyBtn}`} title="Verify"><FaCheck /></motion.button>}
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleSuspend(user.id)} className={`${styles.iconBtn} ${styles.suspendBtn}`} title="Suspend"><FaClock /></motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleBanned(user.id)} className={`${styles.iconBtn} ${styles.bannedBtn}`} title="Banned"><FaBan /></motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDetail(user)} className={`${styles.iconBtn} ${styles.detailBtn}`} title="Detail"><FaInfoCircle /></motion.button>
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

  // ---------- Render ----------
  return (
    <div className={`${styles.container} ${theme === "dark" ? styles.dark : ""}`}>
      <div className={styles.header}><h2>Kelola User</h2></div>
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
                    <tr><th>No</th><th>Judul</th><th>Tipe</th><th>Status</th><th>Harga</th><th>Periode</th></tr>
                  </thead>
                  <tbody>
                    {properties.filter(p => p.ownerId === selectedUser.id).map((p, i) => (
                      <tr key={p.id}>
                        <td>{i+1}</td>
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
