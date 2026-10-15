import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');

// Add frontend validation for email domain
content = content.replace(
  'const handleSubmit = async (e) => {\n    e.preventDefault();\n    setError("");\n    setSubmitting(true);',
  `const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Frontend domain validation
    const normalizedEmail = form.email.trim().toLowerCase();
    if (role === "student" && !normalizedEmail.endsWith("@nec.edu.in")) {
      setError("Students must use a valid NEC domain email (@nec.edu.in)");
      return;
    }
    if (role === "teacher" && !normalizedEmail.endsWith("@nec.edu.in")) {
      setError("Faculty must use a valid NEC domain email (@nec.edu.in)");
      return;
    }
    
    setSubmitting(true);`
);

fs.writeFileSync('client/src/pages/Register.jsx', content);
console.log("Added frontend domain validation to Register.jsx");
