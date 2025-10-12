import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import styles from "./ProfileUser.module.css";

export default function ProfileUser({ darkMode }) {
  const [photo, setPhoto] = useState(null);
  const [ktp, setKtp] = useState(null);

  return (
    <div className={`${styles.profilePage} ${darkMode ? styles.dark : ""}`}>
      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <FaUserCircle className={styles.iconUser} /> {/* ✅ Ikon akun */}
          <h2>Profil Saya</h2>
        </div>
      </div>

      {/* ================= ISI KONTEN ================= */}
      <div className={styles.content}>
        {/* ================= FORM PROFIL ================= */}
        <div className={styles.formSection}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h5>Profil</h5>
            </div>

            <div className={styles.cardBody}>
              {/* 🔔 Info Kontributor */}
              <div className={styles.alertInfo}>
                <h4>Upgrade akun jadi kontributor!</h4>
                <p>
                  Anda bisa menjadi kontributor. Silakan hubungi admin untuk
                  mendapat kode akses anda!
                </p>
                <hr />
                <p>
                  Sudah punya kode? <a href="#">Masukkan di sini</a>
                </p>
              </div>

              {/* ================= FORM ================= */}
              <form className={styles.form}>
                {/* 🖼️ Foto Profil */}
                <div className={styles.row}>
                  <div className={styles.col8}>
                    <label>
                      Foto Profil <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                  </div>

                  <div className={styles.col4}>
                    <div className={styles.previewFrame}>
                      {photo ? (
                        <img
                          src={URL.createObjectURL(photo)}
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
                </div>

                {/* 🧍 Nama & Username */}
                <div className={styles.row}>
                  <div className={styles.col6}>
                    <label>
                      Nama <span className={styles.required}>*</span>
                    </label>
                    <input type="text" placeholder="Nama" />
                  </div>
                  <div className={styles.col6}>
                    <label>
                      Username <span className={styles.required}>*</span>
                    </label>
                    <input type="text" placeholder="Username" />
                  </div>
                </div>

                {/* 📧 Email & No HP */}
                <div className={styles.row}>
                  <div className={styles.col6}>
                    <label>
                      Email <span className={styles.required}>*</span>
                    </label>
                    <input type="email" placeholder="Email" />
                  </div>
                  <div className={styles.col6}>
                    <label>No HP</label>
                    <input type="text" placeholder="No HP" />
                  </div>
                </div>

                {/* 🏙️ Provinsi – Kota – Kecamatan */}
                <div className={styles.addressRow}>
                  <div className={styles.col4}>
                    <label>
                      Provinsi <span className={styles.required}>*</span>
                    </label>
                    <select defaultValue="">
                      <option value="" disabled>
                        Pilih Provinsi
                      </option>
                      <option>Jawa Barat</option>
                      <option>Jawa Tengah</option>
                      <option>Jawa Timur</option>
                    </select>
                  </div>

                  <div className={styles.col4}>
                    <label>
                      Kota <span className={styles.required}>*</span>
                    </label>
                    <select defaultValue="">
                      <option value="" disabled>
                        Pilih Kota
                      </option>
                      <option>Garut</option>
                      <option>Bandung</option>
                      <option>Tasikmalaya</option>
                    </select>
                  </div>

                  <div className={styles.col4}>
                    <label>
                      Kecamatan <span className={styles.required}>*</span>
                    </label>
                    <select defaultValue="">
                      <option value="" disabled>
                        Pilih Kecamatan
                      </option>
                      <option>Tarogong Kidul</option>
                      <option>Karangpawitan</option>
                      <option>Garut Kota</option>
                    </select>
                  </div>
                </div>

                {/* 🏠 Alamat & Biodata */}
                <div className={styles.row}>
                  <div className={styles.col6}>
                    <label>
                      Alamat <span className={styles.required}>*</span>
                    </label>
                    <textarea rows="3" placeholder="Alamat lengkap"></textarea>
                  </div>
                  <div className={styles.col6}>
                    <label>
                      Biodata <span className={styles.required}>*</span>
                    </label>
                    <textarea rows="3" placeholder="Biodata singkat"></textarea>
                  </div>
                </div>

                {/* 🪪 KTP */}
                <div className={styles.row}>
                  <div className={styles.col8}>
                    <label>
                      KTP <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setKtp(e.target.files[0])}
                    />
                  </div>

                  <div className={styles.col4}>
                    <div className={styles.previewFrame}>
                      {ktp ? (
                        <img
                          src={URL.createObjectURL(ktp)}
                          alt="KTP"
                          className={styles.previewImg}
                        />
                      ) : (
                        <div className={styles.emptyFrame}>
                          <p>Belum ada KTP</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 🏦 Bank & Gopay */}
                <div className={styles.row}>
                  <div className={styles.col6}>
                    <label>Nama Bank</label>
                    <input type="text" placeholder="Nama Bank" />
                  </div>
                  <div className={styles.col6}>
                    <label>No Rekening</label>
                    <input type="text" placeholder="No Rekening" />
                  </div>
                  <div className={styles.col6}>
                    <label>Gopay</label>
                    <input type="text" placeholder="Nomor Gopay" />
                  </div>
                </div>

                {/* 📝 Catatan */}
                <div className={styles.col12}>
                  <p className={styles.note}>
                    <span className={styles.required}>*</span> Wajib diisi
                    <br />
                    <span className={styles.required}>**</span> Isi minimal 1
                    (Data Bank / Gopay)
                  </p>
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

        {/* ================= UBAH PASSWORD ================= */}
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
