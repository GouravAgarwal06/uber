const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/v1/user", userRoutes);

module.exports = app;