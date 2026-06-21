const Book = require('../models/Book');

exports.getAllBooks = (req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json(error));
};

exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json(error));
};

exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);

  const book = new Book({
    userId: req.auth.userId,
    ...bookObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    averageRating: 0
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre créé' }))
    .catch(error => res.status(400).json(error));
};

exports.modifyBook = (req, res) => {

  const bookObject = req.file ?
    {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } :
    { ...req.body };

  Book.updateOne(
    { _id: req.params.id },
    { ...bookObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Livre modifié' }))
    .catch(error => res.status(400).json(error));
};

exports.deleteBook = (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé' }))
    .catch(error => res.status(400).json(error));
};

