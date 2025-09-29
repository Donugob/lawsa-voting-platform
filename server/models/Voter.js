// server/models/Voter.js
const mongoose = require('mongoose');

const VoterSchema = new mongoose.Schema({
  matricNumber: {
    type: String,
    required: true,
    unique: true, // Each matric number must be unique in the database
    uppercase: true, // Automatically convert matric number to uppercase
    trim: true // Remove any extra spaces from the beginning or end
  },
  hasVoted: {
    type: Boolean,
    default: false // Voters have not voted by default
  }
  // We will add a password/PIN field later for more security
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Voter = mongoose.model('Voter', VoterSchema);

module.exports = Voter;