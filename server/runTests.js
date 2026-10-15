import fs from 'fs';
import { execSync } from 'child_process';
fs.appendFileSync('.env', '\n');
setTimeout(() => {
  execSync('node testCases2.js', { stdio: 'inherit' });
}, 3000);
