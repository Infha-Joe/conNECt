const runTest = async () => {
  try {
    console.log("1. Testing Registration...");
    const regRes = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Student", email: "studenttest@nec.edu.in", password: "password123",
        collegeId: "TEST999", department: "CSE", year: "1"
      })
    });
    const regData = await regRes.json();
    console.log("Registration Response:", regData);

    console.log("2. Attempting to Login while unverified...");
    const logRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "studenttest@nec.edu.in", password: "password123" })
    });
    const logData = await logRes.json();
    if (logData.success) {
      console.log("WARNING: Login succeeded, but it should have been blocked!");
    } else {
      console.log("Login blocked as expected:", logData.message);
    }
  } catch (err) {
    console.error("Test failed:", err);
  }
};
runTest();
