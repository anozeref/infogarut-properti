import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { ThemeContext } from "../DashboardAdmin";
import axios from "axios";
import { FaCheck, FaClock, FaUndo, FaBan, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

// Impor komponen tabel yang baru dan hapus yang lama
import TabelUser from "./tables/TabelUser";
import ModalUser from "./ModalUser";
import styles from "./KelolaUserContent.module.css";

const KelolaUserContent = () => {
  const { theme } = useContext(ThemeContext);

  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading
  const [viewVerified, setViewVerified] = useState("user");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userRes, propRes] = await Promise.all([
          axios.get("http://localhost:3004/users"),
          axios.get("http://localhost:3004/properties"),
        ]);
        setUsers(
          userRes.data.map((u) => ({ ...u, verified: u.verified === true }))
        );
        setProperties(propRes.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Gagal memuat data dari server.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Semua fungsi aksi (handleVerify, dll.) tetap sama ---
  const updateUser = async (id, updatedFields, successMsg) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    try {
      const updatedUser = { ...target, ...updatedFields };
      await axios.put(`http://localhost:3004/users/${id}`, updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? updatedUser : u))
      );
      Swal.fire("Berhasil!", successMsg, "success");
    } catch (err) {
      Swal.fire("Error!", "Gagal update user.", "error");
    }
  };

  const handleVerify = (id) => {
    const target = users.find(u => u.id === id);
    Swal.fire({
        title: `Verifikasi "${target.username}"?`, icon: "question", showCancelButton: true,
        confirmButtonText: "Ya, verifikasi", cancelButtonText: "Batal", confirmButtonColor: "#28a745",
    }).then(res => res.isConfirmed && updateUser(id, { verified: true }, "User telah diverifikasi."));
  };

  const handleSuspend = (id) => {
    const target = users.find(u => u.id === id);
    Swal.fire({
        title: `Suspend "${target.username}" hingga kapan?`, input: "text", inputPlaceholder: "YYYY-MM-DD",
        showCancelButton: true, confirmButtonText: "Suspend", cancelButtonText: "Batal", confirmButtonColor: "#ffc107",
    }).then(res => {
        if (res.isConfirmed && res.value) updateUser(id, { suspendedUntil: res.value }, `User disuspend hingga ${res.value}`);
    });
  };

  const handleUnSuspend = id => updateUser(id, { suspendedUntil: null }, "Suspend untuk user telah dicabut.");

  const handleBanned = (id) => {
    const target = users.find(u => u.id === id);
    Swal.fire({
        title: `Yakin ingin banned "${target.username}"?`, text: "Tindakan ini tidak bisa dibatalkan!", icon: "warning",
        showCancelButton: true, confirmButtonText: "Ya, banned", cancelButtonText: "Batal", confirmButtonColor: "#dc3545",
    }).then(res => res.isConfirmed && updateUser(id, { banned: true, bannedAt: new Date().toISOString() }, "User telah dibanned."));
  };
  
  const handleDetail = (user) => {
    setSelectedUser({ ...user });
    setModalOpen(true);
  };


  // --- Fungsi untuk merender tombol aksi dengan animasi ---
  const renderActionsForActive = (user) => (
    <>
      {!user.verified && (
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.verifyBtn} onClick={() => handleVerify(user.id)}><FaCheck /></motion.button>
      )}
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.suspendBtn} onClick={() => handleSuspend(user.id)}><FaClock /></motion.button>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.bannedBtn} onClick={() => handleBanned(user.id)}><FaBan /></motion.button>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.detailBtn} onClick={() => handleDetail(user)}><FaInfoCircle /></motion.button>
    </>
  );

  const renderActionsForSuspend = (user) => (
    <>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.unsuspendBtn} onClick={() => handleUnSuspend(user.id)}><FaUndo /></motion.button>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.bannedBtn} onClick={() => handleBanned(user.id)}><FaBan /></motion.button>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.detailBtn} onClick={() => handleDetail(user)}><FaInfoCircle /></motion.button>
    </>
  );

  const renderActionsForBanned = (user) => (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.detailBtn} onClick={() => handleDetail(user)}><FaInfoCircle /></motion.button>
  );

  // --- Fungsi untuk merender badge status yang sesuai ---
  const renderStatus = {
    active: (user) => user.verified ? <span className={styles.approved}>✔ Terverifikasi</span> : <span className={styles.pending}>⌛ Belum</span>,
    suspend: () => <span className={styles.suspended}>⏱ Suspend</span>,
    banned: () => <span className={styles.banned}>❌ Banned</span>,
  };

  // --- Logika filter, diurutkan agar data terbaru di atas ---
  const today = new Date();
  const sortedUsers = [...users].sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
  
  const filteredUsers = sortedUsers
    .filter((u) => u.role !== "admin")
    .filter((u) => (viewVerified === "verified" ? u.verified : !u.verified))
    .filter((u) => u.username.toLowerCase().includes(searchTerm.toLowerCase()) || u.nama?.toLowerCase().includes(searchTerm.toLowerCase()));

  const activeUsers = filteredUsers.filter((u) => !u.banned && (!u.suspendedUntil || new Date(u.suspendedUntil) < today));
  const suspendUsers = filteredUsers.filter((u) => u.suspendedUntil && new Date(u.suspendedUntil) >= today && !u.banned);
  const bannedUsers = filteredUsers.filter((u) => u.banned);

  // Tampilkan spinner jika masih loading
  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container} data-theme={theme}>
      <div className={styles.header}>
        <h2>Kelola User</h2>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
            <input type="text" placeholder="Cari user..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className={styles.toggleContainer}>
            <span><b>Unverified</b></span>
            <label>
                <input type="checkbox" checked={viewVerified === "verified"} onChange={() => setViewVerified(viewVerified === "verified" ? "user" : "verified")} />
                <div className={styles.slider}><div className={styles.sliderBall}></div></div>
            </label>
            <span><b>Verified</b></span>
        </div>
      </div>

      <TabelUser
        title={`User Aktif (${activeUsers.length})`}
        users={activeUsers}
        properties={properties}
        renderActions={renderActionsForActive}
        renderStatus={renderStatus.active}
        emptyMessage="Tidak ada user aktif yang cocok dengan filter."
        dateColumnHeader="Tgl Bergabung"
        renderDateColumn={(user) => new Date(user.joinedAt).toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' })}
      />
      <TabelUser
        title={`User Suspend (${suspendUsers.length})`}
        users={suspendUsers}
        properties={properties}
        renderActions={renderActionsForSuspend}
        renderStatus={renderStatus.suspend}
        emptyMessage="Tidak ada user yang sedang disuspend."
        dateColumnHeader="Suspend Berakhir"
        renderDateColumn={(user) => new Date(user.suspendedUntil).toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' })}
      />
      <TabelUser
        title={`User Banned (${bannedUsers.length})`}
        users={bannedUsers}
        properties={properties}
        renderActions={renderActionsForBanned}
        renderStatus={renderStatus.banned}
        emptyMessage="Tidak ada user yang dibanned."
        dateColumnHeader="Tanggal Dibanned"
        renderDateColumn={(user) => user.bannedAt ? new Date(user.bannedAt).toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' }) : "-"}
      />

      {modalOpen && (
        <ModalUser
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          user={selectedUser}
          properties={properties.filter(
            (p) => p.ownerId === selectedUser.id
          )}
          theme={theme}
        />
      )}
    </div>
  );
};

export default KelolaUserContent;