import React, { useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TambahProperty() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nama: "",
    type: "",
    price: "",
    location: "",
    buildingArea: "",
    landArea: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    files: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      setFormData({ ...formData, files: [...files] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Kamu harus login dulu sebelum menambah properti!",
      });
      return;
    }

    try {
      // Buat data yang akan dikirim ke db.json
      const propertyData = {
        ...formData,
        id: Date.now(), // ID unik sederhana
        ownerId: user.id,
        createdAt: new Date().toISOString(),
      };

      await axios.post("http://localhost:3004/properties", propertyData);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Properti berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Reset form dan arahkan ke halaman properti user
      setFormData({
        nama: "",
        type: "",
        price: "",
        location: "",
        buildingArea: "",
        landArea: "",
        bedrooms: "",
        bathrooms: "",
        description: "",
        files: [],
      });

      navigate("/user/propertisaya");
    } catch (error) {
      console.error("Gagal menambah properti:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambah properti.",
      });
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Tambah Properti Baru</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nama Properti:</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Tipe:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Tipe</option>
            <option value="Rumah">Rumah</option>
            <option value="Ruko">Ruko</option>
            <option value="Apartemen">Apartemen</option>
            <option value="Tanah">Tanah</option>
          </select>
        </div>

        <div>
          <label>Harga:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Lokasi:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Luas Bangunan (m²):</label>
          <input
            type="number"
            name="buildingArea"
            value={formData.buildingArea}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Luas Tanah (m²):</label>
          <input
            type="number"
            name="landArea"
            value={formData.landArea}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Kamar Tidur:</label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Kamar Mandi:</label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Deskripsi:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Upload Gambar:</label>
          <input
            type="file"
            name="files"
            multiple
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Tambah Properti
        </button>
      </form>
    </div>
  );
}
