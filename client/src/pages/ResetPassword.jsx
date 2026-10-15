import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters");
      return;
    }

    setStatus("loading");
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setStatus("success");
      setMessage(res.data.message || "Password successfully reset!");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 bg-[url('/campus.jpg')] bg-cover bg-center bg-no-repeat relative font-sans p-4">
      <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-[420px]">
        <Card className="p-7 sm:p-9 shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-2xl">
          <div className="mb-7 text-center">
            <p className="font-display text-3xl font-bold tracking-tight text-ink">
              con<span className="text-brand">NEC</span>t
            </p>
            <p className="mt-1 text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">
              Set New Password
            </p>
          </div>

          {status === "success" ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <FiCheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-sm font-medium text-slate-600">{message}</p>
              </div>
              <Link to="/login" className="block text-center w-full rounded-xl bg-brand py-3 text-sm font-bold text-white shadow-md hover:bg-brand/90 transition-colors">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === "error" && (
                <div className="flex items-start gap-2.5 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700 border border-red-100">
                  <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
                  <span>{message}</span>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition-all focus:border-brand focus:ring-1 focus:ring-brand shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition-all focus:border-brand focus:ring-1 focus:ring-brand shadow-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 shadow-md mt-2 text-sm font-bold"
              >
                {status === "loading" ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
