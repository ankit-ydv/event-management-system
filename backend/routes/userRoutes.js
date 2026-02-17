const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/userController');
const { requireUser } = require('../middleware/auth');

router.post('/signup', ctrl.signup);
router.post('/login',  ctrl.login);
router.post('/logout', requireUser, ctrl.logout);

router.get('/vendors',                       requireUser, ctrl.getVendors);
router.get('/vendors/:vendorId/products',    requireUser, ctrl.getVendorProducts);

router.get('/cart',              requireUser, ctrl.getCart);
router.post('/cart',             requireUser, ctrl.addToCart);
router.put('/cart/:productId',   requireUser, ctrl.updateCartItem);
router.delete('/cart/:productId',requireUser, ctrl.removeFromCart);
router.delete('/cart',           requireUser, ctrl.clearCart);

router.post('/checkout', requireUser, ctrl.placeOrder);
router.get('/orders',    requireUser, ctrl.getOrders);

module.exports = router;
