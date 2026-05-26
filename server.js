const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Ghost@123";

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

const configPath = path.join(__dirname, "data", "config.json");

function ensureConfig() {
  if (!fs.existsSync(path.join(__dirname, "data"))) fs.mkdirSync(path.join(__dirname, "data"));
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({
      version: "1.0",
      notes: "Ready",
      content: ""
    }, null, 2));
  }
}

ensureConfig();

app.post("/api/login", (req, res) => {
  const password = req.body.password || "";
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: "Login successful" });
  }
  res.status(401).json({ success: false, message: "Wrong password" });
});

app.get("/api/config", (req, res) => {
  ensureConfig();
  res.sendFile(configPath);
});

app.get("/raw/config.json", (req, res) => {
  ensureConfig();
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.sendFile(configPath);
});

app.post("/api/update", (req, res) => {
  try {
    const rawContent = req.body.config || "";
    const version = req.body.version || "1.0";
    const notes = req.body.notes || "Updated from HEX UpdatePanel";

    let finalData;

    try {
      finalData = JSON.parse(rawContent);
    } catch {
      finalData = {
        version,
        notes,
        content: rawContent,
        updated_at: new Date().toISOString()
      };
    }

    fs.writeFileSync(configPath, JSON.stringify(finalData, null, 2), "utf8");

    res.json({
      success: true,
      message: "Config updated successfully",
      raw_link: "/raw/config.json"
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

app.listen(PORT, () => console.log("HEX UpdatePanel running on port " + PORT));
