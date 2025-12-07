import { mongo } from "./mongodb";

module.exports = async () => {
  await mongo.stop();
};
