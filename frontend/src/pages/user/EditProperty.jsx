import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./EditProperty.module.css";

const PropertyType = {
  RUMAH: "RUMAH",
  APARTEMEN: "APARTEMEN",
  TANAH: "TANAH",
  RUKO: "RUKO",
};

const InputField = ({ label, name, type = "text", value, onChange, children }) => (
  <div className={styles.inputGroup}>
    <label htmlFor={name} className={styles.label}>{label}</label>
    <div className={styles.inputWrapper}>
      {children ? (
        children
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={styles.input}
          required={["name", "location", "price"].includes(name)}
        />
      )}
    </div>
  </div>
);

const PropertyForm = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    location: "",
    type: PropertyType.RUMAH,
    buildingArea: "",
    landArea: "",
    bedrooms: "",
    bathrooms: "",
    files: [], // ✅ hanya satu array file
    id: null,
  });

  // ✅ State untuk modal preview
  const [previewModal, setPreviewModal] = useState(null);

  const navigate = useNavigate();

  // ✅ Upload file gabungan (gambar & video)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("video")
        ? "video"
        : "other",
      name: file.name,
    }));

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...filePreviews],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.location || parseFloat(formData.price) <= 0) {
      alert("Harap isi Nama Properti, Harga, dan Lokasi.");
      return;
    }

    const dataToSave = {
      ...formData,
      price: parseFloat(formData.price),
      buildingArea: parseFloat(formData.buildingArea) || 0,
      landArea: parseFloat(formData.landArea) || 0,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      id: formData.id || new Date().toISOString(),
    };

    onSave?.(dataToSave);
  };

  const formTitle = formData.id ? "Edit Properti" : "Edit Properti";

  // ✅ Buka modal preview
  const openPreview = (file) => {
    setPreviewModal(file);
  };

  // ✅ Tutup modal preview
  const closePreview = () => {
    setPreviewModal(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>{formTitle}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.colFull}>
              <InputField label="Nama Properti" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className={styles.colFull}>
              <label htmlFor="description" className={styles.label}>Deskripsi</label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
              />
            </div>

            <InputField label="Harga (IDR)" name="price" type="number" value={formData.price} onChange={handleChange} />
            <InputField label="Lokasi" name="location" value={formData.location} onChange={handleChange} />

            <InputField label="Tipe Properti" name="type" value={formData.type} onChange={handleChange}>
              <select
                name="type"
                id="type"
                value={formData.type}
                onChange={handleChange}
                className={styles.select}
              >
                {Object.values(PropertyType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </InputField>

            {/* ✅ Upload gabungan (gambar & video) */}
            <InputField label="Upload File (Gambar/Video)" name="files">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </InputField>

            <InputField label="Luas Bangunan (m²)" name="buildingArea" type="number" value={formData.buildingArea} onChange={handleChange} />
            <InputField label="Luas Tanah (m²)" name="landArea" type="number" value={formData.landArea} onChange={handleChange} />
            <InputField label="Kamar Tidur" name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} />
            <InputField label="Kamar Mandi" name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} />
          </div>

          {/* ✅ Preview semua file */}
          {formData.files.length > 0 && (
            <div className={styles.previewSection}>
              <h4 className={styles.previewTitle}>Preview File</h4>
              <div className={styles.previewGrid}>
                {formData.files.map((file, i) => (
                  <div key={i} className={styles.previewItem} onClick={() => openPreview(file)}>
                    {file.type === "image" ? (
                      <img src={file.url} alt={file.name} className={styles.previewImage} />
                    ) : file.type === "video" ? (
                      <video src={file.url} className={styles.previewVideo} />
                    ) : (
                      <p>{file.name}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>Simpan Properti</button>
        </form>
      </div>

      {/* ✅ Modal preview */}
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
};

export default PropertyForm;
