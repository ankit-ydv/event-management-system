const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.post('/login',   ctrl.login);
router.post('/logout',  requireAdmin, ctrl.logout);

// User management
router.get('/users',         requireAdmin, ctrl.getUsers);
router.post('/users',        requireAdmin, ctrl.addUser);
router.put('/users/:id',     requireAdmin, ctrl.updateUser);
router.delete('/users/:id',  requireAdmin, ctrl.deleteUser);

// Vendor management
router.get('/vendors',         requireAdmin, ctrl.getVendors);
router.post('/vendors',        requireAdmin, ctrl.addVendor);
router.put('/vendors/:id',     requireAdmin, ctrl.updateVendor);
router.delete('/vendors/:id',  requireAdmin, ctrl.deleteVendor);

module.exports = router;
