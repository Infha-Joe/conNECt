import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testFlow = async () => {
  try {
    console.log("Registering test user...");
    const regRes = await fetch('http://127.0.0.1:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountType: 'student',
        name: 'Test Student',
        email: 'testauth@nec.edu.in',
        password: 'password123',
        collegeId: 'NEC123',
        year: 1
      })
    });
    const regData = await regRes.json();
    console.log("Registration Response:", regData);
    if (!regRes.ok) throw new Error("Registration failed");
    console.log("Flow successful!");
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
};
testFlow();
