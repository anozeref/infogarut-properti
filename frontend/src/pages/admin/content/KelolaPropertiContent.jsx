// src/pages/admin/content/KelolaPropertiContent.jsx
import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { io } from "socket.io-client";
import { FaCheck, FaTimes, FaTrash, FaEdit, FaInfoCircle, FaClock, FaCheckCircle, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion"; 
import styles from "./KelolaPropertiContent.module.css";
import { API_URL } from "../../../utils/constant";
import PropertyTable from "./tables/PropertyTable";
import EditPropertyModal from "./components/EditPropertyModal";
import DetailPropertyModal from "./components/DetailPropertyModal";

const socket = io("http://localhost:3005");
const adminId = "5";

const parseAndFormatDate = (dateStr) => {
  if (!dateStr) return "-";
  const parts = dateStr.split(/[\s/:]+/);
  if (parts.length < 6) return "Format tanggal salah";
  const dateObj = new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4], parts[5]);
  if (isNaN(dateObj.getTime())) return "Invalid Date";
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
      const [propRes, userRes] = await Promise.all([ axios.get(`${API_URL}properties`), axios.get(`${API_URL}users`) ]);
      setProperties(propRes.data.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)));
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

  const handleApprove = async (id) => { /* ... (kode tidak berubah) ... */ };
  const handleReject = (id) => { /* ... (kode tidak berubah) ... */ };
  const handleDelete = (id) => { /* ... (kode tidak berubah) ... */ };
  const handleEdit = (prop) => setEditData(prop);
  const handleDetail = (prop) => setDetailData(prop);
  const handleSaveEdit = async (updated) => { /* ... (kode tidak berubah) ... */ };
  
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

  const pendingProperties = properties.filter((p) => p.statusPostingan === "pending");
  const approvedProperties = properties.filter((p) => p.statusPostingan === "approved");
  const filteredApproved = approvedProperties.filter(p => (approvedView === "admin" ? String(p.ownerId) === String(adminId) : String(p.ownerId) !== String(adminId)));
  
  const searchLower = globalSearch.toLowerCase();
  const finalPendingProperties = pendingProperties.filter(p =>
    p.namaProperti.toLowerCase().includes(searchLower) || p.lokasi.toLowerCase().includes(searchLower) || getOwnerName(p.ownerId).toLowerCase().includes(searchLower)
  );
  const finalApprovedProperties = filteredApproved.filter(p =>
    p.namaProperti.toLowerCase().includes(searchLower) || p.lokasi.toLowerCase().includes(searchLower) || getOwnerName(p.ownerId).toLowerCase().includes(searchLower)
  );

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
      
      {editData && <EditPropertyModal data={editData} onClose={() => setEditData(null)} onSave={handleSaveEdit} />}
      {detailData && <DetailPropertyModal data={detailData} onClose={() => setDetailData(null)} ownerName={getOwnerName(detailData.ownerId)} postedAt={parseAndFormatDate(detailData.postedAt)} />}
    </div>
  );
}