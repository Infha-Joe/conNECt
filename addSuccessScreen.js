import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');

// The replacement logic:
const successScreenJSX = `
        {successMessage ? (
          <Card className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 mb-4">
              <svg className="h-6 w-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-ink mb-2">Check your email</h2>
            <p className="text-ink-light mb-6">
              We've sent a verification link to:<br/>
              <span className="font-semibold text-ink">{form.email}</span>
            </p>
            <div className="bg-surface border border-border rounded-lg p-4 mb-6 text-sm text-ink-light text-left">
              <p className="mb-2">Please check your inbox and click <strong>Activate Account</strong> to verify your conNECt account.</p>
              <p>Didn't receive the email? Check your spam/junk folder.</p>
            </div>
            <Link to="/login" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-brand text-white font-semibold hover:bg-brand/90 transition-colors">
              Back to Login
            </Link>
          </Card>
        ) : (
          <Card className="p-8">
`;

content = content.replace('<Card className="p-8">', successScreenJSX);

content = content.replace(
  '</form>\n        </Card>\n        \n        <p className="mt-8 text-center text-sm font-medium text-primary-dark-light">',
  '</form>\n        </Card>\n        )}\n        \n        {!successMessage && <p className="mt-8 text-center text-sm font-medium text-primary-dark-light">'
);

content = content.replace(
  '</Link>\n        </p>',
  '</Link>\n        </p>}'
);

fs.writeFileSync('client/src/pages/Register.jsx', content);
console.log("Updated Register.jsx to include success screen");
