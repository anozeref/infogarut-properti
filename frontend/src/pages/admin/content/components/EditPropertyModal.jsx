// src/pages/admin/content/components/EditPropertyModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaImage, FaSave } from "react-icons/fa";
import styles from "./EditPropertyModal.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../../../../utils/constant";

export default function EditPropertyModal({ data, onClose, onSave }) {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    ...data,
    namaProperti: data.namaProperti || "",
    jenisProperti: data.jenisProperti || "sewa",
    tipeProperti: data.tipeProperti || "Rumah",
    harga: data.harga || 0,
    deskripsi: data.deskripsi || "",
    lokasi: data.lokasi || "",
    kecamatan: data.kecamatan || "",
    desa: data.desa || "",
    luasTanah: data.luasTanah || 0,
    luasBangunan: data.luasBangunan || 0,
    kamarTidur: data.kamarTidur || 0,
    kamarMandi: data.kamarMandi || 0,
    periodeAngka: data.periodeSewa ? parseInt(data.periodeSewa.match(/\d+/)?.[0] || "") : "",
    periodeSatuan: data.periodeSewa?.match(/bulan|tahun/i)?.[0].toLowerCase() || "bulan",
  });

  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    const initialMedia = (data.media || []).map((fileName) => ({
      id: `existing-${fileName}-${Math.random()}`, file: fileName, url: `${API_URL}/media/${fileName}`, isNew: false,
    }));
    setMediaItems(initialMedia);
  }, [data.media]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => { /* ... (kode tidak berubah) ... */ };
  const removeMedia = (idToRemove) => { /* ... (kode tidak berubah) ... */ };
  const handleDragStart = (index, e) => e.dataTransfer.setData("text/plain", index);
  const allowDrop = (e) => e.preventDefault();
  const handleDrop = (targetIndex, e) => { /* ... (kode tidak berubah) ... */ };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // ... (Logika upload dan save Anda tetap sama persis) ...
    try {
      const newFilesToUpload = mediaItems.filter(item => item.isNew).map(item => item.file);
      let uploadedFileNames = [];

      if (newFilesToUpload.length > 0) {
        const formDataUpload = new FormData();
        newFilesToUpload.forEach(file => formDataUpload.append("media", file));
        const uploadRes = await axios.post(`${API_URL}/upload`, formDataUpload);
        uploadedFileNames = uploadRes.data.files;
      }

      let newFileNameIndex = 0;
      const finalMediaOrder = mediaItems.map(item => item.isNew ? uploadedFileNames[newFileNameIndex++] : item.file);
      const periodeSewaFinal = form.jenisProperti === 'sewa' ? `/${form.periodeAngka} ${form.periodeSatuan}` : "";
      
      onSave({ ...form, media: finalMediaOrder, periodeSewa: periodeSewaFinal });

    } catch (error) {
      console.error("Gagal menyimpan perubahan:", error);
      Swal.fire("Error", "Gagal menyimpan perubahan!", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className={styles.backdrop} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className={styles.modal} onClick={(e) => e.stopPropagation()} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
          <div className={styles.header}>
            <h3>Edit Properti</h3>
            <button onClick={onClose} className={styles.closeButton}><FaTimes /></button>
          </div>
          <form onSubmit={handleSubmit} className={styles.formBody}>
            <div className={styles.formSection}>
              <h4>1. Informasi Utama</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}><label>Nama Properti</label><input name="namaProperti" value={form.namaProperti} onChange={handleChange} required /></div>
                <div className={styles.formGroup}><label>Jenis Properti</label><select name="jenisProperti" value={form.jenisProperti} onChange={handleChange}><option value="sewa">Sewa</option><option value="jual">Jual</option><option value="cicilan">Cicilan</option></select></div>
                <div className={styles.formGroup}><label>Tipe Properti</label><select name="tipeProperti" value={form.tipeProperti} onChange={handleChange}><option>Rumah</option><option>Kost</option><option>Ruko</option><option>Tanah</option><option>Villa</option><option>Apartemen</option><option>Perumahan</option></select></div>
                <div className={styles.formGroup}><label>Harga</label><input name="harga" type="number" value={form.harga} onChange={handleChange} required /></div>
                {form.jenisProperti === "sewa" && (
                  <div className={styles.periodeSewa}><div className={styles.formGroup}><label>Periode Sewa</label><input type="number" name="periodeAngka" value={form.periodeAngka} onChange={handleChange} placeholder="Jumlah" required/></div><div className={styles.formGroup}><label>&nbsp;</label><select name="periodeSatuan" value={form.periodeSatuan} onChange={handleChange}><option value="bulan">Bulan</option><option value="tahun">Tahun</option></select></div></div>
                )}
              </div>
              <div className={styles.formGroup}><label>Deskripsi</label><textarea name="deskripsi" rows="4" value={form.deskripsi} onChange={handleChange}></textarea></div>
            </div>
            
            <div className={styles.formSection}>
              <h4>2. Lokasi & Detail</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}><label>Lokasi</label><input name="lokasi" value={form.lokasi} onChange={handleChange} required /></div>
                <div className={styles.formGroup}><label>Kecamatan</label><input name="kecamatan" value={form.kecamatan} onChange={handleChange} /></div>
                <div className={styles.formGroup}><label>Desa</label><input name="desa" value={form.desa} onChange={handleChange} /></div>
                <div className={styles.formGroup}><label>Luas Tanah (m²)</label><input name="luasTanah" type="number" value={form.luasTanah} onChange={handleChange} /></div>
                <div className={styles.formGroup}><label>Luas Bangunan (m²)</label><input name="luasBangunan" type="number" value={form.luasBangunan} onChange={handleChange} /></div>
                <div className={styles.formGroup}><label>Kamar Tidur</label><input name="kamarTidur" type="number" value={form.kamarTidur} onChange={handleChange} /></div>
                <div className={styles.formGroup}><label>Kamar Mandi</label><input name="kamarMandi" type="number" value={form.kamarMandi} onChange={handleChange} /></div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h4>3. Media</h4>
              <input type="file" multiple onChange={handleFileChange} style={{marginBottom: '16px'}} />
              <div className={styles.mediaPreview}>
                {mediaItems.map((item, idx) => (
                  <div key={item.id} draggable onDragStart={(e) => handleDragStart(idx, e)} onDragOver={allowDrop} onDrop={(e) => handleDrop(idx, e)} className={styles.mediaItem}>
                    <img src={item.url} alt="preview" />
                    <button type="button" className={styles.removeButton} onClick={() => removeMedia(item.id)}><FaTimes /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.footer}>
              <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>Batal</button>
              <motion.button type="submit" className={styles.saveBtn} disabled={isSaving} whileHover={{y: -2}} whileTap={{scale:0.98}}>
                {isSaving ? "Menyimpan..." : <><FaSave /> Simpan Perubahan</>}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}