const router = require('express').Router();
const ordersController = require('../controllers/ordersController');
const verify  = require('../middleware/jwtMiddleware').verify;


router.route('/')
    .get(verify,ordersController.getOrders)
    .post(verify,ordersController.addOrder)

router.route('/user/:userid/')
    .get(verify,ordersController.getOrderByUserId)
    
router.route('/order/:orderid/')
    .get(verify,ordersController.getOrderById)


module.exports = router;