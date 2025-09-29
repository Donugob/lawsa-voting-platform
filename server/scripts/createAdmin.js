// server/scripts/createAdmin.js
const mongoose = require('mongoose');
const path = require('path');
const Admin = require('../models/Admin');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// --- CONFIGURE YOUR ADMIN CREDENTIALS HERE ---
const ADMIN_USERNAME = "donugob";
const ADMIN_PASSWORD = "65501289"; // Use a strong, secure password
// ---------------------------------------------

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected for admin creation...");

    // Check if an admin with this username already exists
    const existingAdmin = await Admin.findOne({ username: ADMIN_USERNAME });
    if (existingAdmin) {
      console.log("An admin with this username already exists.");
      return; // Exit the script
    }

    // Create the new admin user
    await Admin.create({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD, // The 'pre-save' hook in the model will hash this automatically
    });

    console.log(`Admin user '${ADMIN_USERNAME}' created successfully!`);
    console.log("You can now use these credentials to log into the admin dashboard.");

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

createAdminUser();