const sharp = require("sharp");
const fs = require("fs");

module.exports = (req, res, next) => {
  if (!req.file) return next();

  const filename = req.file.filename;
  const inputPath = `images/${filename}`;
  const outputPath = `images/optimized-${filename}`;

  sharp(inputPath)
    .resize({ width: 500 })
    .jpeg({ quality: 70 })
    .toFile(outputPath)
    .then(() => {
      fs.unlinkSync(inputPath);
      req.file.optimizedFilename = `optimized-${filename}`;
      next();
    })
    .catch((error) => res.status(500).json(error));
};