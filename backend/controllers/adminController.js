const Admin   = require('../models/Admin');
const User    = require('../models/User');
const Vendor  = require('../models/Vendor');
const bcrypt  = require('bcryptjs');

// POST /api/admin/login
exports.login = async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password)
    return res.status(400).json({ message: 'User ID and password are required.' });
  try {
    const admin = await Admin.findOne({ userId });
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials.' });
    req.session.user = { id: admin._id, role: 'admin', userId: admin.userId };
    res.json({ message: 'Login successful', role: 'admin' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/admin/logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out.' });
};

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/admin/users
exports.addUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required.' });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered.' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'User added.', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User updated.', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/admin/vendors
exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password');
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/admin/vendors
exports.addVendor = async (req, res) => {
  const { name, email, password, category, contactDetails } = req.body;
  if (!name || !email || !password || !category)
    return res.status(400).json({ message: 'All required fields must be filled.' });
  try {
    const exists = await Vendor.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered.' });
    const vendor = await Vendor.create({ name, email, password, category, contactDetails });
    res.status(201).json({ message: 'Vendor added.', vendor: { id: vendor._id, name: vendor.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/admin/vendors/:id
exports.updateVendor = async (req, res) => {
  const { name, email, category, contactDetails } = req.body;
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id, { name, email, category, contactDetails }, { new: true }
    ).select('-password');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found.' });
    res.json({ message: 'Vendor updated.', vendor });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/admin/vendors/:id
exports.deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vendor deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
