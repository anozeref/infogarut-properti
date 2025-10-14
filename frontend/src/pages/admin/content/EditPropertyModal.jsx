import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import styles from "./EditPropertyModal.module.css";

export default function EditPropertyModal({ data, onClose, onSave }) {
  const [form, setForm] = useState({
    id: data.id,
    namaProperti: data.namaProperti || "",
    jenisProperti: data.jenisProperti || "",
    tipeProperti: data.tipeProperti || "",
    lokasi: data.lokasi || "",
    harga: data.harga || "",
    periodeSewa: data.periodeSewa || "",
    deskripsi: data.deskripsi || "",
    statusPostingan: data.statusPostingan || "approved",
    ownerId: data.ownerId,
    postedAt: data.postedAt,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi dasar
    if (!form.namaProperti || !form.harga || form.harga <= 0) {
      Swal.fire("Gagal", "Pastikan semua kolom terisi dengan benar.", "error");
      return;
    }

    // Konfirmasi sebelum simpan
    const result = await Swal.fire({
      title: "Simpan Perubahan?",
      text: "Data properti akan diperbarui di database.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    // Loading alert
    Swal.fire({
      title: "Menyimpan...",
      text: "Mohon tunggu sebentar.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // Jalankan callback parent untuk update DB
      await onSave(form);
      Swal.close(); // tutup loading
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan.", "error");
    }
  };

  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <h3>Edit Properti</h3>
        <form onSubmit={handleSubmit}>
          <label>Nama Properti</label>
          <input
            name="namaProperti"
            value={form.namaProperti}
            onChange={handleChange}
            required
          />

          <label>Jenis Properti</label>
          <input
            name="jenisProperti"
            value={form.jenisProperti}
            onChange={handleChange}
            required
          />

          <label>Tipe Properti</label>
          <input
            name="tipeProperti"
            value={form.tipeProperti}
            onChange={handleChange}
            required
          />

          <label>Lokasi</label>
          <input
            name="lokasi"
            value={form.lokasi}
            onChange={handleChange}
            required
          />

          <label>Harga (Rp)</label>
          <input
            name="harga"
            type="number"
            value={form.harga}
            onChange={handleChange}
            required
          />

          <label>Periode Sewa</label>
          <input
            name="periodeSewa"
            value={form.periodeSewa}
            onChange={handleChange}
          />

          <label>Deskripsi</label>
          <textarea
            name="deskripsi"
            rows="3"
            value={form.deskripsi}
            onChange={handleChange}
          ></textarea>

          <div className={styles.btnGroup}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Batal
            </button>
            <button type="submit" className={styles.save}>
              Simpan
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
