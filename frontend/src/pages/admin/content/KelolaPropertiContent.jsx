// src/pages/admin/content/KelolaPropertiContent.jsx
import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { io } from "socket.io-client";
import { FaCheck, FaTimes, FaTrash, FaEdit, FaInfoCircle, FaClock, FaCheckCircle, FaSearch, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "./KelolaPropertiContent.module.css";
import { API_URL } from "../../../utils/constant";
import PropertyTable from "./tables/PropertyTable";
import EditPropertyModal from "./components/EditPropertyModal";
import DetailPropertyModal from "./components/DetailPropertyModal";

// 1. BUAT SOCKET GLOBAL (seperti KelolaUser)
const socket = io("http://localhost:3005");

const adminId = "5";

const smartParseDate = (dateString) => {
  if (!dateString) return new Date(0);
  let date = new Date(dateString);
  if (!isNaN(date.getTime())) return date;
  if (String(dateString).includes('/')) {
    const parts = dateString.split(/[\s/:]+/);
    if (parts.length >= 3) {
       // Urutan: tahun, bulanIndex, hari, [jam], [menit], [detik]
      date = new Date(parts[2], parts[1] - 1, parts[0], parts[3] || 0, parts[4] || 0, parts[5] || 0);
      if (!isNaN(date.getTime())) return date;
    }
  }
  // console.warn(`[smartParseDate] Gagal mem-parsing tanggal: ${dateString}`); // Hapus/komentari log ini jika sudah oke
  return new Date(0);
};

const formatDisplayDate = (dateObj) => {
  if (!dateObj || isNaN(dateObj.getTime()) || dateObj.getFullYear() <= 1970) return "-";
  return dateObj.toLocaleString("id-ID", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};


export default function KelolaPropertiContent() {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvedView, setApprovedView] = useState("user");
  const [editData, setEditData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");
  // Hapus state socket

  const getOwnerName = useCallback((ownerId) => {
    const user = users.find(u => String(u.id) === String(ownerId));
    return user ? user.username : "N/A";
  }, [users]);

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const [propRes, userRes] = await Promise.all([
        axios.get(`${API_URL}properties`),
        axios.get(`${API_URL}users`)
      ]);
      setProperties(propRes.data.sort((a, b) => smartParseDate(b.postedAt) - smartParseDate(a.postedAt)));
      setUsers(userRes.data);
    } catch (err) {
      console.error("Gagal fetch data:", err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  // useEffect HANYA pasang/lepas listener
  useEffect(() => {
    fetchData(true); // Tampilkan loading saat mount awal

    const handleSocketUpdate = () => {
        // console.log("[Socket] Menerima sinyal update dari server, refresh data...");
        fetchData(false);
    };

    socket.on("propertyUpdate", handleSocketUpdate);
    socket.on("update_property", handleSocketUpdate);

    return () => {
      // console.log("[Cleanup] Hapus listener socket.");
      socket.off("propertyUpdate", handleSocketUpdate);
      socket.off("update_property", handleSocketUpdate);
    };
  }, [fetchData]);

  // handleAction diubah: Panggil fetchData() MANUAL setelah sukses
  const handleAction = async (config) => {
    try {
      const result = await Swal.fire(config.swal);
      if (result.isConfirmed) {
        await config.action(); // Lakukan axios patch/delete

        // Kirim sinyal notifikasi (jika ada) via socket global
        if (config.skipSocketEmit !== true && config.successData) {
            // console.log("[handleAction] Mengirim sinyal notif 'adminPropertyUpdate'...");
            socket.emit("adminPropertyUpdate", config.successData);
        } else if (config.skipSocketEmit !== true) {
            // Fallback
            // console.log("[handleAction] Mengirim sinyal refresh umum 'propertyUpdate' (fallback)...");
            socket.emit("propertyUpdate");
        }

        // --- INI KUNCINYA ---
        // Panggil fetchData() manual untuk refresh UI LOKAL
        // console.log("[handleAction] Aksi sukses, panggil fetchData manual untuk refresh UI...");
        fetchData(false); // Panggil tanpa loading

        if (config.successMsg) {
          Swal.fire(config.successMsg.title, config.successMsg.text, "success");
        }
        if(config.onSuccess) config.onSuccess();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || config.errorMsg?.text || "Terjadi kesalahan.";
      Swal.fire(config.errorMsg?.title || "Gagal!", errorMsg, "error");
    }
  };

  // Handler spesifik per tombol
  const handleApprove = (prop) => handleAction({
    swal: { title: "Setujui Properti?", text: "Properti ini akan tampil di publik.", icon: "question", showCancelButton: true, confirmButtonText: "Ya, setujui", cancelButtonText: "Batal", confirmButtonColor: "#3085d6", cancelButtonColor: "#d33" },
    action: () => axios.patch(`${API_URL}properties/${prop.id}`, { statusPostingan: "approved" }),
    successMsg: { title: "Berhasil!", text: "Properti telah disetujui." },
    errorMsg: { title: "Gagal!", text: "Terjadi kesalahan saat menyetujui." },
    successData: { ownerId: prop.ownerId, namaProperti: prop.namaProperti, statusPostingan: "approved" }
  });

  const handleReject = (prop) => handleAction({
    swal: { title: "Tolak Properti?", text: "Properti ini akan dipindahkan ke daftar ditolak.", icon: "warning", showCancelButton: true, confirmButtonText: "Ya, tolak", cancelButtonText: "Batal", confirmButtonColor: "#e74c3c", cancelButtonColor: "#6c757d" },
    action: () => axios.patch(`${API_URL}properties/${prop.id}`, { statusPostingan: "rejected" }),
    successMsg: { title: "Ditolak!", text: "Properti telah ditandai sebagai ditolak." },
    errorMsg: { title: "Gagal!", text: "Tidak dapat menolak properti." },
    successData: { ownerId: prop.ownerId, namaProperti: prop.namaProperti, statusPostingan: "rejected" }
  });

  const handleDelete = (id) => handleAction({
    swal: { title: "Hapus Properti?", text: "Data ini akan dihapus permanen.", icon: "warning", showCancelButton: true, confirmButtonText: "Ya, hapus", cancelButtonText: "Batal", confirmButtonColor: "#d33", cancelButtonColor: "#3085d6" },
    action: () => axios.delete(`${API_URL}properties/${id}`),
    // skipSocketEmit tidak lagi terlalu relevan karena refresh manual
    successMsg: { title: "Terhapus!", text: "Properti telah dihapus." },
    errorMsg: { title: "Gagal!", text: "Tidak dapat menghapus properti." }
  });

  const handleSaveEdit = (updated) => handleAction({
    swal: { title: "Simpan Perubahan?", text: "Perubahan data akan disimpan.", icon: "question", showCancelButton: true, confirmButtonText: "Simpan", cancelButtonText: "Batal", confirmButtonColor: "#3085d6", cancelButtonColor: "#aaa" },
    action: () => axios.patch(`${API_URL}properties/${updated.id}`, updated),
    onSuccess: () => setEditData(null),
    successMsg: { title: "Tersimpan!", text: "Data properti berhasil diperbarui." },
    errorMsg: { title: "Gagal!", text: "Tidak dapat menyimpan perubahan." },
    successData: { ownerId: updated.ownerId, namaProperti: updated.namaProperti, statusPostingan: updated.statusPostingan }
  });

  const handleEdit = (prop) => setEditData(prop);
  const handleDetail = (prop) => setDetailData(prop);

  // Render fungsi untuk tombol aksi di tabel
  const renderActionsPending = (prop) => (
    <>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDetail(prop)} title="Lihat Detail"><FaInfoCircle className={styles.infoIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleApprove(prop)} title="Setujui"><FaCheck className={styles.approveIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleReject(prop)} title="Tolak"><FaTimes className={styles.rejectIcon} /></motion.button>
    </>
  );

  const renderActionsApproved = (prop) => (
    <>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDetail(prop)} title="Lihat Detail"><FaInfoCircle className={styles.infoIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleEdit(prop)} title="Edit"><FaEdit className={styles.editIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDelete(prop.id)} title="Hapus"><FaTrash className={styles.deleteIcon} /></motion.button>
    </>
  );

  const renderActionsRejected = (prop) => (
    <>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleApprove(prop)} title="Setujui Ulang"><FaCheck className={styles.approveIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDelete(prop.id)} title="Hapus Permanen"><FaTrash className={styles.deleteIcon} /></motion.button>
    </>
  );

  // Logika filter data properti
  const pendingProperties = properties.filter((p) => p.statusPostingan === "pending");
  const approvedProperties = properties.filter((p) => p.statusPostingan === "approved");
  const rejectedProperties = properties.filter((p) => p.statusPostingan === "rejected");

  const filteredApproved = approvedProperties.filter(p => (
    approvedView === "admin"
      ? String(p.ownerId) === String(adminId)
      : String(p.ownerId) !== String(adminId)
  ));

  const searchLower = globalSearch.toLowerCase();
  const filterLogic = p =>
    p.namaProperti?.toLowerCase().includes(searchLower) ||
    p.lokasi?.toLowerCase().includes(searchLower) ||
    getOwnerName(p.ownerId).toLowerCase().includes(searchLower);

  const finalPendingProperties = pendingProperties.filter(filterLogic);
  const finalApprovedProperties = filteredApproved.filter(filterLogic);
  const finalRejectedProperties = rejectedProperties.filter(filterLogic);

  // Tampilkan spinner jika loading
  if (isLoading) {
    return ( <div className={styles.spinnerContainer}><div className={styles.spinner}></div></div> );
  }

  // Render JSX utama
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2>Kelola Properti</h2>
          <p>Pusat persetujuan dan manajemen untuk semua properti.</p>
        </div>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Cari judul, lokasi, owner..."
            className={styles.searchInput}
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabel Pending */}
      <PropertyTable
        icon={<FaClock />}
        title={`Properti Menunggu Persetujuan (${finalPendingProperties.length})`}
        properties={finalPendingProperties}
        users={users}
        renderActions={renderActionsPending}
        renderStatus={() => <span className={`${styles.badge} ${styles.pending}`}>Pending</span>}
        emptyMessage={globalSearch ? "Tidak ada properti pending yang cocok." : "Tidak ada properti yang menunggu persetujuan."}
      />

      {/* Tabel Approved */}
      <PropertyTable
        icon={<FaCheckCircle />}
        title={`Properti Disetujui (${finalApprovedProperties.length})`}
        properties={finalApprovedProperties}
        users={users}
        renderActions={renderActionsApproved}
        renderStatus={() => <span className={`${styles.badge} ${styles.approved}`}>Approved</span>}
        emptyMessage={globalSearch ? "Tidak ada properti disetujui yang cocok." : "Tidak ada properti yang disetujui untuk filter ini."}
        approvedViewConfig={{ view: approvedView, onViewChange: setApprovedView }}
      />

      {/* Tabel Rejected */}
      <PropertyTable
        icon={<FaTimesCircle />}
        title={`Properti Ditolak (${finalRejectedProperties.length})`}
        properties={finalRejectedProperties}
        users={users}
        renderActions={renderActionsRejected}
        renderStatus={() => <span className={`${styles.badge} ${styles.rejected}`}>Rejected</span>}
        emptyMessage={globalSearch ? "Tidak ada properti ditolak yang cocok." : "Tidak ada properti yang ditolak."}
      />

      {/* Modal Edit */}
      {editData && (
        <EditPropertyModal
          data={editData}
          onClose={() => setEditData(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Modal Detail */}
      {detailData && (
        <DetailPropertyModal
          data={detailData}
          onClose={() => setDetailData(null)}
          ownerName={getOwnerName(detailData.ownerId)}
          postedAt={formatDisplayDate(smartParseDate(detailData.postedAt))}
        />
      )}
    </div>
  );
}