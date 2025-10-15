import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import styles from "./EditPropertyModal.module.css";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditPropertyModal({ data, onClose, onSave }) {
  const [form, setForm] = useState({
    ...data,
    namaProperti: data.namaProperti || "",
    jenisProperti: data.jenisProperti || "sewa",
    tipeProperti: data.tipeProperti || "Rumah",
    harga: data.harga || 0,
    periodeSewa: data.periodeSewa || "",
    deskripsi: data.deskripsi || "",
    lokasi: data.lokasi || "",
    kecamatan: data.kecamatan || "",
    desa: data.desa || "",
    luasTanah: data.luasTanah || 0,
    luasBangunan: data.luasBangunan || 0,
    kamarTidur: data.kamarTidur || 0,
    kamarMandi: data.kamarMandi || 0,
    // Menambahkan state untuk periode dari referensi Anda
    periodeAngka: data.periodeSewa ? parseInt(data.periodeSewa.match(/\d+/)) || "" : "",
    periodeSatuan: data.periodeSewa ? data.periodeSewa.match(/bulan|tahun/i) ? data.periodeSewa.match(/bulan|tahun/i)[0] : "tahun" : "tahun",
  });

  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    const initialMedia = (data.media || []).map((fileName) => ({
      id: `existing-${fileName}-${Math.random()}`,
      file: fileName,
      url: `http://localhost:3005/media/${fileName}`,
      isNew: false,
    }));
    setMediaItems(initialMedia);
  }, [data.media]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      id: `new-${file.name}-${Date.now()}`,
      file: file,
      url: URL.createObjectURL(file),
      isNew: true,
    }));
    setMediaItems((prev) => [...prev, ...newMedia]);
  };

  const removeMedia = (idToRemove) => {
    const item = mediaItems.find(item => item.id === idToRemove);
    if (item && item.isNew) {
      URL.revokeObjectURL(item.url);
    }
    setMediaItems((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const handleDragStart = (index, e) => e.dataTransfer.setData("text/plain", index);

  const handleDrop = (targetIndex, e) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("text/plain");
    if (draggedIndex === targetIndex) return;
    const newOrderedItems = [...mediaItems];
    const [draggedItem] = newOrderedItems.splice(draggedIndex, 1);
    newOrderedItems.splice(targetIndex, 0, draggedItem);
    setMediaItems(newOrderedItems);
  };
  
  const allowDrop = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFilesToUpload = mediaItems.filter((item) => item.isNew).map((item) => item.file);
    let uploadedFileNames = [];

    if (newFilesToUpload.length > 0) {
      const formDataUpload = new FormData();
      newFilesToUpload.forEach((file) => formDataUpload.append("media", file));
      try {
        Swal.fire({ title: "Mengupload gambar...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const uploadRes = await axios.post("http://localhost:3005/upload", formDataUpload);
        uploadedFileNames = uploadRes.data.files;
        Swal.close();
      } catch (error) {
        console.error("Gagal mengupload file baru:", error);
        Swal.fire("Error", "Gagal mengupload file baru!", "error");
        return;
      }
    }

    let newFileNameIndex = 0;
    const finalMediaOrder = mediaItems.map((item) => {
      if (item.isNew) {
        return uploadedFileNames[newFileNameIndex++];
      }
      return item.file;
    });

    // Membuat string periodeSewa dari state terpisah
    let periodeSewaFinal = form.periodeSewa;
    if (form.jenisProperti === 'sewa') {
      periodeSewaFinal = `/${form.periodeAngka} ${form.periodeSatuan}`;
    }

    onSave({ ...form, media: finalMediaOrder, periodeSewa: periodeSewaFinal });
  };

  return (
    <motion.div className={styles.backdrop} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className={styles.modal} onClick={(e) => e.stopPropagation()} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
        <div className={styles.header}>
          <h3>Edit Properti</h3>
          <button onClick={onClose} className={styles.closeButton}><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Kolom Kiri */}
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label>Nama Properti</label>
                <input name="namaProperti" value={form.namaProperti} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Jenis Properti</label>
                <select name="jenisProperti" value={form.jenisProperti} onChange={handleChange}>
                  {/* Nilai value diubah ke huruf kecil agar konsisten */}
                  <option value="sewa">Sewa</option>
                  <option value="jual">Jual</option>
                  <option value="cicilan">Cicilan</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Tipe Properti</label>
                <select name="tipeProperti" value={form.tipeProperti} onChange={handleChange}>
                  <option value="Rumah">Rumah</option>
                  <option value="Kos">Kos</option>
                  <option value="Ruko">Ruko</option>
                  <option value="Tanah">Tanah</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Harga</label>
                <input name="harga" type="number" value={form.harga} onChange={handleChange} required />
              </div>
              
              {/* ===== INI PERBAIKANNYA ===== */}
              {form.jenisProperti === "sewa" && (
                <div className={styles.formGroup}>
                  <label>Periode Sewa</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input type="number" name="periodeAngka" value={form.periodeAngka} onChange={handleChange} placeholder="Jumlah" required/>
                    <select name="periodeSatuan" value={form.periodeSatuan} onChange={handleChange}>
                      <option value="bulan">Bulan</option>
                      <option value="tahun">Tahun</option>
                    </select>
                  </div>
                </div>
              )}
              {/* ============================= */}

              <div className={styles.formGroup}>
                <label>Deskripsi</label>
                <textarea name="deskripsi" rows="5" value={form.deskripsi} onChange={handleChange}></textarea>
              </div>
            </div>
            {/* Kolom Kanan */}
            <div className={styles.formColumn}>
              {/* ... Isi kolom kanan (Lokasi, Kecamatan, dll.) ... */}
              <div className={styles.formGroup}><label>Lokasi</label><input name="lokasi" value={form.lokasi} onChange={handleChange} required /></div>
              <div className={styles.formGroup}><label>Kecamatan</label><input name="kecamatan" value={form.kecamatan} onChange={handleChange} /></div>
              <div className={styles.formGroup}><label>Desa</label><input name="desa" value={form.desa} onChange={handleChange} /></div>
              <div className={styles.formGroup}><label>Luas Tanah (m²)</label><input name="luasTanah" type="number" value={form.luasTanah} onChange={handleChange} /></div>
              <div className={styles.formGroup}><label>Luas Bangunan (m²)</label><input name="luasBangunan" type="number" value={form.luasBangunan} onChange={handleChange} /></div>
              <div className={styles.formGroup}><label>Kamar Tidur</label><input name="kamarTidur" type="number" value={form.kamarTidur} onChange={handleChange} /></div>
              <div className={styles.formGroup}><label>Kamar Mandi</label><input name="kamarMandi" type="number" value={form.kamarMandi} onChange={handleChange} /></div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Media (Geser untuk mengatur gambar utama)</label>
            <input type="file" multiple onChange={handleFileChange} className={styles.fileInput} />
            <div className={styles.previewContainer}>
              {mediaItems.map((item, idx) => (
                <div key={item.id} draggable onDragStart={(e) => handleDragStart(idx, e)} onDragOver={allowDrop} onDrop={(e) => handleDrop(idx, e)} className={styles.previewItem}>
                  <img src={item.url} alt="preview" />
                  <button type="button" className={styles.removeButton} onClick={() => removeMedia(item.id)}><FaTimes /></button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.btnGroup}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Batal</button>
            <button type="submit" className={styles.saveBtn}>Simpan Perubahan</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}