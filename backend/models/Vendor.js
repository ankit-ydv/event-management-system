const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const vendorSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  category: {
    type: String,
    enum: ['Catering', 'Florist', 'Decoration', 'Lighting'],
    required: true
  },
  contactDetails: { type: String, default: '' },
  isActive:       { type: Boolean, default: true },
  createdAt:      { type: Date, default: Date.now }
});

vendorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

vendorSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Vendor', vendorSchema);
