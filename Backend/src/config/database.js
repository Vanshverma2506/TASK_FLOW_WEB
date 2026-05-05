import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log( "MongoDB Connected" );

  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); 
  }
};

export default connectToDb;