const router = require('express').Router();
const booksController = require('../controllers/booksController');
const verify  = require('../middleware/jwtMiddleware').verify;


router.route('/')
    .get(verify,booksController.getBooks)
    .post(verify,booksController.addBook)
    
    
router.route('/:bookid/')
    .get(verify,booksController.getBookById)
    .put(verify,booksController.updateBookById)
    .delete(verify,booksController.deleteBookById)

router.route('/cover/:bookid/')
    .get(booksController.getBookCover)

module.exports = router;