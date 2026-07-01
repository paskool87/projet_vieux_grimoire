const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const sharpMiddleware = require("../middleware/sharp");

const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRatingBooks);
router.get('/:id', bookCtrl.getOneBook);


router.post('/', auth, multer, sharpMiddleware, bookCtrl.createBook);
router.put('/:id', auth, multer, sharpMiddleware, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;