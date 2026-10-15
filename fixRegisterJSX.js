import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');

// Use regex to carefully close the ternary and conditionally render the login link
content = content.replace(
  /<\/form>[\s\S]*?<\/Card>[\s\S]*?<p className="mt-8 text-center text-sm font-medium text-primary-dark-light">[\s\S]*?Already have an account\?\{" "\}[\s\S]*?<Link to="\/login" className="font-bold text-primary hover:underline">[\s\S]*?Sign in here[\s\S]*?<\/Link>[\s\S]*?<\/p>/,
  `          </form>
        </Card>
        )}
        
        {!successMessage && (
          <p className="mt-8 text-center text-sm font-medium text-primary-dark-light">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        )}`
);

fs.writeFileSync('client/src/pages/Register.jsx', content);
console.log("Fixed JSX syntax in Register.jsx");
