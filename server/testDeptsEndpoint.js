import fetch from 'node-fetch';
const test = async () => {
  const res = await fetch('http://localhost:5005/api/departments');
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
};
test();
