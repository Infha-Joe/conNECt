import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');

// Add successMessage state
content = content.replace(
  'const [submitting, setSubmitting] = useState(false);',
  'const [submitting, setSubmitting] = useState(false);\n  const [successMessage, setSuccessMessage] = useState("");'
);

// Replace navigate with setSuccessMessage
content = content.replace(
  'await register(payload);\n      navigate("/dashboard");',
  'const res = await register(payload);\n      setSuccessMessage(res.data?.message || "Registration successful! Please check your email to verify your account.");'
);

// Render success card if successMessage is set
content = content.replace(
  'return (\n    <div className="flex min-h-screen',
  `return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 bg-[url('/campus.jpg')] bg-cover bg-center bg-no-repeat relative font-sans p-4">
      <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-[2px]"></div>
      
      {successMessage ? (
        <Card className="relative w-full max-w-md bg-background/95 shadow-2xl backdrop-blur-xl border-border">
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary-dark tracking-tight">Registration Successful!</h2>
            <p className="text-sm text-primary-dark/80 leading-relaxed font-medium">
              {successMessage}
            </p>
            <Link
              to="/login"
              className="mt-6 block w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-dark hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Go to Login
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="relative w-full max-w-[1000px] bg-background/95 shadow-2xl backdrop-blur-xl border-border overflow-hidden">
`
);

// Close the wrapper div at the end of the file
content = content.replace(
  '</Card>\n    </div>\n  );\n};\n\nexport default Register;',
  '</Card>\n      )}\n    </div>\n  );\n};\n\nexport default Register;'
);

fs.writeFileSync('client/src/pages/Register.jsx', content);
console.log("Patched Register.jsx success message");
