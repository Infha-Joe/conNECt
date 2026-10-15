import fetch from 'node-fetch';

const test = async () => {
  try {
    // 1. Fetch departments
    const deptRes = await fetch('http://localhost:5005/api/departments');
    const deptData = await deptRes.json();
    const itDept = deptData.departments.find(d => d.code === 'IT');
    console.log("Found IT Department ID:", itDept._id);

    // 2. Register
    const regPayload = {
      accountType: 'student',
      name: 'Test Student',
      email: 'test_dept@nec.edu.in',
      password: 'password123',
      role: 'student',
      collegeId: '99999999',
      year: '3',
      department: itDept.code // frontend sends code as mappedDepartment
    };

    const regRes = await fetch('http://localhost:5005/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload)
    });
    const regData = await regRes.json();
    console.log("Registration Response:", regData);

    // 3. Clean up
    import('mongoose').then(async (mongoose) => {
      await mongoose.default.connect('mongodb://127.0.0.1:27017/conNECt');
      const User = (await import('./models/User.js')).default;
      await User.deleteOne({ email: 'test_dept@nec.edu.in' });
      console.log("Cleaned up test user");
      process.exit();
    });

  } catch (err) {
    console.error(err);
  }
};
test();
