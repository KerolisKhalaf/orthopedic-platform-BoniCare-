import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const connect = async () => {
  mongoServer = await MongoMemoryServer.create({
    replSet: { count: 1, storageEngine: 'wiredTiger', name: 'rs0' }
  });
  const uri = mongoServer.getUri();
  // Transactions need a replica set, and mongoose needs to be connected with specific options
  await mongoose.connect(uri);
};

export const closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
