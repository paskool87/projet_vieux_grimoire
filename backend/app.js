const express = require("express");
const mongoose = require("mongoose");


const app = express();
mongoose
  .connect(
    "mongodb+srv://pascal_db:root@cluster0.8xyqqwg.mongodb.net/?appName=Cluster0",
  )
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

app.use((req, res) => {
  res.json({ message: "Votre requête a bien été reçue !" });
});

module.exports = app;
