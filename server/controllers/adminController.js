// server/controllers/adminController.js
const Admin = require('../models/Admin');
const Voter = require('../models/Voter'); // <--- ADDITION 1
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

// Admin Login Controller
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 2. Compare the provided password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 3. If credentials are correct, generate a token and send it back
    res.status(200).json({
      message: 'Admin login successful!',
      token: generateToken(admin._id),
      username: admin.username,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during admin login.' });
  }
};

// <--- ADDITION 2 (The entire block below) --- >

// @desc    Get all voters
// @route   GET /api/admin/voters
// @access  Private
exports.getVoters = async (req, res) => {
  try {
    const voters = await Voter.find({}).sort({ createdAt: -1 }); // Sort by creation date
    res.status(200).json(voters);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching voters.' });
  }
};

// @desc    Get election results
// @route   GET /api/admin/results
// @access  Private
exports.getResults = async (req, res) => {
  try {
    const totalVoters = await Voter.countDocuments({});
    const votedCount = await Voter.countDocuments({ hasVoted: true });
    
    res.status(200).json({
      totalVoters,
      votedCount,
      turnout: totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching results.' });
  }
};

// @desc    Create a new candidate
// @route   POST /api/admin/candidates
exports.createCandidate = async (req, res) => {
  const { name, imageUrl, positionId } = req.body;
  try {
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    const newCandidate = await Candidate.create({ name, imageUrl, position: positionId });
    // Also add this candidate to the position's list
    position.candidates.push(newCandidate._id);
    await position.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating candidate.' });
  }
};

// @desc    Get all candidates
// @route   GET /api/admin/candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({}).populate('position', 'title');
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching candidates.' });
  }
};

// @desc    Delete a candidate
// @route   DELETE /api/admin/candidates/:id
exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Remove the candidate from their associated position
        await Position.updateOne(
            { _id: candidate.position },
            { $pull: { candidates: candidate._id } }
        );

        await Candidate.deleteOne({ _id: req.params.id });
        
        res.status(200).json({ message: 'Candidate removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting candidate.' });
    }
};

// server/controllers/adminController.js
// ...
exports.getPositions = async (req, res) => {
    try {
        const positions = await Position.find({});
        res.status(200).json(positions);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching positions.' });
    }
};

// server/controllers/adminController.js

// ... after your other controller functions (like getVoters, etc.) ...

// @desc    Get detailed election results with vote counts
// @route   GET /api/admin/detailed-results
// @access  Private
exports.getDetailedResults = async (req, res) => {
  try {
    // Find all positions and populate their candidates, then sort candidates by votes
    const positions = await Position.find({}).populate({
      path: 'candidates',
      options: { sort: { votes: -1 } } // Sort candidates by votes in descending order
    });

    res.status(200).json(positions);
  } catch (error) {
    console.error("Error fetching detailed results:", error);
    res.status(500).json({ message: 'Server error fetching detailed results.' });
  }
};

// server/controllers/adminController.js

// ... after your other controller functions ...

// @desc    Add a new eligible voter
// @route   POST /api/admin/voters
// @access  Private
exports.addVoter = async (req, res) => {
  const { matricNumber } = req.body;

  if (!matricNumber) {
    return res.status(400).json({ message: 'Matriculation number is required.' });
  }

  try {
    // Check if voter already exists (case-insensitive)
    const existingVoter = await Voter.findOne({ matricNumber: { $regex: new RegExp(`^${matricNumber}$`, 'i') } });
    if (existingVoter) {
      return res.status(409).json({ message: 'A voter with this matriculation number already exists.' }); // 409 Conflict
    }

    const newVoter = await Voter.create({ matricNumber: matricNumber.toUpperCase() });
    res.status(201).json(newVoter);
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding voter.' });
  }
};

// @desc    Delete a voter
// @route   DELETE /api/admin/voters/:id
// @access  Private
exports.deleteVoter = async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id);
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    await Voter.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Voter removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting voter.' });
  }
};