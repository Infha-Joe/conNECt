const testLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: " admin@nec.edu.in ", password: "password123" })
    });
    const data = await res.json();
    console.log("LOGIN RESULT:", data);
  } catch (err) {
    console.error("LOGIN FAILED!", err);
  }
};
testLogin();
