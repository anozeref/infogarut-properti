import React, { useState } from "react";
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
    ownerId: 1, // admin ID
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Properti "${form.title}" berhasil ditambahkan!`);
    // nanti replace dengan POST ke API db.json
  };

  return (
    <div className={styles.container}>
      <h2>Tambah Properti Baru</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Judul Properti</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} required />

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
        <input type="text" name="location" value={form.location} onChange={handleChange} required />

        <label>Harga</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} required />

        <label>Periode (untuk Sewa/Cicilan)</label>
        <input type="text" name="periode" value={form.periode} onChange={handleChange} placeholder="1 bulan / 1 tahun" />

        <label>Deskripsi</label>
        <textarea name="description" value={form.description} onChange={handleChange}></textarea>

        <label>Gambar (URL)</label>
        <input type="text" name="images" value={form.images} onChange={handleChange} placeholder="Pisahkan dengan koma" />

        <button type="submit">Tambah Properti</button>
      </form>
    </div>
  );
};

export default TambahPropertiContent;
