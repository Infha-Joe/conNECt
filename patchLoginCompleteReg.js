import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Login.jsx', 'utf8');

content = content.replace(
  'const handleCompleteRegistration = async (e) => {\n    e.preventDefault();\n    setError("");',
  `const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError("");
    
    const normalizedEmail = googleData?.email?.trim().toLowerCase() || "";
    if (role === "student" && !normalizedEmail.endsWith("@nec.edu.in")) {
      setError("Students must use a valid NEC domain email (@nec.edu.in)");
      return;
    }
    if (role === "teacher" && !normalizedEmail.endsWith("@nec.edu.in")) {
      setError("Faculty must use a valid NEC domain email (@nec.edu.in)");
      return;
    }`
);

fs.writeFileSync('client/src/pages/Login.jsx', content);
console.log("Added frontend domain validation to Google Auth in Login.jsx");
