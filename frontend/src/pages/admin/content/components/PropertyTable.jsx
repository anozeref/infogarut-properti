// src/pages/admin/content/components/PropertyTable.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes, FaTrash, FaEdit, FaInfoCircle } from "react-icons/fa";
import styles from "../KelolaPropertiContent.module.css"; // Menggunakan style dari parent

const ITEMS_PER_PAGE = 5;

// Komponen untuk menampilkan baris aksi berdasarkan status properti
const TableActions = ({ prop, isPending, onDetail, onApprove, onReject, onEdit, onDelete }) => (
  <td className={styles.actions}>
    <button className={styles.iconBtn} onClick={() => onDetail(prop)}>
      <FaInfoCircle style={{ color: "#17a2b8" }} />
    </button>
    {isPending ? (
      <>
        <button className={styles.iconBtn} onClick={() => onApprove(prop.id)}>
          <FaCheck style={{ color: "#28a745" }} />
        </button>
        <button className={styles.iconBtn} onClick={() => onReject(prop.id)}>
          <FaTimes style={{ color: "#ffc107" }} />
        </button>
      </>
    ) : (
      <>
        <button className={styles.iconBtn} onClick={() => onEdit(prop)}>
          <FaEdit style={{ color: "#0d6efd" }} />
        </button>
        <button className={styles.iconBtn} onClick={() => onDelete(prop.id)}>
          <FaTrash style={{ color: "#dc3545" }} />
        </button>
      </>
    )}
  </td>
);

export default function PropertyTable({ properties, isPending, currentPage, getOwnerName, ...actions }) {
  return (
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
        {/* Table Body */}
        <tbody>
          <AnimatePresence>
            {properties.map((prop, idx) => (
              <motion.tr key={prop.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout>
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                <td>{prop.namaProperti}</td>
                <td>{prop.jenisProperti}</td>
                <td>{prop.tipeProperti}</td>
                <td>{prop.lokasi}</td>
                <td>{prop.harga ? Number(prop.harga).toLocaleString('id-ID') : "-"}</td>
                <td>{prop.periodeSewa || "-"}</td>
                <td>{getOwnerName(prop.ownerId)}</td>
                <td className={styles.statusCell}>
                  {prop.statusPostingan === "approved" ? <FaCheck className={styles.approved} /> : <FaTimes className={styles.pending} />}
                </td>
                <TableActions prop={prop} isPending={isPending} {...actions} />
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}