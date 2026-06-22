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

  const userId = req.auth.userId;

  const filename = req.file.filename;
  const inputPath = `images/${filename}`;
  const outputPath = `images/optimized-${filename}`;

  sharp(inputPath)
    .resize({ width: 500 })
    .jpeg({ quality: 70 })
    .toFile(outputPath)
    .then(() => {
      fs.unlinkSync(inputPath);

      console.log(req.body);


      const book = new Book({
        userId,
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/optimized-${filename}`,
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

//Rating

exports.rateBook = (req, res) => {

  console.log(req.body);

  const userId = req.auth.userId;
  const rating = req.body.rating;

  Book.findOne({ _id: req.params.id })
    .then(book => {

      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé' });
      }

      // Vérifie si l'utilisateur a déjà noté
      const alreadyRated = book.ratings.find(r => r.userId === userId);

      if (alreadyRated) {
        return res.status(400).json({ error: 'Vous avez déjà noté ce livre' });
      }

      // Ajoute la nouvelle note
      book.ratings.push({
        userId: userId,
        grade: rating
      });

      // Recalcul moyenne
      const sum = book.ratings.reduce((acc, r) => acc + r.grade, 0);
book.averageRating = Number((sum / book.ratings.length).toFixed(2));
      return book.save();
    })
    .then(updatedBook => {
      res.status(200).json(updatedBook);
    })
    .catch(error => {
      res.status(400).json(error);
    });
};

//Bestrating
exports.getBestRatingBooks = (req, res) => {
  Book.find()
    .then(books => {
      const sortedBooks = books
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 3);

      res.status(200).json(sortedBooks);
    })
    .catch(error => {
      res.status(400).json(error);
    });
};