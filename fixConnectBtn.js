import fs from 'fs';

let content = fs.readFileSync('client/src/components/ConnectButton.jsx', 'utf8');

content = content.replace(
  /const sendRequest = async \(\) => \{[\s\S]*?finally \{/m,
  `const sendRequest = async () => {
    setSubmitting(true);
    setStatus("pending-outgoing"); // optimistic
    try {
      const res = await api.post(\`/users/\${userId}/connect\`);
      if (res.data && res.data.status) {
        setStatus(res.data.status); // update with actual backend status
      }
    } catch (err) {
      // If the backend says we're already connected, fetch the real status
      load();
    } finally {`
);

fs.writeFileSync('client/src/components/ConnectButton.jsx', content);
console.log("Updated ConnectButton sendRequest");
