import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();
const tenantgod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
const connect = async () => {
  // Start both database services in parallel
  await mongod.start();
  await tenantgod.start();
  // Get the URIs
  const uri = mongod.getUri();
  const tenantUri = tenantgod.getUri();

  // Connect to the tenants database using createConnection
  const tenantConnection = await mongoose.createConnection(tenantUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Connect to the main database using the default mongoose connection
  const mainConnection = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return { mainConnection: mainConnection, tenantConnection: tenantConnection };
};

/**
 * Drop database, close the connection and stop mongod.
 */
const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 * Remove all the data for all db collections.
 */
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

export default { connect, closeDatabase, clearDatabase };
