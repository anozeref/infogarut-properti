import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { io } from "socket.io-client";
import { FaCheck, FaTimes, FaTrash, FaEdit, FaInfoCircle, FaClock, FaCheckCircle, FaSearch, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "./KelolaPropertiContent.module.css";
import { API_URL, SOCKET_URL } from "../../../utils/constant";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import PropertyTable from "./components/tables/PropertyTable";
import EditPropertyModal from "./components/components/EditPropertyModal";
import DetailPropertyModal from "./components/components/DetailPropertyModal";

// Socket global untuk real-time updates
const socket = io(SOCKET_URL);

// Get admin ID dengan fallback ke "5"
const getAdminId = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    return user?.role === 'admin' ? user.id : "5";
  }
  return "5";
};
const adminId = getAdminId();

// Parse tanggal dari berbagai format
const smartParseDate = (dateString) => {
  if (!dateString) return new Date(0);
  let date = new Date(dateString);
  if (!isNaN(date.getTime())) return date;
  if (String(dateString).includes('/')) {
    const parts = dateString.split(/[\s/:]+/);
    if (parts.length >= 3) {
      date = new Date(parts[2], parts[1] - 1, parts[0], parts[3] || 0, parts[4] || 0, parts[5] || 0);
      if (!isNaN(date.getTime())) return date;
    }
  }
  return new Date(0);
};

// Format tanggal untuk tampilan
const formatDisplayDate = (dateObj) => {
  if (!dateObj || isNaN(dateObj.getTime()) || dateObj.getFullYear() <= 1970) return "-";
  return dateObj.toLocaleString("id-ID", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Halaman Kelola Properti Admin
export default function KelolaPropertiContent() {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvedView, setApprovedView] = useState("user");
  const [editData, setEditData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");

  // Get nama owner dari ID
  const getOwnerName = useCallback((ownerId) => {
    const user = users.find(u => String(u.id) === String(ownerId));
    return user ? user.username : "N/A";
  }, [users]);

  // Ambil data properti dan user
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

  // Setup socket listener
  useEffect(() => {
    fetchData(true);

    const handleSocketUpdate = () => {
        fetchData(false);
    };

    socket.on("propertyUpdate", handleSocketUpdate);
    socket.on("update_property", handleSocketUpdate);

    return () => {
      socket.off("propertyUpdate", handleSocketUpdate);
      socket.off("update_property", handleSocketUpdate);
    };
  }, [fetchData]);

  // Handler umum untuk aksi properti
  const handleAction = async (config) => {
    try {
      const result = await Swal.fire(config.swal);
      if (result.isConfirmed) {
        await config.action();

        // Kirim notifikasi via socket
        if (config.skipSocketEmit !== true && config.successData) {
            socket.emit("adminPropertyUpdate", config.successData);
        } else if (config.skipSocketEmit !== true) {
            socket.emit("propertyUpdate");
        }

        // Refresh data lokal
        fetchData(false);

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

  // Handler setujui properti
  const handleApprove = (prop) => handleAction({
    swal: { title: "Setujui Properti?", text: "Properti ini akan tampil di publik.", icon: "question", showCancelButton: true, confirmButtonText: "Ya, setujui", cancelButtonText: "Batal", confirmButtonColor: "#3085d6", cancelButtonColor: "#d33" },
    action: () => axios.patch(`${API_URL}properties/${prop.id}`, { statusPostingan: "approved" }),
    successMsg: { title: "Berhasil!", text: "Properti telah disetujui." },
    errorMsg: { title: "Gagal!", text: "Terjadi kesalahan saat menyetujui." },
    successData: { ownerId: prop.ownerId, namaProperti: prop.namaProperti, statusPostingan: "approved" }
  });

  // Handler tolak properti
  const handleReject = (prop) => handleAction({
    swal: { title: "Tolak Properti?", text: "Properti ini akan dipindahkan ke daftar ditolak.", icon: "warning", showCancelButton: true, confirmButtonText: "Ya, tolak", cancelButtonText: "Batal", confirmButtonColor: "#e74c3c", cancelButtonColor: "#6c757d" },
    action: () => axios.patch(`${API_URL}properties/${prop.id}`, { statusPostingan: "rejected" }),
    successMsg: { title: "Ditolak!", text: "Properti telah ditandai sebagai ditolak." },
    errorMsg: { title: "Gagal!", text: "Tidak dapat menolak properti." },
    successData: { ownerId: prop.ownerId, namaProperti: prop.namaProperti, statusPostingan: "rejected" }
  });

  // Handler hapus properti
  const handleDelete = (id) => handleAction({
    swal: { title: "Hapus Properti?", text: "Data ini akan dihapus permanen.", icon: "warning", showCancelButton: true, confirmButtonText: "Ya, hapus", cancelButtonText: "Batal", confirmButtonColor: "#d33", cancelButtonColor: "#3085d6" },
    action: () => axios.delete(`${API_URL}properties/${id}`),
    successMsg: { title: "Terhapus!", text: "Properti telah dihapus." },
    errorMsg: { title: "Gagal!", text: "Tidak dapat menghapus properti." }
  });

  // Handler simpan edit
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

  // Render tombol aksi untuk properti pending
  const renderActionsPending = (prop) => (
    <>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDetail(prop)} title="Lihat Detail"><FaInfoCircle className={styles.infoIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleApprove(prop)} title="Setujui"><FaCheck className={styles.approveIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleReject(prop)} title="Tolak"><FaTimes className={styles.rejectIcon} /></motion.button>
    </>
  );

  // Render tombol aksi untuk properti approved
  const renderActionsApproved = (prop) => (
    <>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDetail(prop)} title="Lihat Detail"><FaInfoCircle className={styles.infoIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleEdit(prop)} title="Edit"><FaEdit className={styles.editIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDelete(prop.id)} title="Hapus"><FaTrash className={styles.deleteIcon} /></motion.button>
    </>
  );

  // Render tombol aksi untuk properti rejected
  const renderActionsRejected = (prop) => (
    <>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleApprove(prop)} title="Setujui Ulang"><FaCheck className={styles.approveIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDelete(prop.id)} title="Hapus Permanen"><FaTrash className={styles.deleteIcon} /></motion.button>
    </>
  );

  // Filter data properti berdasarkan status
  const pendingProperties = properties.filter((p) => p.statusPostingan === "pending");
  const approvedProperties = properties.filter((p) => p.statusPostingan === "approved");
  const rejectedProperties = properties.filter((p) => p.statusPostingan === "rejected");

  const filteredApproved = approvedProperties.filter(p => (
    approvedView === "admin"
      ? String(p.ownerId) === String(adminId)
      : String(p.ownerId) !== String(adminId)
  ));

  // Filter berdasarkan pencarian
  const searchLower = globalSearch.toLowerCase();
  const filterLogic = p =>
    p.namaProperti?.toLowerCase().includes(searchLower) ||
    p.lokasi?.toLowerCase().includes(searchLower) ||
    getOwnerName(p.ownerId).toLowerCase().includes(searchLower);

  const finalPendingProperties = pendingProperties.filter(filterLogic);
  const finalApprovedProperties = filteredApproved.filter(filterLogic);
  const finalRejectedProperties = rejectedProperties.filter(filterLogic);

  // Tampilkan loading spinner
  if (isLoading) {
    return ( <div className={styles.spinnerContainer}><div className={styles.spinner}></div></div> );
  }

  // Render JSX utama
  return (
    <div className={styles.container}>
      {/* Header dengan pencarian */}
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

      {/* Tabel properti pending */}
      <PropertyTable
        icon={<FaClock />}
        title={`Properti Menunggu Persetujuan (${finalPendingProperties.length})`}
        properties={finalPendingProperties}
        users={users}
        renderActions={renderActionsPending}
        renderStatus={() => <span className={`${styles.badge} ${styles.pending}`}>Pending</span>}
        emptyMessage={globalSearch ? "Tidak ada properti pending yang cocok." : "Tidak ada properti yang menunggu persetujuan."}
      />

      {/* Tabel properti approved */}
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

      {/* Tabel properti rejected */}
      <PropertyTable
        icon={<FaTimesCircle />}
        title={`Properti Ditolak (${finalRejectedProperties.length})`}
        properties={finalRejectedProperties}
        users={users}
        renderActions={renderActionsRejected}
        renderStatus={() => <span className={`${styles.badge} ${styles.rejected}`}>Rejected</span>}
        emptyMessage={globalSearch ? "Tidak ada properti ditolak yang cocok." : "Tidak ada properti yang ditolak."}
      />

      {/* Modal edit properti */}
      {editData && (
        <EditPropertyModal
          data={editData}
          onClose={() => setEditData(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Modal detail properti */}
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