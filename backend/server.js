// server.js (port 3005)
const express = require("express");
const path = require("path");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/media/properties", express.static(path.join(__dirname, "public/media")));

const PORT = 3005;
const DB_URL = "http://localhost:3004"; // db.json server (read-only)

// === Setup HTTP + Socket.IO ===
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("new_property", (data) => io.emit("propertyUpdate", data));
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

// --- GET users & properties (read-only dari port 3004) ---
app.get("/users", async (req, res) => {
  try {
    const resp = await axios.get(`${DB_URL}/users`);
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/properties", async (req, res) => {
  try {
    const resp = await axios.get(`${DB_URL}/properties`);
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// --- DELETE properti + media ---
app.delete("/properties/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resp = await axios.get(`${DB_URL}/properties`);
    const properties = resp.data;
    const prop = properties.find((p) => String(p.id) === String(id));

    if (!prop) return res.status(404).json({ error: "Property not found" });

    // Hapus semua file media
    if (prop.media && Array.isArray(prop.media)) {
      prop.media.forEach((file) => {
        const filePath = path.join(__dirname, "public/media", file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted media file: ${filePath}`);
        }
      });
    }

    // Emit event ke client
    io.emit("update_property", { id, deleted: true });
    res.json({ success: true, deletedId: id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete property" });
  }
});

// Jalankan server
server.listen(PORT, () =>
  console.log(`🚀 Server (write/delete) running on port ${PORT}`)
);
