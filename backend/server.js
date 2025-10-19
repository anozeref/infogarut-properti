// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const axios = require("axios");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 3005;
const DB_URL = "http://localhost:3004";

// === Middleware ===
app.use(cors());
app.use(express.json());

// Pastikan folder media ada
const mediaDir = path.join(__dirname, "public/media");
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

// Serve file statis (gambar properti)
app.use("/media", express.static(mediaDir));

// === Socket.IO ===
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

/* 
🟢 SOCKET.IO EVENT HANDLER
Untuk komunikasi realtime antara frontend & backend
Termasuk DashboardUser.jsx dan NavbarUser.jsx
*/
io.on("connection", (socket) => {
  console.log("✅ Connected:", socket.id);

  // === Untuk Dashboard & Properti (umum) ===
  socket.on("new_property", (data) => io.emit("propertyUpdate", data));
  socket.on("new_user", (data) => io.emit("userUpdate", data));

  // === Untuk NavbarUser.jsx (Notifikasi realtime umum) ===
  socket.on("property_approved", (data) => {
    console.log("📢 Property approved:", data);
    io.emit("notif_property_approved", data);
  });

  socket.on("property_rejected", (data) => {
    console.log("🚫 Property rejected:", data);
    io.emit("notif_property_rejected", data);
  });

  socket.on("new_upload", (data) => {
    console.log("🆕 New upload:", data);
    io.emit("notif_upload", data);
  });

  /* 
  ===========================================================
  🔔 TAMBAHAN BARU UNTUK DASHBOARDUSER.JSX
  Fitur notifikasi real-time per user saat properti disetujui/ditolak
  ===========================================================
  */

  // 🧩 User bergabung ke room khusus (ID user)
  socket.on("joinUserRoom", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined room user_${userId}`);
  });

  // 📢 Admin update status properti (disetujui / ditolak)
  socket.on("updatePropertyStatus", (data) => {
    console.log("📬 Update property status:", data);
    // Kirim notifikasi hanya ke user yang memiliki properti
    io.to(`user_${data.ownerId}`).emit("propertyStatusUpdated", data);
  });

  // Disconnect handler
  socket.on("disconnect", () => console.log("❌ Disconnected:", socket.id));
});

/* 
📤 MULTER Setup (Upload File Properti)
*/
io.on("connection", (socket) => {
console.log(`✅ Connected: ${socket.id}`);
socket.on('propertyUpdate', () => io.emit('propertyUpdate'));
socket.on('userUpdate', () => io.emit('userUpdate'));
socket.on("disconnect", () => {
console.log(`❌ Disconnected: ${socket.id}`);
  });
});
// === MULTER Setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mediaDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB per file
}).array("media", 4);

// === Upload Endpoint ===
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("❌ Upload error:", err.message);
      return res.status(400).json({ error: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const files = req.files.map((f) => f.filename);
    console.log("📸 Uploaded:", files);
    res.json({ files });

    // 🔔 Kirim notifikasi ke semua user
    io.emit("notif_upload", {
      files,
      message: `${files.length} file baru diupload.`,
      time: new Date(),
    });
  });
});

/* 
===========================================================
📡 GET users & properties
===========================================================
*/
app.get("/users", async (_, res) => {
  try {
    const { data } = await axios.get(`${DB_URL}/users`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/properties", async (_, res) => {
  try {
    const { data } = await axios.get(`${DB_URL}/properties`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

/* 
===========================================================
🗑️ DELETE property + media
===========================================================
*/
app.delete("/properties/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data: properties } = await axios.get(`${DB_URL}/properties`);
    const property = properties.find((p) => String(p.id) === String(id));
    if (!property) return res.status(404).json({ error: "Property not found" });

    // Hapus file media dari folder
    if (property.media && Array.isArray(property.media)) {
      property.media.forEach((file) => {
        const filePath = path.join(mediaDir, file);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    // Hapus dari DB.json
    await axios.delete(`${DB_URL}/properties/${id}`);
    io.emit("update_property", { id, deleted: true });
    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ error: "Failed to delete property" });
  }
});

🚀 Jalankan server
*/
// === GET banned users ===
app.get("/api/banned-users", async (_, res) => {
  try {
    const { data: users } = await axios.get(`${DB_URL}/users`);
    const bannedUsers = users.filter(u => u.banned === true);
    res.json(bannedUsers);
  } catch (err) {
    console.error("❌ Fetch banned users error:", err.message);
    res.status(500).json({ error: "Gagal mengambil data user yang diblokir" });
  }
});

// === Unban user ===
app.patch("/api/users/:id/unban", async (req, res) => {
  const { id } = req.params;
  try {
    const { data: user } = await axios.get(`${DB_URL}/users/${id}`);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    // Hanya ubah banned jika true
    if (!user.banned) {
      return res.status(400).json({ error: "User ini tidak sedang diblokir." });
    }

    const updatedUser = { ...user, banned: false };
    await axios.patch(`${DB_URL}/users/${id}`, updatedUser);

    io.emit("userUpdate", { id, unbanned: true });
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("❌ Unban error:", err.message);
    res.status(500).json({ error: "Gagal membuka blokir user" });
  }
});

// === Media cleanup ===
app.post("/api/media/cleanup", async (_, res) => {
  try {
    const { data: properties } = await axios.get(`${DB_URL}/properties`);
    const usedFiles = new Set(properties.flatMap(p => p.media || []));
    const allFiles = fs.readdirSync(mediaDir);

    let deleted = 0;
    allFiles.forEach(file => {
      if (!usedFiles.has(file)) {
        fs.unlinkSync(path.join(mediaDir, file));
        deleted++;
      }
    });

    io.emit("mediaCleanup", { deleted, time: new Date() });
    res.json({ message: `${deleted} file tidak terpakai telah dihapus.` });
  } catch (err) {
    console.error("❌ Cleanup error:", err.message);
    res.status(500).json({ error: "Gagal membersihkan media" });
  }
});

// === Jalankan server ===
server.listen(PORT, () => {
  console.log(`🚀 Backend aktif di http://localhost:${PORT}`);
});
