async function testFrontendUrl() {
  try {
    const res = await fetch('http://localhost:5173/verify-email/123');
    const text = await res.text();
    console.log(text.substring(0, 500));
  } catch (err) {
    console.log(err.message);
  }
}
testFrontendUrl();
