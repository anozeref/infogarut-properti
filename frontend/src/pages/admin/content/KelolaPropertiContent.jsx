import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaTrash, FaEdit, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import styles from "./KelolaPropertiContent.module.css";
import EditPropertyModal from "./EditPropertyModal";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3005"); // Socket.IO server
const ITEMS_PER_PAGE = 5;
const adminId = 5;

export default function KelolaPropertiContent() {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [approvedView, setApprovedView] = useState("user");
  const [editData, setEditData] = useState(null);

  // ---------- Fetch data ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, userRes] = await Promise.all([
          axios.get("http://localhost:3004/properties"),
          axios.get("http://localhost:3004/users"),
        ]);
        setProperties(propRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };
    fetchData();

    // Socket.IO
    socket.on("new_property", (newProp) => setProperties((prev) => [...prev, newProp]));
    socket.on("update_property", (updatedProp) =>
      setProperties((prev) => prev.map((p) => (p.id === updatedProp.id ? updatedProp : p)))
    );

    return () => {
      socket.off("new_property");
      socket.off("update_property");
    };
  }, []);

  // ---------- Helpers ----------
  const getOwnerName = (ownerId) => {
    const u = users.find((user) => user.id === ownerId);
    return u ? u.name : `ID: ${ownerId}`;
  };

  const getTimestamp = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d)) return "-";
    return `${String(d.getDate()).padStart(2, "0")}/${
      String(d.getMonth() + 1).padStart(2, "0")
    }/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  };

  const pendingProperties = properties.filter((p) => p.statusPostingan === "pending");
  const approvedProperties = properties.filter((p) => p.statusPostingan === "approved");

  // ---------- Actions ----------
  const handleApprove = async (id) => {
    const prop = properties.find((p) => p.id === id);
    if (!prop) return;
    const updated = { ...prop, statusPostingan: "approved" };
    try {
      await axios.put(`http://localhost:3004/properties/${id}`, updated);
      setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)));
      socket.emit("update_property", updated);
      Swal.fire("Disetujui!", "Properti berhasil disetujui.", "success");
    } catch (err) {
      Swal.fire("Error!", "Gagal menyetujui properti.", "error");
    }
  };

  const handleReject = async (id) => {
    Swal.fire({
      title: "Tolak Properti?",
      text: "Properti ini akan dihapus dari daftar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Tolak",
      cancelButtonText: "Batal"
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3004/properties/${id}`);
          setProperties((prev) => prev.filter((p) => p.id !== id));
          socket.emit("update_property", { id, deleted: true });
          Swal.fire("Ditolak!", "Properti telah dihapus.", "success");
        } catch (err) {
          Swal.fire("Error!", "Gagal menolak properti.", "error");
        }
      }
    });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Hapus Properti?",
      text: "Data tidak dapat dikembalikan.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal"
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3004/properties/${id}`);
          setProperties((prev) => prev.filter((p) => p.id !== id));
          socket.emit("update_property", { id, deleted: true });
          Swal.fire("Dihapus!", "Properti berhasil dihapus.", "success");
        } catch (err) {
          Swal.fire("Error!", "Gagal menghapus properti.", "error");
        }
      }
    });
  };

  const handleEdit = (prop) => setEditData(prop);

  const handleSaveEdit = async (updated) => {
    try {
      await axios.put(`http://localhost:3004/properties/${updated.id}`, updated);
      setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      socket.emit("update_property", updated);
      setEditData(null);
      Swal.fire("Berhasil!", "Data properti berhasil diperbarui.", "success");
    } catch (err) {
      Swal.fire("Error!", "Gagal memperbarui properti.", "error");
    }
  };

  const handleDetail = (prop) => {
    Swal.fire({
      title: `Detail Properti: ${prop.namaProperti}`,
      html: `
        <b>Jenis:</b> ${prop.jenisProperti}<br/>
        <b>Tipe:</b> ${prop.tipeProperti}<br/>
        <b>Lokasi:</b> ${prop.lokasi}, ${prop.kecamatan || "-"}, ${prop.desa || "-"}<br/>
        <b>Harga:</b> ${prop.harga.toLocaleString()}<br/>
        <b>Periode:</b> ${prop.periodeSewa || "-"}<br/>
        <b>Status:</b> ${prop.statusPostingan}<br/>
        <b>Owner:</b> ${getOwnerName(prop.ownerId)}<br/>
        <b>Posted At:</b> ${getTimestamp(prop.postedAt)}<br/>
        <b>Deskripsi:</b> ${prop.deskripsi || "-"}
      `,
      icon: "info",
      confirmButtonText: "Tutup"
    });
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

  // ---------- Render Table ----------
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
                <td>{prop.namaProperti}</td>
                <td>{prop.jenisProperti}</td>
                <td>{prop.tipeProperti}</td>
                <td>{prop.lokasi}</td>
                <td>{prop.harga.toLocaleString()}</td>
                <td>{prop.periodeSewa || "-"}</td>
                <td>{getOwnerName(prop.ownerId)}</td>
                <td className={styles.statusCell}>
                  {prop.statusPostingan === "approved" ? (
                    <FaCheck className={styles.approved} />
                  ) : (
                    <FaTimes className={styles.pending} />
                  )}
                </td>
                <td className={styles.actions}>
                  <button className={styles.iconBtn} onClick={() => handleDetail(prop)}>
                    <FaInfoCircle style={{ color: "#17a2b8" }} />
                  </button>
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
    (p) => (approvedView === "admin" ? p.ownerId === adminId : p.ownerId !== adminId)
  );

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <p className={styles.subHeader}>
          Properti Menunggu Persetujuan ({pendingProperties.length})
        </p>
        {renderTable(paginate(pendingProperties, currentPagePending), true)}
        {renderPagination(pendingProperties.length, currentPagePending, setCurrentPagePending)}
      </div>

      <div className={styles.section}>
        <div className={styles.header}>
          <p className={styles.subHeader}>
            Properti Disetujui ({filteredApproved.length})
          </p>
          <div className={styles.toggleContainer}>
            <span>User</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={approvedView === "admin"}
                onChange={() =>
                  setApprovedView(approvedView === "user" ? "admin" : "user")
                }
              />
              <span className={styles.slider}></span>
            </label>
            <span>Admin</span>
          </div>
        </div>

        {renderTable(paginate(filteredApproved, currentPageApproved))}
        {renderPagination(filteredApproved.length, currentPageApproved, setCurrentPageApproved)}
      </div>

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
