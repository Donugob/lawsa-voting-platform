// server/models/Position.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PositionSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true, // e.g., there can only be one "President" position
    trim: true
  },
  candidates: [{
    type: Schema.Types.ObjectId,
    ref: 'Candidate' // This creates a link to the Candidate model
  }]
});

const Position = mongoose.model('Position', PositionSchema);

module.exports = Position;