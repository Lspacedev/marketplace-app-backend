import mongoose from "mongoose";

async function mongooseConnection() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI2);
    console.log(`MongoDb connected to: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export default mongooseConnection;
