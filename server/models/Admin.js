// server/models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // <-- IMPORT BCRYPT

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// --- ADD THIS MIDDLEWARE ---
// This function will run BEFORE an Admin document is saved
AdminSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  // Hash the password with a salt round of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;