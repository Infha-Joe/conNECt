import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js'; // Assumes run from server dir

dotenv.config();

const usersToCreate = [
  {
    name: "Test Student One",
    email: "student1@nec.edu.in",
    password: "password123",
    role: "student",
    emailVerified: true
  },
  {
    name: "Test Student Two",
    email: "student2@nec.edu.in",
    password: "password123",
    role: "student",
    emailVerified: true
  },
  {
    name: "Test Teacher One",
    email: "teacher1@nec.edu.in",
    password: "password123",
    role: "teacher",
    emailVerified: true
  },
  {
    name: "Test Teacher Two",
    email: "teacher2@nec.edu.in",
    password: "password123",
    role: "teacher",
    emailVerified: true
  },
  {
    name: "Test Alumni One",
    email: "alumni1@gmail.com",
    password: "password123",
    role: "alumni",
    emailVerified: true
  },
  {
    name: "Test Alumni Two",
    email: "alumni2@gmail.com",
    password: "password123",
    role: "alumni",
    emailVerified: true
  },
  {
    name: "System Admin",
    email: "admin@nec.edu.in",
    password: "password123",
    role: "admin",
    emailVerified: true
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    
    for (const u of usersToCreate) {
      // Find and delete existing to ensure clean state
      await User.deleteOne({ email: u.email });
      
      // Create user (pre-save hook will hash password)
      await User.create(u);
      console.log(`Created ${u.role}: ${u.email} / ${u.password}`);
    }
    
    console.log("All requested test users seeded successfully!");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seedUsers();
