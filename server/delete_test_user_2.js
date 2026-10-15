import mongoose from 'mongoose';

const deleteUser = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/conNECt');
    const db = mongoose.connection.db;
    const result = await db.collection('users').deleteOne({ collegeId: '24205052' });
    if (result.deletedCount === 1) {
      console.log("Successfully deleted user with collegeId: 24205052");
    } else {
      console.log("User not found or already deleted.");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};
deleteUser();
