async function testFrontendUrl() {
  try {
    const res = await fetch('http://127.0.0.1:5173/verify-email/123');
    const text = await res.text();
    console.log(text.substring(0, 500));
  } catch (err) {
    console.log(err.message);
  }
}
testFrontendUrl();
