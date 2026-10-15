import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testFlow = async () => {
  try {
    // Check if testauth already exists and delete
    await mongoose.connect(process.env.MONGO_URI);
    const User = (await import('./models/User.js')).default;
    await User.deleteOne({ email: 'testauth@nec.edu.in' });
  
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

    // 2. Check DB
    const user = await User.findOne({ email: 'testauth@nec.edu.in' });
    console.log("User in DB emailVerified:", user.emailVerified);
    console.log("User token exists:", !!user.verificationToken);

    // 3. Verify
    console.log("Verifying email via API...");
    const verRes = await fetch(`http://127.0.0.1:5000/api/auth/verify-email/${user.verificationToken}`);
    const verData = await verRes.json();
    console.log("Verification Response:", verData);
    if (!verRes.ok) throw new Error("Verification failed");

    // 4. Check DB again
    const user2 = await User.findOne({ email: 'testauth@nec.edu.in' });
    console.log("User in DB emailVerified:", user2.emailVerified);

    // 5. Login
    console.log("Logging in...");
    const loginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testauth@nec.edu.in',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log("Login Response token:", loginData.token ? "YES" : "NO");
    console.log("Login User Role:", loginData.user?.role);

    // Cleanup
    await User.deleteOne({ email: 'testauth@nec.edu.in' });
    
    console.log("Flow successful!");
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
};
testFlow();
