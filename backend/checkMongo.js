require('dotenv').config();
const mongoose = require('mongoose');

async function checkConnection() {
  console.log('Attempting to connect to MongoDB Atlas...');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Successfully connected to MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB. Error details:');
    console.error(error.message);
    process.exit(1);
  }
}

checkConnection();
