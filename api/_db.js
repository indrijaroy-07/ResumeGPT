const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return mongoose;

  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    // start in-memory MongoDB for demo
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    console.log('Started in-memory MongoDB');
  }

  await mongoose.connect(mongoUri);
  isConnected = true;
  return mongoose;
}

module.exports = { connectDB };
