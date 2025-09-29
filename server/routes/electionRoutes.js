// server/routes/electionRoutes.js
const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');

// GET /api/election/ => Fetches all positions and candidates for the ballot
router.get('/', electionController.getElectionData);

// POST /api/election/vote => Submits the voter's choices
router.post('/vote', electionController.submitVote);

module.exports = router;