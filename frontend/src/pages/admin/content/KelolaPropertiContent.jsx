import React, { useState } from "react";
import { FaCheck, FaTimes, FaTrash, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import styles from "./KelolaPropertiContent.module.css";
import EditPropertyModal from "./EditPropertyModal";

const propertiesData = [
  { id: 1, title: "Rumah Minimalis", jenis: "Jual", tipe: "Rumah", location: "Tarogong", price: 350000000, periode: "1 tahun", status: "approved", owner: "Admin", ownerId: 1 },
  { id: 2, title: "Kost Mahasiswa Cibatu", jenis: "Sewa", tipe: "Kost", location: "Cibatu", price: 1200000, periode: "1 bulan", status: "pending", owner: "Budi", ownerId: 2 },
  { id: 3, title: "Vila Eksklusif Cikajang", jenis: "Cicilan", tipe: "Villa", location: "Cikajang", price: 1500000000, periode: "2 tahun", status: "approved", owner: "Citra", ownerId: 3 },
  { id: 4, title: "Ruko Strategis Tarogong", jenis: "Dijual", tipe: "Ruko", location: "Tarogong", price: 850000000, periode: "-", status: "approved", owner: "Andi", ownerId: 2 },
  { id: 5, title: "Rumah 3 Kamar Garut Kota", jenis: "Sewa", tipe: "Rumah", location: "Garut Kota", price: 2500000, periode: "3 bulan", status: "pending", owner: "Dina", ownerId: 4 }
];

const ITEMS_PER_PAGE = 5;
const adminId = 1;

export default function KelolaPropertiContent() {
  const [properties, setProperties] = useState(propertiesData);
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [approvedView, setApprovedView] = useState("user");
  const [editData, setEditData] = useState(null);

  const pendingProperties = properties.filter(p => p.status === "pending");
  const approvedProperties = properties.filter(p => p.status === "approved");

  // ---------- Aksi ----------
  const handleApprove = id => {
    Swal.fire({
      title: "Setujui Properti?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Setujui",
      cancelButtonText: "Batal"
    }).then(res => {
      if (res.isConfirmed) {
        setProperties(prev =>
          prev.map(p => (p.id === id ? { ...p, status: "approved" } : p))
        );
        Swal.fire("Disetujui!", "Properti berhasil disetujui.", "success");
      }
    });
  };

  const handleReject = id => {
    Swal.fire({
      title: "Tolak Properti?",
      text: "Properti ini akan dihapus dari daftar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Tolak",
      cancelButtonText: "Batal"
    }).then(res => {
      if (res.isConfirmed) {
        setProperties(prev => prev.filter(p => p.id !== id));
        Swal.fire("Ditolak!", "Properti telah dihapus.", "success");
      }
    });
  };

  const handleDelete = id => {
    Swal.fire({
      title: "Hapus Properti?",
      text: "Data tidak dapat dikembalikan.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal"
    }).then(res => {
      if (res.isConfirmed) {
        setProperties(prev => prev.filter(p => p.id !== id));
        Swal.fire("Dihapus!", "Properti berhasil dihapus.", "success");
      }
    });
  };

  const handleEdit = prop => {
    setEditData(prop); // buka modal
  };

  const handleSaveEdit = updated => {
    setProperties(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    setEditData(null);
    Swal.fire("Berhasil!", "Data properti berhasil diperbarui.", "success");
  };

  // ---------- Pagination ----------
  const paginate = (list, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
  };

  const renderPagination = (totalItems, currentPage, setPage) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;
    return (
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePage : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  // ---------- Table ----------
  const renderTable = (list, isPending = false) => (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
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
        <tbody>
          <AnimatePresence>
            {list.map((prop, idx) => (
              <motion.tr
                key={prop.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <td>{idx + 1}</td>
                <td>{prop.title}</td>
                <td>{prop.jenis}</td>
                <td>{prop.tipe}</td>
                <td>{prop.location}</td>
                <td>{prop.price.toLocaleString()}</td>
                <td>{prop.periode}</td>
                <td>{prop.owner}</td>
                <td className={styles.statusCell}>
                  {prop.status === "approved" ? (
                    <FaCheck className={styles.approved} />
                  ) : (
                    <FaTimes className={styles.pending} />
                  )}
                </td>
                <td className={styles.actions}>
                  {isPending ? (
                    <>
                      <button className={styles.iconBtn} onClick={() => handleApprove(prop.id)}>
                        <FaCheck style={{ color: "#28a745" }} />
                      </button>
                      <button className={styles.iconBtn} onClick={() => handleReject(prop.id)}>
                        <FaTimes style={{ color: "#ffc107" }} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className={styles.iconBtn} onClick={() => handleEdit(prop)}>
                        <FaEdit style={{ color: "#0d6efd" }} />
                      </button>
                      <button className={styles.iconBtn} onClick={() => handleDelete(prop.id)}>
                        <FaTrash style={{ color: "#dc3545" }} />
                      </button>
                    </>
                  )}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );

  const filteredApproved = approvedProperties.filter(
    p => approvedView === "admin" ? p.ownerId === adminId : p.ownerId !== adminId
  );

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <p className={styles.subHeader}>Properti Menunggu Persetujuan ({pendingProperties.length})</p>
        {renderTable(paginate(pendingProperties, currentPagePending), true)}
        {renderPagination(pendingProperties.length, currentPagePending, setCurrentPagePending)}
      </div>

      <div className={styles.section}>
        <div className={styles.header}>
          <p className={styles.subHeader}>Properti Disetujui ({filteredApproved.length})</p>
          <div className={styles.toggleContainer}>
            <span>User</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={approvedView === "admin"}
                onChange={() => setApprovedView(approvedView === "user" ? "admin" : "user")}
              />
              <span className={styles.slider}></span>
            </label>
            <span>Admin</span>
          </div>
        </div>

        {renderTable(paginate(filteredApproved, currentPageApproved))}
        {renderPagination(filteredApproved.length, currentPageApproved, setCurrentPageApproved)}
      </div>

      {/* Modal Edit */}
      {editData && (
        <EditPropertyModal
          data={editData}
          onClose={() => setEditData(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
