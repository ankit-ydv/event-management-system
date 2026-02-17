const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const ctrl    = require('../controllers/vendorController');
const { requireVendor } = require('../middleware/auth');

// Multer config for product image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(file.mimetype));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.post('/signup', ctrl.signup);
router.post('/login',  ctrl.login);
router.post('/logout', requireVendor, ctrl.logout);

router.get('/products',        requireVendor, ctrl.getProducts);
router.post('/products',       requireVendor, upload.single('image'), ctrl.addProduct);
router.put('/products/:id',    requireVendor, upload.single('image'), ctrl.updateProduct);
router.delete('/products/:id', requireVendor, ctrl.deleteProduct);

router.get('/orders',               requireVendor, ctrl.getOrders);
router.put('/orders/:id/status',    requireVendor, ctrl.updateOrderStatus);

module.exports = router;
