// src/pages/admin/content/KelolaUserContent.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { io } from "socket.io-client";
import { FaCheck, FaClock, FaUndo, FaBan, FaInfoCircle, FaUsers, FaUserClock, FaUserSlash, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { ThemeContext } from "../DashboardAdmin";
import styles from "./KelolaUserContent.module.css";
import { API_URL } from "../../../utils/constant";
import TabelUser from "./tables/TabelUser";
import ModalUser from "./ModalUser";

// Socket global (tetap aman untuk file ini karena lifecycle-nya berbeda)
const socket = io("http://localhost:3005");

// Fungsi format tanggal ke DD/MM/YYYY HH:mm:ss
const formatToCustomTimestamp = (date) => {
  const pad = (num) => String(num).padStart(2, '0');
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

// Fungsi parse tanggal custom DD/MM/YYYY HH:mm:ss ke format panjang Indonesia
const parseAndFormatDate = (dateStr) => {
  if (!dateStr) return "-";
  const parts = dateStr.split(/[\s/:]+/);
  if (parts.length < 6) return "Format salah";
  // Urutan: tahun, bulanIndex, hari, jam, menit, detik
  const dateObj = new Date(parts[2], parts[1] - 1, parts[0], parts[3] || 0, parts[4] || 0, parts[5] || 0);
  if (isNaN(dateObj.getTime())) return "Invalid Date";
  return dateObj.toLocaleString("id-ID", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Fungsi parse tanggal (ISO atau DD/MM/YYYY) menjadi objek Date untuk perbandingan
const parseDateStringForComparison = (dateStr) => {
    if (!dateStr) return null;
    // Handles ISO format like YYYY-MM-DD...
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        const isoDate = new Date(dateStr);
        return isNaN(isoDate.getTime()) ? null : isoDate;
    }
    // Handles custom format DD/MM/YYYY...
    const parts = dateStr.split(/[\s/:]+/);
    if (parts.length < 3) return null;
    // Urutan: tahun, bulanIndex, hari
    const dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
    // Set jam ke awal hari untuk perbandingan adil
    dateObj.setHours(0, 0, 0, 0);
    return isNaN(dateObj.getTime()) ? null : dateObj;
};

// Fungsi parse tanggal (ISO atau DD/MM/YYYY) ke format pendek Indonesia
const parseAndFormatShortDate = (dateStr) => {
    const dateObj = parseDateStringForComparison(dateStr);
    if (!dateObj) return dateStr ? "Format salah" : "-";
    return dateObj.toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' });
};


const KelolaUserContent = () => {
  const { theme } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewVerified, setViewVerified] = useState("user");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [userRes, propRes] = await Promise.all([ axios.get(`${API_URL}users`), axios.get(`${API_URL}properties`) ]);
      setUsers(userRes.data.map((u) => ({ ...u, verified: u.verified === true })));
      setProperties(propRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Gunakan socket global
    socket.on("userUpdate", fetchData);
    socket.on("propertyUpdate", fetchData);
    socket.on("update_property", fetchData);
    return () => {
      socket.off("userUpdate");
      socket.off("propertyUpdate");
      socket.off("update_property");
    };
  }, [fetchData]);

  const updateUser = async (id, updatedFields, successMsg) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    try {
      const updatedUser = { ...target, ...updatedFields };
      await axios.put(`${API_URL}users/${id}`, updatedUser);
      socket.emit("userUpdate"); // Kirim sinyal update
      Swal.fire("Berhasil!", successMsg, "success");
    } catch (err) {
      Swal.fire("Error!", "Gagal memperbarui data user.", "error");
    }
  };

  const handleVerify = (id) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    Swal.fire({
        title: `Verifikasi "${target.username}"?`, icon: "question", showCancelButton: true,
        confirmButtonText: "Ya, verifikasi", cancelButtonText: "Batal", confirmButtonColor: "#28a745",
    }).then(res => res.isConfirmed && updateUser(id, { verified: true }, "User telah diverifikasi."));
  };

  const handleSuspend = (id) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    Swal.fire({
      title: `Suspend "${target.username}"?`,
      html: `
        <p>Pilih durasi suspend:</p>
        <div class="swal-radio-container">
          <label class="swal-radio-option"><input type="radio" name="suspend_duration" value="3" checked><span>3 Hari</span></label>
          <label class="swal-radio-option"><input type="radio" name="suspend_duration" value="7"><span>7 Hari</span></label>
          <label class="swal-radio-option"><input type="radio" name="suspend_duration" value="14"><span>14 Hari</span></label>
          <label class="swal-radio-option"><input type="radio" name="suspend_duration" value="30"><span>30 Hari</span></label>
        </div>
      `, // Pastikan class CSS ini ada
      customClass: { htmlContainer: 'swal-suspend-override' }, // Pastikan class CSS ini ada
      showCancelButton: true,
      confirmButtonText: "Suspend",
      cancelButtonText: "Batal",
      confirmButtonColor: "#f59e0b",
      preConfirm: () => document.querySelector('input[name="suspend_duration"]:checked').value,
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const durationInDays = parseInt(result.value, 10);
        const suspendedUntil = new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000);
        const formattedDate = formatToCustomTimestamp(suspendedUntil); // Format DD/MM/YYYY HH:mm:ss
        updateUser(id, { suspendedUntil: formattedDate }, `User disuspend selama ${durationInDays} hari.`);
      }
    });
  };

  const handleUnSuspend = (id) => updateUser(id, { suspendedUntil: null }, "Suspend untuk user telah dicabut.");

  const handleBanned = (id) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    Swal.fire({
        title: `Yakin ingin banned "${target.username}"?`, text: "Tindakan ini tidak bisa dibatalkan!", icon: "warning",
        showCancelButton: true, confirmButtonText: "Ya, banned", cancelButtonText: "Batal", confirmButtonColor: "#dc3545",
    }).then(res => {
        if (res.isConfirmed) {
            const timestamp = formatToCustomTimestamp(new Date()); // Format DD/MM/YYYY HH:mm:ss
            updateUser(id, { banned: true, bannedAt: timestamp }, "User telah dibanned.");
        }
    });
  };

  const handleDetail = (user) => {
    setSelectedUser({ ...user });
    setModalOpen(true);
  };

  const renderActionsForActive = (user) => (
    <>
      {!user.verified && (<motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleVerify(user.id)} title="Verifikasi User"><FaCheck className={styles.approveIcon} /></motion.button>)}
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleSuspend(user.id)} title="Suspend User"><FaClock className={styles.suspendIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleBanned(user.id)} title="Banned User"><FaBan className={styles.deleteIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDetail(user)} title="Lihat Detail"><FaInfoCircle className={styles.infoIcon} /></motion.button>
    </>
  );
  const renderActionsForSuspend = (user) => (
    <>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleUnSuspend(user.id)} title="Cabut Suspend"><FaUndo className={styles.unsuspendIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleBanned(user.id)} title="Banned User"><FaBan className={styles.deleteIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDetail(user)} title="Lihat Detail"><FaInfoCircle className={styles.infoIcon} /></motion.button>
    </>
  );
  const renderActionsForBanned = (user) => (
    <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDetail(user)} title="Lihat Detail"><FaInfoCircle className={styles.infoIcon} /></motion.button>
  );

  const renderStatus = {
    active: (user) => user.verified ? <span className={`${styles.badge} ${styles.approved}`}>Verified</span> : <span className={`${styles.badge} ${styles.pending}`}>Unverified</span>,
    suspend: () => <span className={`${styles.badge} ${styles.suspended}`}>Suspend</span>,
    banned: () => <span className={`${styles.badge} ${styles.banned}`}>Banned</span>,
  };

  // --- FILTER LOGIC ---
  const todayStartOfDay = new Date();
  todayStartOfDay.setHours(0, 0, 0, 0);

  const sortedUsers = [...users].sort((a, b) => {
      const dateA = parseDateStringForComparison(a.joinedAt);
      const dateB = parseDateStringForComparison(b.joinedAt);
      if (dateA && dateB) return dateB - dateA;
      if (dateA) return -1;
      if (dateB) return 1;
      return b.id - a.id;
  });

  const searchLower = searchTerm.toLowerCase();

  const baseFilteredUsers = sortedUsers
    .filter((u) => u.role !== "admin")
    .filter((u) =>
        (u.username?.toLowerCase() || '').includes(searchLower) ||
        (u.nama?.toLowerCase() || '').includes(searchLower)
    );

  const activeUsers = baseFilteredUsers
    .filter((u) => {
        const suspendedUntilDate = parseDateStringForComparison(u.suspendedUntil);
        return !u.banned && (!suspendedUntilDate || suspendedUntilDate < todayStartOfDay);
    })
    .filter((u) => (viewVerified === "verified" ? u.verified : !u.verified));

  // Filter suspend yang sudah diperbaiki
  const suspendUsers = baseFilteredUsers.filter((u) => {
      const suspendedUntilDate = parseDateStringForComparison(u.suspendedUntil);
      return !u.banned && suspendedUntilDate && suspendedUntilDate >= todayStartOfDay;
  });

  const bannedUsers = baseFilteredUsers.filter((u) => u.banned === true);
  // --- AKHIR FILTER LOGIC ---


  if (isLoading) {
    return ( <div className={styles.spinnerContainer}><div className={styles.spinner}></div></div> );
  }

  return (
    <div className={styles.container} data-theme={theme}>
      <div className={styles.header}>
        <div>
          <h2>Kelola User</h2>
          <p>Tinjau dan kelola semua pengguna terdaftar.</p>
        </div>
        <div className={styles.controls}>
            <div className={styles.searchContainer}>
                <FaSearch className={styles.searchIcon} />
                <input type="text" placeholder="Cari username atau nama..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className={styles.toggleContainer}>
                <span>Unverified</span>
                <label>
                    <input type="checkbox" checked={viewVerified === "verified"} onChange={() => setViewVerified(viewVerified === "verified" ? "user" : "verified")} />
                    <div className={styles.slider}><div className={styles.sliderBall}></div></div>
                </label>
                <span>Verified</span>
            </div>
        </div>
      </div>

      <TabelUser
        icon={<FaUsers />}
        title={`User Aktif (${activeUsers.length})`}
        users={activeUsers}
        properties={properties}
        renderActions={renderActionsForActive}
        renderStatus={renderStatus.active}
        emptyMessage={searchTerm ? "Tidak ada user aktif yang cocok." : "Tidak ada user aktif untuk filter ini."}
        dateColumnHeader="Tgl Bergabung"
        renderDateColumn={(user) => parseAndFormatShortDate(user.joinedAt)}
      />
      <TabelUser
        icon={<FaUserClock />}
        title={`User Suspend (${suspendUsers.length})`}
        users={suspendUsers}
        properties={properties}
        renderActions={renderActionsForSuspend}
        renderStatus={renderStatus.suspend}
        emptyMessage={searchTerm ? "Tidak ada user suspend yang cocok." : "Tidak ada user yang sedang disuspend."}
        dateColumnHeader="Suspend Berakhir"
        renderDateColumn={(user) => parseAndFormatShortDate(user.suspendedUntil)}
      />
      <TabelUser
        icon={<FaUserSlash />}
        title={`User Banned (${bannedUsers.length})`}
        users={bannedUsers}
        properties={properties}
        renderActions={renderActionsForBanned}
        renderStatus={renderStatus.banned}
        emptyMessage={searchTerm ? "Tidak ada user banned yang cocok." : "Tidak ada user yang dibanned."}
        dateColumnHeader="Tanggal Dibanned"
        renderDateColumn={(user) => parseAndFormatShortDate(user.bannedAt)}
      />

      {modalOpen && (
        <ModalUser
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          user={selectedUser}
          properties={properties.filter(p => String(p.ownerId) === String(selectedUser.id))}
          theme={theme}
          joinedDate={parseAndFormatDate(selectedUser.joinedAt)} // Modal mungkin butuh format panjang
        />
      )}
    </div>
  );
};

export default KelolaUserContent;