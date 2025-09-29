// server/models/Candidate.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CandidateSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: { 
    type: String,
    required: true
  },
  position: { 
    type: Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  votes: { 
    type: Number,
    default: 0
  },
  // We will link the candidate to a position later
  // For now, let's keep it simple. We can add photo, manifesto etc. here too.
});

const Candidate = mongoose.model('Candidate', CandidateSchema);

module.exports = Candidate;