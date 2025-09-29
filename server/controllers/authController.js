// server/controllers/authController.js
const Voter = require('../models/Voter');

exports.login = async (req, res) => {
  // Get the matriculation number from the request body
  const { matricNumber } = req.body;

  // 1. Check if matricNumber was provided
  if (!matricNumber) {
    return res.status(400).json({ message: 'Please provide a matriculation number.' });
  }

  try {
    // 2. Find a voter in the database with that matric number
    const voter = await Voter.findOne({ matricNumber: matricNumber.toUpperCase() });

    // 3. If no voter is found
    if (!voter) {
      return res.status(404).json({ message: 'Matriculation number not found. You are not eligible to vote.' });
    }

    // 4. If the voter is found, send a success response (for now)
    // We will add JWT token generation here later
    res.status(200).json({
      message: 'Login successful!',
      voter: {
        id: voter._id,
        matricNumber: voter.matricNumber,
        hasVoted: voter.hasVoted
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};