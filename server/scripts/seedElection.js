// server/scripts/seedElection.js
const mongoose = require('mongoose');
const path = require('path');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const seedElectionData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected for election seeding...");

    // Clear existing election data
    await Candidate.deleteMany({});
    await Position.deleteMany({});
    console.log("Existing candidates and positions cleared.");

    // --- CREATE CANDIDATES ---
    const presCandidate1 = await Candidate.create({ name: 'Adaobi Nwosu' });
    const presCandidate2 = await Candidate.create({ name: 'Chinedu Okoro' });

    const vpCandidate1 = await Candidate.create({ name: 'Bello Adekunle' });
    const vpCandidate2 = await Candidate.create({ name: 'Fatima Yusuf' });

    const secGenCandidate1 = await Candidate.create({ name: 'Emeka Obi' });

    console.log("Candidates created.");

    // --- CREATE POSITIONS AND LINK CANDIDATES ---
    await Position.create({
      title: 'President',
      candidates: [presCandidate1._id, presCandidate2._id]
    });

    await Position.create({
      title: 'Vice President',
      candidates: [vpCandidate1._id, vpCandidate2._id]
    });

    await Position.create({
      title: 'Secretary General',
      candidates: [secGenCandidate1._id] // Unopposed candidate
    });

    console.log("Positions created and linked with candidates.");
    console.log("Election data has been seeded successfully!");

  } catch (error) {
    console.error("Error seeding election data:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedElectionData();