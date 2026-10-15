import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Login.jsx', 'utf8');

const importReplacement = `import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";`;

content = content.replace(
  'import { Link, useNavigate } from "react-router-dom";\nimport { useAuth } from "../context/AuthContext";',
  importReplacement
);

const stateReplacement = `  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const { login, googleLogin, completeRegistration } = useAuth();`;

content = content.replace(
  'const [submitting, setSubmitting] = useState(false);\n  const { login, googleLogin, completeRegistration } = useAuth();',
  stateReplacement
);

const handlerReplacement = `
  const handleResendVerification = async () => {
    if (!email) {
      setError("Please enter your email address to resend the verification link.");
      return;
    }
    setResending(true);
    setError("");
    setResendSuccess("");
    try {
      const res = await api.post("/auth/resend-verification", { email });
      setResendSuccess(res.data?.message || "Verification email sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {`;

content = content.replace(
  'const handleGoogleSuccess = async (credentialResponse) => {',
  handlerReplacement
);

const errorReplacement = `{error && (
              <div className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger flex flex-col gap-2">
                <span>{error}</span>
                {error.includes("verify your email") && (
                  <button 
                    type="button" 
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="text-left font-bold underline hover:text-danger/80"
                  >
                    {resending ? "Sending..." : "Resend Verification Email"}
                  </button>
                )}
              </div>
            )}
            
            {resendSuccess && (
              <div className="rounded-lg bg-green-500/10 p-3 text-sm font-medium text-green-700">
                {resendSuccess}
              </div>
            )}`;

content = content.replace(
  '{error && (\n              <div className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger">\n                {error}\n              </div>\n            )}',
  errorReplacement
);

fs.writeFileSync('client/src/pages/Login.jsx', content);
console.log("Added Resend Verification functionality to Login.jsx");
