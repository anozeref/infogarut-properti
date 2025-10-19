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

// === Setup basic middleware ===
app.use(cors());
app.use(express.json());

// Pastikan folder media ada
const mediaDir = path.join(__dirname, "public/media");
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

// Serve file statis (gambar properti)
app.use("/media", express.static(mediaDir));

// === Setup HTTP + Socket.IO ===
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

/* 
===========================================================
🟢 SOCKET.IO EVENT HANDLER
Untuk komunikasi realtime antara frontend & backend
Termasuk DashboardUser.jsx dan NavbarUser.jsx
===========================================================
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
===========================================================
📤 MULTER Setup (Upload File Properti)
===========================================================
*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mediaDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Maks 2 MB per file
}).array("media", 4); // Maks 4 file sekaligus

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

/* 
===========================================================
🚀 Jalankan server
===========================================================
*/
server.listen(PORT, () => {
  console.log(`🚀 Backend aktif di http://localhost:${PORT}`);
});
