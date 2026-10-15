import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  // Use the User model indirectly through the mongoose connection to avoid import path issues
  const db = mongoose.connection.useDb("test"); // Or whatever the DB name is, mongoose will use the default from URI
  const result = await mongoose.connection.collection("users").deleteMany({ email: { $regex: "24205059", $options: "i" } });
  console.log(`Deleted ${result.deletedCount} users with email matching '24205059'`);
  process.exit(0);
}).catch(err => {
  console.error("Database connection error:", err);
  process.exit(1);
});
