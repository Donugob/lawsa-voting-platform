// server/controllers/electionController.js
const Position = require('../models/Position');
const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate');
const mongoose = require('mongoose');

// --- Function to GET all election data (the ballot) ---
exports.getElectionData = async (req, res) => {
  try {
    // Find all positions and populate them with their candidate details
    const positions = await Position.find({}).populate('candidates');
    
    res.status(200).json(positions);
  } catch (error) {
    console.error("Error fetching election data:", error);
    res.status(500).json({ message: "Server error while fetching election data." });
  }
};


// --- Function to SUBMIT a vote ---
exports.submitVote = async (req, res) => {
  const { voterId, votes } = req.body; 
  
  // Stronger validation
  if (!voterId || !votes || Object.keys(votes).length === 0) {
    return res.status(400).json({ message: "Missing voter ID or a valid vote submission." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // SECURITY CHECK 1: Find the voter within the transaction session
    const voter = await Voter.findById(voterId).session(session);

    if (!voter) {
      throw new Error("Voter not found. Invalid session.");
    }

    // SECURITY CHECK 2: Prevent double voting
    if (voter.hasVoted) {
      throw new Error("This voter has already submitted their vote.");
    }
    
    // --- NEW VOTE TALLYING LOGIC ---
    // Create an array of update operations for each selected candidate
    const voteTallyPromises = Object.values(votes).map(candidateId => {
      return Candidate.updateOne(
        { _id: candidateId },
        { $inc: { votes: 1 } }, // Use MongoDB's $inc operator to safely increment
        { session }
      );
    });
    
    // In a real app, you would add logic here to tally the votes.
    // For this project, the most important step is marking the voter as "voted".
    
    await Promise.all(voteTallyPromises);
    // ------------------------------------

    // Update the voter's status to prevent them from voting again
    voter.hasVoted = true;
    await voter.save({ session });
    
    // If all operations were successful, commit the transaction
   await session.commitTransaction();
    
    res.status(200).json({ message: "Your vote has been cast successfully!" });

  } catch (error) {
    // If any error occurred, abort the entire transaction
    await session.abortTransaction();
    console.error("Vote submission error:", error.message);
    // Send back the specific error message (e.g., "This voter has already voted.")
    res.status(400).json({ message: error.message || "An error occurred while submitting your vote." });
  } finally {
    // Always end the session
    session.endSession();
  }
};