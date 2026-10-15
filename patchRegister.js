import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');

content = content.replace(
  'const payload = { \n        name: form.name, \n        email: form.email, \n        password: form.password, \n        role \n      };',
  `const payload = { 
        accountType: role === "alumni" ? "alumni_new" : role,
        name: form.name, 
        email: form.email, 
        password: form.password, 
        role 
      };

      // Map the department ID from the form to the department code expected by the backend
      const selectedDept = departments.find(d => d._id === form.department);
      const mappedDepartment = selectedDept ? selectedDept.code : form.department;`
);

content = content.replace(
  'payload.department = form.department;',
  'payload.department = mappedDepartment;'
);
content = content.replace(
  'payload.department = form.department;',
  'payload.department = mappedDepartment;'
);
content = content.replace(
  'payload.department = form.department;',
  'payload.department = mappedDepartment;'
);

content = content.replace(
  'payload.designation = form.designation;',
  'payload.designation = form.designation;\n        payload.facultyId = form.designation; // Map designation to facultyId to satisfy backend'
);

content = content.replace(
  'payload.batch = form.batch;',
  'payload.batch = form.batch;\n        // Extract graduationYear from batch string (e.g. 2020-2024 -> 2024)\n        const batchParts = form.batch.split("-");\n        payload.graduationYear = batchParts.length > 1 ? parseInt(batchParts[1].trim()) : parseInt(form.batch.trim());'
);

fs.writeFileSync('client/src/pages/Register.jsx', content);
console.log("Patched Register.jsx successfully");
