const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/book");
const path = require("path");
const helmet = require('helmet');

const app = express();
// Création du dossier images s'il n'existe pas
if (!fs.existsSync("images")) {
  fs.mkdirSync("images");
}

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch((err) => console.log(err));

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(helmet());

app.use((req, res) => {
  res.json({ message: "Votre requête a bien été reçue !" });
});

module.exports = app;
