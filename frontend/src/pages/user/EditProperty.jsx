import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./EditProperty.module.css";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Sesuai field di db.json
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

  // ✅ Ambil data berdasarkan ID
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

  // ✅ Handle input teks / number / select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Upload gambar/video (preview lokal)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type.startsWith("image") ? "image" : "video",
    }));

    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, ...filePreviews],
    }));
  };

  // ✅ Simpan (PUT) ke db.json
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.namaProperti || !formData.harga || !formData.lokasi) {
      Swal.fire("Gagal", "Harap isi Nama Properti, Harga, dan Lokasi.", "warning");
      return;
    }

    try {
      // PUT ke endpoint
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

  const openPreview = (file) => setPreviewModal(file);
  const closePreview = () => setPreviewModal(null);

  if (loading) return <div className={styles.loading}>Memuat data properti...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Edit Properti</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.colFull}>
              <label>Nama Properti</label>
              <input
                name="namaProperti"
                value={formData.namaProperti}
                onChange={handleChange}
                className={styles.input}
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
                className={styles.textarea}
              />
            </div>

            <div>
              <label>Harga (IDR)</label>
              <input
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div>
              <label>Lokasi</label>
              <input
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div>
              <label>Kecamatan</label>
              <input
                name="kecamatan"
                value={formData.kecamatan}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div>
              <label>Desa</label>
              <input
                name="desa"
                value={formData.desa}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div>
              <label>Tipe Properti</label>
              <select
                name="tipeProperti"
                value={formData.tipeProperti}
                onChange={handleChange}
                className={styles.select}
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
                className={styles.select}
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
                  className={styles.input}
                />
              </div>
            )}

            <div>
              <label>Luas Tanah (m²)</label>
              <input
                type="number"
                name="luasTanah"
                value={formData.luasTanah}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div>
              <label>Luas Bangunan (m²)</label>
              <input
                type="number"
                name="luasBangunan"
                value={formData.luasBangunan}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div>
              <label>Kamar Tidur</label>
              <input
                type="number"
                name="kamarTidur"
                value={formData.kamarTidur}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div>
              <label>Kamar Mandi</label>
              <input
                type="number"
                name="kamarMandi"
                value={formData.kamarMandi}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.colFull}>
              <label>Upload Media (Gambar/Video)</label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </div>
          </div>

          {formData.media.length > 0 && (
            <div className={styles.previewSection}>
              <h4>Preview Media</h4>
              <div className={styles.previewGrid}>
                {formData.media.map((file, i) => (
                  <div key={i} className={styles.previewItem} onClick={() => openPreview(file)}>
                    {file.type === "image" ? (
                      <img src={file.url || file} alt={file.name || file} className={styles.previewImage} />
                    ) : (
                      <video src={file.url || file} className={styles.previewVideo} />
                    )}
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

      {previewModal && (
        <div className={styles.modalOverlay} onClick={closePreview}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {previewModal.type === "image" ? (
              <img src={previewModal.url} alt={previewModal.name} className={styles.modalImage} />
            ) : (
              <video src={previewModal.url} controls autoPlay className={styles.modalVideo} />
            )}
            <button className={styles.closeModal} onClick={closePreview}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}
