import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import styles from "./ProfileUser.module.css";
import Swal from "sweetalert2"; 

export default function ProfileUser({ darkMode }) {
  // ===================== STATE =====================
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [desaList, setDesaList] = useState([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedDesa, setSelectedDesa] = useState("");
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    email: "",
    noHp: "",
    alamat: "",
    biodata: "",
  });

// ===================== FETCH DATA USER =====================
useEffect(() => {
  fetch("http://localhost:3004/users/1") // ambil user id 1
    .then((res) => res.json())
    .then((data) => {
      setFormData({
        nama: data.nama || "",
        username: data.username || "",
        email: data.email || "",
        noHp: data.no_hp || "",
        alamat: data.alamat || "",
        biodata: data.biodata || "",
        kecamatan: data.kecamatan || "",
        desa: data.desa || "",
      });

      // simpan nama kecamatan dan desa sementara
      setSelectedKecamatan(data.kecamatan || "");
      setSelectedDesa(data.desa || "");
    })
    .catch((err) => console.error("Gagal memuat data user:", err));
}, []);

// ===================== FETCH DATA USER =====================
useEffect(() => {
  fetch("http://localhost:3004/users/1")
    .then((res) => res.json())
    .then((data) => {
      setFormData({
        nama: data.nama || "",
        username: data.username || "",
        email: data.email || "",
        noHp: data.no_hp || "",
        alamat: data.alamat || "",
        biodata: data.biodata || "",
        kecamatan: data.kecamatan || "",
        desa: data.desa || "",
      });
    })
    .catch((err) => console.error("Gagal memuat data user:", err));
}, []);

// ===================== FETCH DATA KECAMATAN =====================
useEffect(() => {
  fetch("https://www.emsifa.com/api-wilayah-indonesia/api/districts/3205.json")
    .then((res) => res.json())
    .then((data) => {
      const sorted = data.sort((a, b) =>
        a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase())
      );
      setKecamatanList(sorted);
    })
    .catch((err) => console.error("Gagal mengambil data kecamatan:", err));
}, []);

// ===================== AUTO SET KECAMATAN BERDASARKAN NAMA =====================
useEffect(() => {
  if (kecamatanList.length > 0 && formData.kecamatan) {
    const matchKec = kecamatanList.find(
      (k) => k.name.toLowerCase() === formData.kecamatan.toLowerCase()
    );
    if (matchKec) {
      setSelectedKecamatan(matchKec.id);
    }
  }
}, [kecamatanList, formData.kecamatan]);

