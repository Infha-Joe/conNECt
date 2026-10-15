import mongoose from "mongoose";

const checkUsers = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/conNECt");
  const users = await mongoose.connection.db.collection("users").find({}).toArray();
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
};

checkUsers();
