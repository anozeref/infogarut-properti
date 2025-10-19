import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./EditProperty.module.css";

export default function EditProperty({ darkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    namaProperti: "",
    tipeProperti: "Rumah",
    jenisProperti: "jual",
    periodeSewa: "",
    harga: "",
    luasTanah: "",
    luasBangunan: "",
    kamarTidur: "",
    kamarMandi: "",
    lokasi: "",
    kecamatan: "",
    desa: "",
    deskripsi: "",
    media: [],
  });

  const [previewModal, setPreviewModal] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch data properti
  useEffect(() => {
    axios
      .get(`http://localhost:3004/properties/${id}`)
      .then((res) => {
        setFormData({
          ...res.data,
          media: res.data.media || [],
        });
      })
      .catch(() => {
        Swal.fire("Error", "Data properti tidak ditemukan.", "error");
        navigate("/user/propertisaya");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // 🔹 Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Upload media baru
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image") ? "image" : "video",
    }));

    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, ...previews],
    }));
  };

  // 🔹 Hapus media tertentu
  const removePreview = (index) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  // 🔹 Ganti media
  const replaceFile = (index) => {
    fileInputRef.current.click();
    fileInputRef.current.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const newMedia = {
        file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image") ? "image" : "video",
      };
      setFormData((prev) => {
        const updated = [...prev.media];
        updated[index] = newMedia;
        return { ...prev, media: updated };
      });
    };
  };

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.namaProperti || !formData.harga || !formData.lokasi) {
      Swal.fire("Gagal", "Harap isi Nama Properti, Harga, dan Lokasi.", "warning");
      return;
    }

    try {
      await axios.put(`http://localhost:3004/properties/${id}`, formData);
      Swal.fire({
        title: "Berhasil!",
        text: "Properti berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/user/propertisaya");
    } catch (err) {
      Swal.fire("Error", "Gagal memperbarui data.", "error");
      console.error(err);
    }
  };

  if (loading) return <div className={styles.loading}>Memuat data properti...</div>;

  // 🌙 Mode class
  const containerClass = `${styles.container} ${darkMode ? styles.dark : ""}`;
  const cardClass = `${styles.card} ${darkMode ? styles.darkCard : ""}`;
  const inputClass = `${styles.input} ${darkMode ? styles.darkInput : ""}`;
  const selectClass = `${styles.select} ${darkMode ? styles.darkInput : ""}`;
  const textareaClass = `${styles.textarea} ${darkMode ? styles.darkInput : ""}`;

  return (
    <div className={containerClass}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <FaArrowLeft className={styles.backIcon} /> Kembali
      </button>

      <div className={cardClass}>
        <h2 className={styles.title}>Edit Properti</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            {/* 🔹 Nama dan Deskripsi */}
            <div className={styles.colFull}>
              <label>Nama Properti</label>
              <input
                name="namaProperti"
                value={formData.namaProperti}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div className={styles.colFull}>
              <label>Deskripsi</label>
              <textarea
                name="deskripsi"
                rows={3}
                value={formData.deskripsi}
                onChange={handleChange}
                className={textareaClass}
              />
            </div>

            {/* 🔹 Detail lainnya */}
            <div>
              <label>Harga (IDR)</label>
              <input
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label>Lokasi</label>
              <input
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label>Kecamatan</label>
              <input
                name="kecamatan"
                value={formData.kecamatan}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label>Desa</label>
              <input
                name="desa"
                value={formData.desa}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* 🔹 Dropdown properti */}
            <div>
              <label>Tipe Properti</label>
              <select
                name="tipeProperti"
                value={formData.tipeProperti}
                onChange={handleChange}
                className={selectClass}
              >
                <option>Rumah</option>
                <option>Apartemen</option>
                <option>Tanah</option>
                <option>Ruko</option>
              </select>
            </div>

            <div>
              <label>Jenis Properti</label>
              <select
                name="jenisProperti"
                value={formData.jenisProperti}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="jual">Dijual</option>
                <option value="sewa">Disewa</option>
              </select>
            </div>

            {formData.jenisProperti === "sewa" && (
              <div>
                <label>Periode Sewa</label>
                <input
                  name="periodeSewa"
                  value={formData.periodeSewa}
                  onChange={handleChange}
                  placeholder="/1 tahun"
                  className={inputClass}
                />
              </div>
            )}

            {/* 🔹 Ukuran dan kamar */}
            <div>
              <label>Luas Tanah (m²)</label>
              <input
                type="number"
                name="luasTanah"
                value={formData.luasTanah}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label>Luas Bangunan (m²)</label>
              <input
                type="number"
                name="luasBangunan"
                value={formData.luasBangunan}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label>Kamar Tidur</label>
              <input
                type="number"
                name="kamarTidur"
                value={formData.kamarTidur}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label>Kamar Mandi</label>
              <input
                type="number"
                name="kamarMandi"
                value={formData.kamarMandi}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* 🔹 Upload Media */}
            <div className={styles.colFull}>
              <label>Upload Media (Foto/Video)</label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </div>
          </div>

          {/* 🔹 Preview Media */}
          {formData.media.length > 0 && (
            <div className={styles.previewSection}>
              <h3 className={styles.previewTitle}>Preview Media</h3>
              <div className={styles.previewGrid}>
                {formData.media.map((m, idx) => (
                  <div key={idx} className={styles.previewItem}>
                    {m.type === "image" ? (
                      <img
                        src={m.url}
                        alt={`preview-${idx}`}
                        className={styles.previewImage}
                        onClick={() => setPreviewModal(m)}
                      />
                    ) : (
                      <video
                        src={m.url}
                        className={styles.previewVideo}
                        controls
                        onClick={() => setPreviewModal(m)}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removePreview(idx)}
                      className={styles.deleteBtn}
                    >
                      <FaTimes />
                    </button>
                    <button
                      type="button"
                      onClick={() => replaceFile(idx)}
                      className={styles.replaceBtn}
                    >
                      Ganti
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            Simpan Properti
          </button>
        </form>
      </div>

      {/* 🔹 Modal Preview */}
      {previewModal && (
        <div className={styles.modalOverlay} onClick={() => setPreviewModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {previewModal.type === "video" ? (
              <video src={previewModal.url} controls autoPlay className={styles.modalVideo} />
            ) : (
              <img src={previewModal.url} alt="Preview" className={styles.modalImage} />
            )}
            <button className={styles.closeModal} onClick={() => setPreviewModal(null)}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
