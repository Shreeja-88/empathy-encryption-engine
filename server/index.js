const express = require("express");
const cors = require("cors");
const { evaluatePassword } = require("./validator");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is working");
});

app.post("/validate", (req, res) => {
    const { password, mode = 'empathy' } = req.body;

    const result = evaluatePassword(password, mode);
    res.json(result);
});
setInterval(() => {
    console.log("Server still alive...");
}, 5000);


app.listen(5000, () => {
    console.log("Server running on port 5000");
});

