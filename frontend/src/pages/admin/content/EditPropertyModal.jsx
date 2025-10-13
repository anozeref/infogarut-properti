import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./EditPropertyModal.module.css";

export default function EditPropertyModal({ data, onClose, onSave }) {
  const [form, setForm] = useState({ ...data });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
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
          <label>Judul Properti</label>
          <input name="title" value={form.title} onChange={handleChange} required />

          <label>Jenis</label>
          <input name="jenis" value={form.jenis} onChange={handleChange} required />

          <label>Tipe</label>
          <input name="tipe" value={form.tipe} onChange={handleChange} required />

          <label>Lokasi</label>
          <input name="location" value={form.location} onChange={handleChange} required />

          <label>Harga</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />

          <label>Periode</label>
          <input name="periode" value={form.periode} onChange={handleChange} required />

          <div className={styles.btnGroup}>
            <button type="button" className={styles.cancel} onClick={onClose}>Batal</button>
            <button type="submit" className={styles.save}>Simpan</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
