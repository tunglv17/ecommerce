import mongoose from "mongoose";

const Url =
  (process.env.DB_URI as string) ||
  "mongodb+srv://tunglv:794CQEOrbp5Ob6X2@cluster0.zjte5iv.mongodb.net/ecommerce";

const dbConnect = async () => {
  try {
    if (!Url) {
      console.log("DB not found");
      return;
    }
    await mongoose.connect(Url);
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.log("Unable to connect to the database:" + error);
  }
};

export default dbConnect;
