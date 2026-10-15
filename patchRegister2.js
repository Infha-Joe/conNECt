import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');

content = content.replace(
  /const payload = {[\s\S]*?role\s*};/,
  `const payload = { 
        accountType: role === "alumni" ? "alumni_new" : role,
        name: form.name, 
        email: form.email, 
        password: form.password, 
        role 
      };

      const selectedDept = departments.find(d => d._id === form.department);
      const mappedDepartment = selectedDept ? selectedDept.code : form.department;`
);

fs.writeFileSync('client/src/pages/Register.jsx', content);
console.log("Patched Register.jsx payload properly");
