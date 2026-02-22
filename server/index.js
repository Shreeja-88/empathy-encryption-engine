const express = require("express");
const cors = require("cors");
const path = require("path");
const { evaluatePassword } = require("./validator");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend (if client folder exists)
app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

// API route
app.post("/validate", (req, res) => {
    const { password, mode = "empathy" } = req.body;

    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    const result = evaluatePassword(password, mode);
    res.json(result);
});

// IMPORTANT: Use Render's assigned port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});