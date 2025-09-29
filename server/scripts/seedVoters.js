// server/scripts/seedVoters.js
const mongoose = require('mongoose');
const path = require('path');
const Voter = require('../models/Voter'); // Adjust path to your Voter model
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // We need to specify the path to .env

// --- DEFINE THE LIST OF ELIGIBLE VOTERS ---
// In a real application, you would get this list from the school's administration.
// For our test, we'll use a simple array of matriculation numbers.
const eligibleVoters = [
  { matricNumber: 'IMSU/LAW/21/1001' },
  { matricNumber: 'IMSU/LAW/21/1002' },
  { matricNumber: 'IMSU/LAW/22/2003' },
  { matricNumber: 'IMSU/LAW/22/2004' },
  { matricNumber: 'IMSU/LAW/23/3005' },
  { matricNumber: 'IMSU/LAW/23/3006' },
  { matricNumber: 'IMSU/2021/3725' },
];
// ------------------------------------------

const seedDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected for seeding...");

    // Clear the existing voters collection to avoid duplicates
    await Voter.deleteMany({});
    console.log("Existing voters cleared.");

    // Insert the new list of voters
    await Voter.insertMany(eligibleVoters);
    console.log("New voters have been added successfully!");

  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Disconnect from the database whether it succeeded or failed
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the seeding function
seedDatabase();