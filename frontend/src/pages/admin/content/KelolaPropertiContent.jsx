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

const socket = io("http://localhost:3005");
const adminId = "5";

/**
 * Parses a date string robustly from various formats (DD/MM/YYYY or ISO).
 * @param {string} dateString The date string to parse.
 * @returns {Date} A Date object. Returns epoch time for invalid dates to ensure they sort last.
 */
const smartParseDate = (dateString) => {
  if (!dateString) return new Date(0);
  // Handle "DD/MM/YYYY HH:mm:ss" format
  if (String(dateString).includes('/')) {
    const parts = dateString.split(/[\s/:]+/);
    return new Date(parts[2], parts[1] - 1, parts[0], parts[3] || 0, parts[4] || 0, parts[5] || 0);
  }
  // Handle other standard formats like ISO 8601
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date(0) : date;
};

/**
 * Formats a Date object into a readable Indonesian string.
 * @param {Date} dateObj The Date object to format.
 * @returns {string} The formatted date string or "-".
 */
const formatDisplayDate = (dateObj) => {
  if (isNaN(dateObj.getTime()) || dateObj.getFullYear() <= 1970) return "-";
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

  const getOwnerName = useCallback((ownerId) => {
    const user = users.find(u => String(u.id) === String(ownerId));
    return user ? user.username : "N/A";
  }, [users]);

  const fetchData = useCallback(async () => {
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
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    socket.on("propertyUpdate", fetchData);
    return () => socket.off("propertyUpdate");
  }, [fetchData]);

  const handleAction = async (config) => {
    try {
      const result = await Swal.fire(config.swal);
      if (result.isConfirmed) {
        await config.action();
        socket.emit("propertyUpdate");
        if (config.successMsg) {
          Swal.fire(config.successMsg.title, config.successMsg.text, "success");
        }
        if(config.onSuccess) config.onSuccess();
      }
    } catch (error) {
      Swal.fire(config.errorMsg.title, config.errorMsg.text, "error");
    }
  };

  const handleApprove = (id) => handleAction({
    swal: { title: "Setujui Properti?", text: "Properti ini akan tampil di publik.", icon: "question", showCancelButton: true, confirmButtonText: "Ya, setujui", cancelButtonText: "Batal", confirmButtonColor: "#3085d6", cancelButtonColor: "#d33" },
    action: () => axios.patch(`${API_URL}properties/${id}`, { statusPostingan: "approved" }),
    successMsg: { title: "Berhasil!", text: "Properti telah disetujui." },
    errorMsg: { title: "Gagal!", text: "Terjadi kesalahan saat menyetujui." }
  });

  const handleReject = (id) => handleAction({
    swal: { title: "Tolak Properti?", text: "Properti ini akan dipindahkan ke daftar ditolak.", icon: "warning", showCancelButton: true, confirmButtonText: "Ya, tolak", cancelButtonText: "Batal", confirmButtonColor: "#e74c3c", cancelButtonColor: "#6c757d" },
    action: () => axios.patch(`${API_URL}properties/${id}`, { statusPostingan: "rejected" }),
    successMsg: { title: "Ditolak!", text: "Properti telah ditandai sebagai ditolak." },
    errorMsg: { title: "Gagal!", text: "Tidak dapat menolak properti." }
  });

  const handleDelete = (id) => handleAction({
    swal: { title: "Hapus Properti?", text: "Data ini akan dihapus permanen.", icon: "warning", showCancelButton: true, confirmButtonText: "Ya, hapus", cancelButtonText: "Batal", confirmButtonColor: "#d33", cancelButtonColor: "#3085d6" },
    action: () => axios.delete(`${API_URL}properties/${id}`),
    successMsg: { title: "Terhapus!", text: "Properti telah dihapus." },
    errorMsg: { title: "Gagal!", text: "Tidak dapat menghapus properti." }
  });

  const handleSaveEdit = (updated) => handleAction({
    swal: { title: "Simpan Perubahan?", text: "Perubahan data akan disimpan.", icon: "question", showCancelButton: true, confirmButtonText: "Simpan", cancelButtonText: "Batal", confirmButtonColor: "#3085d6", cancelButtonColor: "#aaa" },
    action: () => axios.patch(`${API_URL}properties/${updated.id}`, updated),
    onSuccess: () => setEditData(null),
    successMsg: { title: "Tersimpan!", text: "Data properti berhasil diperbarui." },
    errorMsg: { title: "Gagal!", text: "Tidak dapat menyimpan perubahan." }
  });

  const handleEdit = (prop) => setEditData(prop);
  const handleDetail = (prop) => setDetailData(prop);

  const renderActionsPending = (prop) => (
    <>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDetail(prop)} title="Lihat Detail"><FaInfoCircle className={styles.infoIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleApprove(prop.id)} title="Setujui"><FaCheck className={styles.approveIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleReject(prop.id)} title="Tolak"><FaTimes className={styles.rejectIcon} /></motion.button>
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
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleApprove(prop.id)} title="Setujui Ulang"><FaCheck className={styles.approveIcon} /></motion.button>
      <motion.button whileHover={{ y: -2 }} className={styles.iconBtn} onClick={() => handleDelete(prop.id)} title="Hapus Permanen"><FaTrash className={styles.deleteIcon} /></motion.button>
    </>
  );

  const pendingProperties = properties.filter((p) => p.statusPostingan === "pending");
  const approvedProperties = properties.filter((p) => p.statusPostingan === "approved");
  const rejectedProperties = properties.filter((p) => p.statusPostingan === "rejected");

  const filteredApproved = approvedProperties.filter(p => (approvedView === "admin" ? String(p.ownerId) === String(adminId) : String(p.ownerId) !== String(adminId)));
  
  const searchLower = globalSearch.toLowerCase();
  const filterLogic = p => p.namaProperti.toLowerCase().includes(searchLower) || p.lokasi.toLowerCase().includes(searchLower) || getOwnerName(p.ownerId).toLowerCase().includes(searchLower);

  const finalPendingProperties = pendingProperties.filter(filterLogic);
  const finalApprovedProperties = filteredApproved.filter(filterLogic);
  const finalRejectedProperties = rejectedProperties.filter(filterLogic);

  if (isLoading) {
    return ( <div className={styles.spinnerContainer}><div className={styles.spinner}></div></div> );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Kelola Properti</h2>
          <p>Pusat persetujuan dan manajemen untuk semua properti.</p>
        </div>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input type="text" placeholder="Cari judul, lokasi, owner..." className={styles.searchInput} value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} />
        </div>
      </div>
      
      <PropertyTable
        icon={<FaClock />}
        title={`Properti Menunggu Persetujuan (${finalPendingProperties.length})`}
        properties={finalPendingProperties}
        users={users}
        renderActions={renderActionsPending}
        renderStatus={() => <span className={`${styles.badge} ${styles.pending}`}>Pending</span>}
        emptyMessage={globalSearch ? "Tidak ada properti pending yang cocok." : "Tidak ada properti yang menunggu persetujuan."}
      />

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

      <PropertyTable
        icon={<FaTimesCircle />}
        title={`Properti Ditolak (${finalRejectedProperties.length})`}
        properties={finalRejectedProperties}
        users={users}
        renderActions={renderActionsRejected}
        renderStatus={() => <span className={`${styles.badge} ${styles.rejected}`}>Rejected</span>}
        emptyMessage={globalSearch ? "Tidak ada properti ditolak yang cocok." : "Tidak ada properti yang ditolak."}
      />
      
      {editData && <EditPropertyModal data={editData} onClose={() => setEditData(null)} onSave={handleSaveEdit} />}
      {detailData && <DetailPropertyModal data={detailData} onClose={() => setDetailData(null)} ownerName={getOwnerName(detailData.ownerId)} postedAt={formatDisplayDate(smartParseDate(detailData.postedAt))} />}
    </div>
  );
}