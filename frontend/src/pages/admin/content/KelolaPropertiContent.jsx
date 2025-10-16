import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { io } from "socket.io-client";
import { FaCheck, FaTimes, FaTrash, FaEdit, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion"; // <-- Import yang hilang sudah ditambahkan
import styles from "./KelolaPropertiContent.module.css";

// Import komponen-komponen
import Pagination from "./components/Pagination";
import ApprovedPropertyHeader from "./components/ApprovedPropertyHeader";
import EditPropertyModal from "./components/EditPropertyModal";
import DetailPropertyModal from "./components/DetailPropertyModal";

const socket = io("http://localhost:3005");
const ITEMS_PER_PAGE = 5;
const adminId = "5";

export default function KelolaPropertiContent() {
  // SECTION: State Management
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [approvedView, setApprovedView] = useState("user");
  const [editData, setEditData] = useState(null);
  const [detailData, setDetailData] = useState(null);

  // SECTION: Helper Functions
  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split(/[/ :]/);
    if (parts.length < 6) return null;
    const [day, month, year, hour, min, sec] = parts.map(Number);
    return new Date(year, month - 1, day, hour, min, sec);
  };

  const getTimestamp = (dateStr) => {
    const d = normalizeDate(dateStr);
    if (!d || isNaN(d)) return "-";
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
  };

  const getOwnerName = (ownerId) => {
    const user = users.find(u => String(u.id) === String(ownerId));
    return user ? user.username : `User ID: ${ownerId || "?"}`;
  };

  // SECTION: Data Fetching & Real-time Updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, userRes] = await Promise.all([
          axios.get("http://localhost:3004/properties"),
          axios.get("http://localhost:3004/users"),
        ]);
        const normalizedProps = propRes.data.map(p => ({ ...p, postedAt: p.postedAt || new Date().toISOString() }));
        setProperties(normalizedProps);
        setUsers(userRes.data);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };
    fetchData();

    socket.on("new_property", (newProp) => {
      const p = { ...newProp, postedAt: newProp.postedAt || new Date().toISOString() };
      setProperties((prev) => [...prev, p]);
    });

    socket.on("update_property", (updatedProp) => {
      if (updatedProp.deleted) {
        setProperties((prev) => prev.filter((p) => p.id !== updatedProp.id));
      } else {
        const p = { ...updatedProp, postedAt: updatedProp.postedAt || new Date().toISOString() };
        setProperties((prev) => prev.map((prop) => (prop.id === p.id ? p : prop)));
      }
    });

    return () => {
      socket.off("new_property");
      socket.off("update_property");
    };
  }, []);

  // SECTION: Action Handlers
  const handleApprove = async (id) => {
    const prop = properties.find((p) => p.id === id);
    if (!prop) return;
    const updated = { ...prop, statusPostingan: "approved" };
    try {
      await axios.put(`http://localhost:3004/properties/${id}`, updated);
      socket.emit("update_property", updated);
      Swal.fire("Disetujui!", "Properti berhasil disetujui.", "success");
    } catch (err) {
      Swal.fire("Error!", "Gagal menyetujui properti.", "error");
    }
  };

  const handleReject = (id) => {
    Swal.fire({ title: "Tolak Properti?", text: "Properti ini akan dihapus.", icon: "warning", showCancelButton: true, confirmButtonText: "Ya, Tolak", cancelButtonText: "Batal" })
      .then(async (res) => {
        if (res.isConfirmed) {
          try {
            await axios.delete(`http://localhost:3005/properties/${id}`);
            socket.emit("update_property", { id, deleted: true });
            Swal.fire("Ditolak!", "Properti telah dihapus.", "success");
          } catch (err) {
            Swal.fire("Error!", "Gagal menolak properti.", "error");
          }
        }
      });
  };

  const handleDelete = (id) => {
    Swal.fire({ title: "Hapus Properti?", text: "Data tidak dapat dikembalikan.", icon: "error", showCancelButton: true, confirmButtonText: "Hapus", cancelButtonText: "Batal" })
      .then(async (res) => {
        if (res.isConfirmed) {
          try {
            await axios.delete(`http://localhost:3005/properties/${id}`);
            socket.emit("update_property", { id, deleted: true });
            Swal.fire("Dihapus!", "Properti berhasil dihapus.", "success");
          } catch (err) {
            Swal.fire("Error!", "Gagal menghapus properti.", "error");
          }
        }
      });
  };

  const handleEdit = (prop) => setEditData(prop);
  const handleDetail = (prop) => setDetailData(prop);

  const handleSaveEdit = async (updated) => {
    try {
      await axios.put(`http://localhost:3004/properties/${updated.id}`, updated);
      socket.emit("update_property", updated);
      setEditData(null);
      Swal.fire("Berhasil!", "Data properti berhasil diperbarui.", "success");
    } catch (err) {
      Swal.fire("Error!", "Gagal memperbarui properti.", "error");
    }
  };
  
  // SECTION: Data Preparation for Render
  const paginate = (list, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
  };
  
  const pendingProperties = properties.filter((p) => p.statusPostingan === "pending");
  const approvedProperties = properties.filter((p) => p.statusPostingan === "approved");
  const filteredApproved = approvedProperties.filter(
    (p) => (approvedView === "admin" ? String(p.ownerId) === String(adminId) : String(p.ownerId) !== String(adminId))
  );

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <h2>Kelola Properti</h2>
        <p>Setujui, tolak, atau kelola semua properti yang ada di sistem.</p>
      </div>

      {/* Main Content Card with Unified Scroll */}
      <div className={styles.mainCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            {/* Table Header */}
            <thead>
              <tr>
                <th>No</th>
                <th>Judul</th>
                <th>Jenis</th>
                <th>Tipe</th>
                <th>Lokasi</th>
                <th>Harga</th>
                <th>Periode</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            {/* Body for Pending Properties */}
            <tbody>
              <tr className={styles.subheadingRow}>
                <td colSpan="10">
                  Properti Menunggu Persetujuan ({pendingProperties.length})
                </td>
              </tr>
              {paginate(pendingProperties, currentPagePending).map((prop, idx) => (
                <motion.tr key={prop.id} layout>
                  <td>{(currentPagePending - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  <td>{prop.namaProperti}</td>
                  <td>{prop.jenisProperti}</td>
                  <td>{prop.tipeProperti}</td>
                  <td>{prop.lokasi}</td>
                  <td>{prop.harga ? Number(prop.harga).toLocaleString('id-ID') : "-"}</td>
                  <td>{prop.periodeSewa || "-"}</td>
                  <td>{getOwnerName(prop.ownerId)}</td>
                  <td className={styles.statusCell}><FaTimes className={styles.pending} /></td>
                  <td className={styles.actions}>
                    <button className={styles.iconBtn} onClick={() => handleDetail(prop)}><FaInfoCircle style={{ color: "#17a2b8" }} /></button>
                    <button className={styles.iconBtn} onClick={() => handleApprove(prop.id)}><FaCheck style={{ color: "#28a745" }} /></button>
                    <button className={styles.iconBtn} onClick={() => handleReject(prop.id)}><FaTimes style={{ color: "#ffc107" }} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>

            {/* Body for Approved Properties */}
            <tbody>
              <tr className={styles.subheadingRow}>
                <td colSpan="10">
                  <ApprovedPropertyHeader
                    count={filteredApproved.length}
                    view={approvedView}
                    onViewChange={setApprovedView}
                  />
                </td>
              </tr>
              {paginate(filteredApproved, currentPageApproved).map((prop, idx) => (
                <motion.tr key={prop.id} layout>
                  <td>{(currentPageApproved - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  <td>{prop.namaProperti}</td>
                  <td>{prop.jenisProperti}</td>
                  <td>{prop.tipeProperti}</td>
                  <td>{prop.lokasi}</td>
                  <td>{prop.harga ? Number(prop.harga).toLocaleString('id-ID') : "-"}</td>
                  <td>{prop.periodeSewa || "-"}</td>
                  <td>{getOwnerName(prop.ownerId)}</td>
                  <td className={styles.statusCell}><FaCheck className={styles.approved} /></td>
                  <td className={styles.actions}>
                    <button className={styles.iconBtn} onClick={() => handleDetail(prop)}><FaInfoCircle style={{ color: "#17a2b8" }} /></button>
                    <button className={styles.iconBtn} onClick={() => handleEdit(prop)}><FaEdit style={{ color: "#0d6efd" }} /></button>
                    <button className={styles.iconBtn} onClick={() => handleDelete(prop.id)}><FaTrash style={{ color: "#dc3545" }} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Container */}
        <div className={styles.paginationContainer}>
          <Pagination
              totalItems={pendingProperties.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPagePending}
              onPageChange={setCurrentPagePending}
            />
          <Pagination
              totalItems={filteredApproved.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPageApproved}
              onPageChange={setCurrentPageApproved}
            />
        </div>
      </div>

      {/* Modals */}
      {editData && (
        <EditPropertyModal data={editData} onClose={() => setEditData(null)} onSave={handleSaveEdit} />
      )}
      
      {detailData && (
        <DetailPropertyModal data={detailData} onClose={() => setDetailData(null)} ownerName={getOwnerName(detailData.ownerId)} postedAt={getTimestamp(detailData.postedAt)} />
      )}
    </div>
  );
}