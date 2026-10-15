const test = async () => {
  const verRes = await fetch(`http://localhost:5005/api/auth/verify-email/f7aa75ac13ff3b56feba059f3d3233e6be36919ea82570e926e8a905f4a067b5`);
  console.log(await verRes.json());
  process.exit();
};
test();
