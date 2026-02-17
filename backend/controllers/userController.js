const User    = require('../models/User');
const Vendor  = require('../models/Vendor');
const Product = require('../models/Product');
const Cart    = require('../models/Cart');
const Order   = require('../models/Order');

// POST /api/user/signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required.' });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered.' });
    await User.create({ name, email, password });
    res.status(201).json({ message: 'Signup successful. Please log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/user/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials.' });
    req.session.user = { id: user._id, role: 'user', name: user.name };
    res.json({ message: 'Login successful', role: 'user', name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/user/logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out.' });
};

// GET /api/user/vendors?category=Florist
exports.getVendors = async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  try {
    const vendors = await Vendor.find(filter).select('-password');
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/user/vendors/:vendorId/products
exports.getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.params.vendorId, isDeleted: false });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/user/cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.user.id }).populate('items.product');
    if (!cart) return res.json({ items: [], grandTotal: 0 });
    const grandTotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items: cart.items, grandTotal });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/user/cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ message: 'Product ID is required.' });
  try {
    const product = await Product.findById(productId);
    if (!product || product.isDeleted) return res.status(404).json({ message: 'Product not found.' });

    let cart = await Cart.findOne({ user: req.session.user.id });
    if (!cart) cart = new Cart({ user: req.session.user.id, items: [] });

    const existingIndex = cart.items.findIndex(i => i.product.toString() === productId);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += (quantity || 1);
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1, price: product.price });
    }
    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ message: 'Item added to cart.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/user/cart/:productId
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1)
    return res.status(400).json({ message: 'Quantity must be at least 1.' });
  try {
    const cart = await Cart.findOne({ user: req.session.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });
    const item = cart.items.find(i => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart.' });
    item.quantity = quantity;
    await cart.save();
    res.json({ message: 'Cart updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/user/cart/:productId
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json({ message: 'Item removed.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/user/cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.session.user.id });
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/user/checkout
exports.placeOrder = async (req, res) => {
  const { name, email, address, city, state, pinCode, phone, paymentMethod } = req.body;
  if (!name || !email || !address || !city || !state || !pinCode || !phone || !paymentMethod)
    return res.status(400).json({ message: 'All delivery fields are required.' });
  if (!['Cash', 'UPI'].includes(paymentMethod))
    return res.status(400).json({ message: 'Invalid payment method.' });
  try {
    const cart = await Cart.findOne({ user: req.session.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty.' });

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderItems  = cart.items.map(item => ({
      product:  item.product._id,
      name:     item.product.name,
      price:    item.price,
      quantity: item.quantity
    }));

    const order = await Order.create({
      user: req.session.user.id, items: orderItems, totalAmount,
      name, email, address, city, state, pinCode, phone, paymentMethod
    });

    await Cart.findOneAndDelete({ user: req.session.user.id });
    res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/user/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
