const router = require('express').Router();
const authorsController = require('../controllers/authorsController');
const verify  = require('../middleware/jwtMiddleware').verify;


router.route('/')
    .get(verify,authorsController.getAuthors)
    .post(verify,authorsController.addAuthor)

router.route('/:authorid/')
    .get(verify,authorsController.getAuthorById)
    .put(verify,authorsController.updateAuthorById)
    .delete(verify,authorsController.deleteAuthorById)

module.exports = router;