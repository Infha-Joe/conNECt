async function testVerification() {
  try {
    const res = await fetch('http://127.0.0.1:5000/api/auth/verify-email/742f6ac3e90543bacc60d231223718a0b08e0a7e63aa926d719b95fb0b3e6710');
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(`Fetch failed: ${err.message}`);
  }
}
testVerification();
