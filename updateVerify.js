const fs = require('fs');

const code = `
import { useState, useEffect, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import Card from "../components/ui/Card";

const VerifyEmail = () => {
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get("token");
  
  // Support both /verify-email/:token and /verify-email?token=...
  const token = routeToken || queryToken;

  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    if (!token) {
      setStatus("error");
      setMessage("Verification link is invalid or missing token.");
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(\`/auth/verify-email/\${token}\`);
        setStatus("success");
        setMessage(res.data?.message || "Email verified successfully.");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed. The link might be expired.");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 bg-[url('/campus.jpg')] bg-cover bg-center bg-no-repeat relative font-sans p-4">
      <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-[420px]">
        <Card className="p-7 sm:p-9 shadow-2xl border-0 bg-white/95 backdrop-blur-xl text-center rounded-2xl">
          <div className="mb-6">
            <p className="font-display text-3xl font-bold tracking-tight text-ink">
              con<span className="text-brand">NEC</span>t
            </p>
          </div>

          {status === "loading" && (
            <div className="py-4 space-y-4">
              <FiLoader className="mx-auto h-12 w-12 text-brand animate-spin" />
              <div>
                <h2 className="text-lg font-bold text-ink">Verifying Email...</h2>
                <p className="text-sm text-slate-500 mt-1">Please wait a moment.</p>
              </div>
            </div>
          )}
          
          {status === "success" && (
            <div className="py-4 space-y-5">
              <FiCheckCircle className="mx-auto h-14 w-14 text-green-500" />
              <div>
                <h2 className="text-xl font-bold text-ink">Email Verified!</h2>
                <p className="text-sm text-slate-600 mt-2 font-medium">{message}</p>
              </div>
              <Link to="/login" className="block w-full rounded-xl bg-brand py-3 text-sm font-bold text-white shadow-md hover:bg-brand/90 transition-colors">
                Continue to Sign In
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="py-4 space-y-5">
              <FiXCircle className="mx-auto h-14 w-14 text-red-500" />
              <div>
                <h2 className="text-xl font-bold text-ink">Verification Failed</h2>
                <p className="text-sm text-slate-600 mt-2 font-medium">{message}</p>
              </div>
              <Link to="/login" className="block w-full rounded-xl bg-slate-200 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-300 transition-colors">
                Return to Sign In
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
`;

fs.writeFileSync('client/src/pages/VerifyEmail.jsx', code);
console.log("Updated VerifyEmail.jsx");
