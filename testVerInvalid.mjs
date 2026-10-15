const test = async () => {
  const verRes = await fetch(`http://localhost:5005/api/auth/verify-email/invalidtoken123`);
  console.log(await verRes.json());
  process.exit();
};
test();
