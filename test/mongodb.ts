import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

export const mongo = {
  async start() {
    mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri();
  },

  async stop() {
    if (mongod) await mongod.stop();
  },
};
