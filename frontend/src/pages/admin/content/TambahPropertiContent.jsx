import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaPlus, FaTimes } from "react-icons/fa";
import { ThemeContext } from "../DashboardAdmin";
import styles from "./TambahPropertiContent.module.css";
import axios from "axios";

const TambahPropertiContent = () => {
  const { theme } = useContext(ThemeContext);

  const [form, setForm] = useState({
    namaProperti: "",
    jenisProperti: "Jual",
    tipeProperti: "Rumah",
    lokasi: "",
    harga: "",
    periodeAngka: "",
    periodeSatuan: "bulan",
    periodeSewa: "",
    deskripsi: "",
    media: [],
    ownerId: 5,
    statusPostingan: "approved",
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = mediaFiles.length + files.length;
    if (totalFiles > 4) {
      Swal.fire("Error", "Total file maksimal 4!", "error");
      return;
    }

    const invalidPhoto = files.filter(
      (f) => f.type.startsWith("image/") && f.size > 2 * 1024 * 1024
    );
    if (invalidPhoto.length) {
      Swal.fire("Error", "Foto maksimal 2MB per file!", "error");
      return;
    }

    const newPreview = files.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));

    setMediaFiles([...mediaFiles, ...files]);
    setMediaPreview([...mediaPreview, ...newPreview]);
  };

  const removePreview = (index) => {
    const newFiles = [...mediaFiles];
    const newPreview = [...mediaPreview];
    newFiles.splice(index, 1);
    newPreview.splice(index, 1);
    setMediaFiles(newFiles);
    setMediaPreview(newPreview);
  };

  const handleDragStart = (index, e) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDrop = (index, e) => {
    e.preventDefault();
    const dragIndex = e.dataTransfer.getData("text/plain");
    const newPreview = [...mediaPreview];
    [newPreview[index], newPreview[dragIndex]] = [newPreview[dragIndex], newPreview[index]];
    setMediaPreview(newPreview);

    const newFiles = [...mediaFiles];
    [newFiles[index], newFiles[dragIndex]] = [newFiles[dragIndex], newFiles[index]];
    setMediaFiles(newFiles);
  };

  const allowDrop = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi file
    const photoCount = mediaFiles.filter((f) => f.type.startsWith("image/")).length;
    if (photoCount < 2) {
      Swal.fire("Error", "Minimal 2 foto!", "error");
      return;
    }
    if (mediaFiles.length < 3) {
      Swal.fire("Error", "Minimal total 3 file (foto+video)!", "error");
      return;
    }

    // Format periodeSewa
    let periodeSewa = "";
    if (form.jenisProperti === "Sewa") {
      if (!form.periodeAngka || !form.periodeSatuan) {
        Swal.fire("Error", "Isi periode sewa!", "error");
        return;
      }
      periodeSewa = `/${form.periodeAngka} ${form.periodeSatuan}`;
    }

    try {
      // Upload file ke mini server
      const formData = new FormData();
      mediaFiles.forEach((f) => formData.append("media", f));
      const uploadRes = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const mediaNames = uploadRes.data.files;

      // POST ke db.json
      const propertiData = {
        ...form,
        periodeSewa,
        media: mediaNames,
      };
      await axios.post("http://localhost:3004/properties", propertiData);

      Swal.fire("Sukses", `Properti "${form.namaProperti}" berhasil ditambahkan!`, "success");

      // Reset
      setForm({
        namaProperti: "",
        jenisProperti: "Jual",
        tipeProperti: "Rumah",
        lokasi: "",
        harga: "",
        periodeAngka: "",
        periodeSatuan: "bulan",
        periodeSewa: "",
        deskripsi: "",
        media: [],
        ownerId: 5,
        statusPostingan: "approved",
      });
      setMediaFiles([]);
      setMediaPreview([]);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menambahkan properti!", "error");
    }
  };

  return (
    <motion.div
      className={`${styles.container} ${theme === "dark" ? styles.dark : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.header}>
        <h2>Tambah Properti Baru</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Nama Properti</label>
        <input type="text" name="namaProperti" value={form.namaProperti} onChange={handleChange} required />

        <label>Jenis Properti</label>
        <select name="jenisProperti" value={form.jenisProperti} onChange={handleChange}>
          <option>Jual</option>
          <option>Sewa</option>
          <option>Cicilan</option>
        </select>

        <label>Tipe Properti</label>
        <select name="tipeProperti" value={form.tipeProperti} onChange={handleChange}>
          <option>Rumah</option>
          <option>Kost</option>
          <option>Ruko</option>
          <option>Villa</option>
        </select>

        <label>Lokasi</label>
        <input type="text" name="lokasi" value={form.lokasi} onChange={handleChange} required />

        <label>Harga</label>
        <input type="number" name="harga" value={form.harga} onChange={handleChange} required />

        {form.jenisProperti === "Sewa" && (
          <>
            <label>Periode Sewa</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="number"
                name="periodeAngka"
                value={form.periodeAngka}
                onChange={handleChange}
                placeholder="Jumlah"
                required
              />
              <select name="periodeSatuan" value={form.periodeSatuan} onChange={handleChange}>
                <option value="bulan">Bulan</option>
                <option value="tahun">Tahun</option>
              </select>
            </div>
          </>
        )}

        <label>Deskripsi</label>
        <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange}></textarea>

        <label>Media (Foto/Video)</label>
        <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />

        <div className={styles.mediaPreview}>
          {mediaPreview.map((m, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={(e) => handleDragStart(idx, e)}
              onDragOver={allowDrop}
              onDrop={(e) => handleDrop(idx, e)}
              className={styles.mediaItem}
            >
              {m.file.type.startsWith("image/") ? (
                <img src={m.url} alt="preview" />
              ) : (
                <video src={m.url} width={100} height={60} controls />
              )}
              <button type="button" onClick={() => removePreview(idx)}>
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        <motion.button type="submit" className={styles.submitBtn} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FaPlus style={{ marginRight: "6px" }} /> Tambah Properti
        </motion.button>
      </form>
    </motion.div>
  );
};

export default TambahPropertiContent;