// ===================== FETCH DESA BERDASARKAN KECAMATAN =====================
useEffect(() => {
  if (selectedKecamatan) {
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedKecamatan}.json`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) =>
          a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase())
        );
        setDesaList(sorted);
      })
      .catch((err) => console.error("Gagal mengambil data desa:", err));
  } else {
    setDesaList([]);
  }
}, [selectedKecamatan]);

// ===================== AUTO SELECT DESA BERDASARKAN NAMA =====================
useEffect(() => {
  if (desaList.length > 0 && formData.desa) {
    const matchDesa = desaList.find(
      (d) => d.name.toLowerCase() === formData.desa.toLowerCase()
    );
    if (matchDesa) {
      setSelectedDesa(matchDesa.id);
    }
  }
}, [desaList, formData.desa]);



  // ===================== HANDLE FOTO PROFIL =====================
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // ===================== HANDLE INPUT UMUM =====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ===================== HANDLE SUBMIT =====================
const handleSubmit = async (e) => {
  e.preventDefault();

  const updatedUser = {
    ...formData,
    kecamatan: kecamatanList.find((k) => k.id === selectedKecamatan)?.name || "",
    desa: desaList.find((d) => d.id === selectedDesa)?.name || "",
    no_hp: formData.noHp,
  };

  // 🟡 Step 1: Konfirmasi sebelum menyimpan
  const confirmResult = await Swal.fire({
    title: "Simpan perubahan?",
    text: "Data profil kamu akan diperbarui.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, simpan!",
    cancelButtonText: "Batal",
  });

  if (!confirmResult.isConfirmed) return;

  try {
    // 🟢 Step 2: Tampilkan spinner loading
    Swal.fire({
      title: "Menyimpan data...",
      text: "Mohon tunggu sebentar.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // 🟣 Step 3: Kirim request PUT
    const res = await fetch("http://localhost:3004/users/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });

    if (!res.ok) throw new Error("Gagal menyimpan data user");

    const data = await res.json();

    // 🟢 Step 4: Tutup loading, tampilkan pesan sukses
    Swal.fire({
      title: "Berhasil!",
      text: "Data profil kamu sudah diperbarui.",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });

    console.log("User updated:", data);
  } catch (err) {
    console.error("Error saat update data:", err);

    // 🔴 Step 5: Tutup loading, tampilkan pesan gagal
    Swal.fire({
      title: "Gagal!",
      text: "Terjadi kesalahan saat menyimpan data.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  }
};

  // ===================== RENDER =====================
  return (
    <div className={`${styles.profilePage} ${darkMode ? styles.dark : ""}`}>
      {/* ========== HEADER ========== */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <FaUserCircle className={styles.iconUser} />
          <h2>Profil Saya</h2>
        </div>
      </div>

      {/* ========== ISI KONTEN ========== */}
      <div className={styles.content}>
        {/* ===== FORM PROFIL ===== */}
        <div className={styles.formSection}>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <form className={styles.form} onSubmit={handleSubmit}>
                {/* 🖼️ Foto Profil */}
                <div className={styles.photoRow}>
                  <div className={styles.col}>
                    <label>
                      Foto Profil <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </div>

                  <div className={styles.previewFrame}>
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Foto Profil"
                        className={styles.previewImg}
                      />
                    ) : (
                      <div className={styles.emptyFrame}>
                        <p>Belum ada foto</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 🧍 Nama & Username */}
                <div className={styles.row}>
                  <div className={styles.col6}>
                    
                    <label>
                      Nama <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="nama"
                      placeholder="Nama"
                      value={formData.nama}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.col6}>
                    <label>
                      Username <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* 📧 Email & No HP */}
                <div className={styles.row}>
                  <div className={styles.col6}>
                    <label>
                      Email <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.col6}>
                    <label>No HP</label>
                    <input
                      type="text"
                      name="noHp"
                      placeholder="No HP"
                      value={formData.noHp}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* 🏙️ Kecamatan & Desa */}
                <div className={styles.addressRow}>
                  <div className={styles.col4}>
                    <label>
                      Kecamatan <span className={styles.required}>*</span>
                    </label>
                    <select
                      value={selectedKecamatan}
                      onChange={(e) => setSelectedKecamatan(e.target.value)}
                    >
                      <option value="">Pilih Kecamatan</option>
                      {kecamatanList.map((kec) => (
                        <option key={kec.id} value={kec.id}>
                          {kec.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.col4}>
                    <label>
                      Kelurahan/Desa <span className={styles.required}>*</span>
                    </label>
                    <select
                      value={selectedDesa}
                      onChange={(e) => setSelectedDesa(e.target.value)}
                      disabled={!selectedKecamatan}
                    >
                      <option value="">
                        {selectedKecamatan
                          ? "Pilih Desa/Kelurahan"
                          : "Pilih Kecamatan dulu"}
                      </option>
                      {desaList.map((desa) => (
                        <option key={desa.id} value={desa.id}>
                          {desa.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 🏠 Alamat & Biodata */}
                <div className={styles.row}>
                  <div className={styles.col6}>
                    <label>
                      Alamat <span className={styles.required}>*</span>
                    </label>
                    <textarea
                      name="alamat"
                      rows="3"
                      placeholder="Alamat lengkap"
                      value={formData.alamat}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className={styles.col6}>
                    <label>
                      Biodata <span className={styles.required}>*</span>
                    </label>
                    <textarea
                      name="biodata"
                      rows="3"
                      placeholder="Biodata singkat"
                      value={formData.biodata}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                {/* 💾 Tombol Simpan */}
                <div className={styles.col12} style={{ textAlign: "right" }}>
                  <button type="submit" className={styles.saveBtn}>
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ===== UBAH PASSWORD ===== */}
        <div className={styles.passwordSection}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h5>Ubah Password</h5>
            </div>
            <div className={styles.cardBody}>
              <form>
                <label>Password Baru</label>
                <input type="password" placeholder="Password Baru" />
                <p></p>
                <label>Konfirmasi Password</label>
                <input type="password" placeholder="Konfirmasi Password Baru" />
                <button type="submit" className={styles.saveBtn}>
                  Ubah Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
