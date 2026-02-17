const Vendor  = require('../models/Vendor');
const Product = require('../models/Product');
const Order   = require('../models/Order');

// POST /api/vendor/signup
exports.signup = async (req, res) => {
  const { name, email, password, category } = req.body;
  if (!name || !email || !password || !category)
    return res.status(400).json({ message: 'All fields are required.' });
  try {
    const exists = await Vendor.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered.' });
    const vendor = await Vendor.create({ name, email, password, category });
    res.status(201).json({ message: 'Signup successful. Please log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/vendor/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await vendor.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials.' });
    req.session.user = { id: vendor._id, role: 'vendor', name: vendor.name };
    res.json({ message: 'Login successful', role: 'vendor', name: vendor.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/vendor/logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out.' });
};

// GET /api/vendor/products  — own products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.session.user.id, isDeleted: false });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/vendor/products
exports.addProduct = async (req, res) => {
  const { name, price } = req.body;
  const image = req.file ? req.file.filename : '';
  if (!name || !price)
    return res.status(400).json({ message: 'Product name and price are required.' });
  try {
    const product = await Product.create({ vendor: req.session.user.id, name, price, image });
    res.status(201).json({ message: 'Product added.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/vendor/products/:id
exports.updateProduct = async (req, res) => {
  const { name, price } = req.body;
  const image = req.file ? req.file.filename : undefined;
  const update = { name, price };
  if (image) update.image = image;
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.session.user.id },
      update, { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product updated.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/vendor/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.session.user.id },
      { isDeleted: true }
    );
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/vendor/orders  — orders containing this vendor's products
exports.getOrders = async (req, res) => {
  try {
    const myProducts = await Product.find({ vendor: req.session.user.id }).select('_id');
    const productIds = myProducts.map(p => p._id);
    const orders = await Order.find({ 'items.product': { $in: productIds } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/vendor/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Received', 'Ready for Shipping', 'Out for Delivery', 'Delivered'];
  if (!validStatuses.includes(status))
    return res.status(400).json({ message: 'Invalid status value.' });
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ message: 'Status updated.', status: order.status });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
