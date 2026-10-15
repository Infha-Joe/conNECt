const fs = require('fs');
let code = fs.readFileSync('tailwind.config.js', 'utf8');
code = code.replace("DEFAULT: '#176B5B', \n          dark: '#17221F',", "DEFAULT: '#176B5B',\n          hover: '#135c4e',\n          dark: '#17221F',");
fs.writeFileSync('tailwind.config.js', code);
