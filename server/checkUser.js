import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function checkAndResetUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    
    const email = 'student2@nec.edu.in';
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User ${email} does not exist in the database.`);
      
      const newPassword = 'password123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      const newUser = await User.create({
         name: "Test Student Two",
         email: email,
         password: hashedPassword,
         role: "student",
         department: "Information Technology",
         year: 2025,
         isEmailVerified: true
      });
      console.log(`Created user ${email} with password: ${newPassword}`);

    } else {
      console.log(`Found user: ${user.name} (${user.email})`);
      
      const newPassword = 'password123';
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      
      await user.save();
      console.log(`Password for ${email} has been reset to: ${newPassword}`);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

checkAndResetUser();
