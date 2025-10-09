import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import styles from "./TambahPropertiContent.module.css";

const TambahPropertiContent = () => {
  const [form, setForm] = useState({
    title: "",
    jenis: "Jual",
    tipe: "Rumah",
    location: "",
    price: "",
    periode: "",
    description: "",
    images: "",
    ownerId: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: `Properti "${form.title}" berhasil ditambahkan!`,
      showConfirmButton: false,
      timer: 1500,
    });
    setForm({
      title: "",
      jenis: "Jual",
      tipe: "Rumah",
      location: "",
      price: "",
      periode: "",
      description: "",
      images: "",
      ownerId: 1,
    });
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.header}>
        <h2>Tambah Properti Baru</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Judul Properti</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Masukkan judul properti"
          required
        />

        <label>Jenis</label>
        <select name="jenis" value={form.jenis} onChange={handleChange}>
          <option>Jual</option>
          <option>Sewa</option>
          <option>Cicilan</option>
        </select>

        <label>Tipe</label>
        <select name="tipe" value={form.tipe} onChange={handleChange}>
          <option>Rumah</option>
          <option>Kost</option>
          <option>Ruko</option>
          <option>Villa</option>
        </select>

        <label>Lokasi</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Masukkan lokasi properti"
          required
        />

        <label>Harga</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Masukkan harga properti"
          required
        />

        <label>Periode (untuk Sewa/Cicilan)</label>
        <input
          type="text"
          name="periode"
          value={form.periode}
          onChange={handleChange}
          placeholder="1 bulan / 1 tahun"
        />

        <label>Deskripsi</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Deskripsikan properti"
        />

        <label>Gambar (URL)</label>
        <input
          type="text"
          name="images"
          value={form.images}
          onChange={handleChange}
          placeholder="Pisahkan dengan koma"
        />

        <motion.button
          type="submit"
          className={styles.submitBtn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus style={{ marginRight: "6px" }} /> Tambah Properti
        </motion.button>
      </form>
    </motion.div>
  );
};

export default TambahPropertiContent;
