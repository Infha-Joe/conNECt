const testLogin = async (email) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "password123" })
    });
    const data = await res.json();
    console.log(`LOGIN RESULT FOR ${email}:`, data.success ? "SUCCESS" : data.message);
  } catch (err) {
    console.error(`LOGIN FAILED FOR ${email}!`, err);
  }
};
testLogin("teacher@nec.edu.in");
testLogin("student@nec.edu.in");
