const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor:    { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name:      { type: String, required: true, trim: true },
  price:     { type: Number, required: true, min: 0 },
  image:     { type: String, default: '' },  // filename stored in /uploads
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
