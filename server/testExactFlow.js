import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testFlow = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = (await import('./models/User.js')).default;
    await User.deleteOne({ email: '24205052@nec.edu.in' });
  
    console.log("Registering test student EXACTLY as frontend would send...");
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountType: 'student',
        name: 'Infhant Joseph T',
        email: '24205052@nec.edu.in',
        password: 'password123',
        role: 'student',
        collegeId: '24205052',
        year: '3',
        department: 'IT'
      })
    });
    const regData = await regRes.json();
    console.log("Registration Response:", regData);
    if (!regRes.ok) throw new Error("Registration failed: " + JSON.stringify(regData));

    // Check DB
    const user = await User.findOne({ email: '24205052@nec.edu.in' }).populate('department');
    console.log("User in DB emailVerified:", user.emailVerified);
    console.log("User token exists:", !!user.verificationToken);
    console.log("User Department populated code:", user.department?.code);
    console.log("User year:", user.year);

    // Verify
    console.log("Verifying email via API...");
    const verRes = await fetch(`http://localhost:5000/api/auth/verify-email/${user.verificationToken}`);
    const verData = await verRes.json();
    console.log("Verification Response:", verData);
    if (!verRes.ok) throw new Error("Verification failed");

    await User.deleteOne({ email: '24205052@nec.edu.in' });
    console.log("Flow successful!");
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
};
testFlow();
