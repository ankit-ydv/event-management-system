const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     String,
  price:    Number,
  quantity: { type: Number, default: 1 }
});

const orderSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:         [orderItemSchema],
  totalAmount:   { type: Number, required: true },
  name:          { type: String, required: true },
  email:         { type: String, required: true },
  address:       { type: String, required: true },
  city:          { type: String, required: true },
  state:         { type: String, required: true },
  pinCode:       { type: String, required: true },
  phone:         { type: String, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'UPI'], required: true },
  status: {
    type: String,
    enum: ['Received', 'Ready for Shipping', 'Out for Delivery', 'Delivered'],
    default: 'Received'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
