const Book = require('../models/Book');
const sharp = require('sharp');
const fs = require('fs');

/* =========================
   GET ALL BOOKS
========================= */
exports.getAllBooks = (req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json(error));
};

/* =========================
   GET ONE BOOK
========================= */
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json(error));
};

/* =========================
   CREATE BOOK + IMAGE COMPRESSION
========================= */
exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);

  const filename = req.file.filename;
  const inputPath = `images/${filename}`;
  const outputPath = `images/optimized-${filename}`;

  sharp(inputPath)
    .resize({ width: 500 })
    .jpeg({ quality: 70 })
    .toFile(outputPath)
    .then(() => {
      fs.unlinkSync(inputPath);

      const book = new Book({
        userId: req.auth.userId,
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/optimized-${filename}`,
        averageRating: 0
      });

      return book.save();
    })
    .then(() => {
      res.status(201).json({ message: 'Livre créé' });
    })
    .catch(error => {
      res.status(400).json(error);
    });
};

/* =========================
   MODIFY BOOK
========================= */
exports.modifyBook = (req, res) => {

  const updateBook = req.file
    ? (() => {
        const bookObject = JSON.parse(req.body.book);

        const filename = req.file.filename;
        const inputPath = `images/${filename}`;
        const outputPath = `images/optimized-${filename}`;

        sharp(inputPath)
          .resize({ width: 500 })
          .jpeg({ quality: 70 })
          .toFile(outputPath)
          .then(() => {
            fs.unlinkSync(inputPath);
          });

        return {
          ...bookObject,
          imageUrl: `${req.protocol}://${req.get('host')}/images/optimized-${filename}`
        };
      })()
    : { ...req.body };

  Book.updateOne(
    { _id: req.params.id },
    { ...updateBook, _id: req.params.id }
  )
    .then(() => {
      res.status(200).json({ message: 'Livre modifié' });
    })
    .catch(error => {
      res.status(400).json(error);
    });
};

/* =========================
   DELETE BOOK
========================= */
exports.deleteBook = (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: 'Livre supprimé' });
    })
    .catch(error => {
      res.status(400).json(error);
    });
};