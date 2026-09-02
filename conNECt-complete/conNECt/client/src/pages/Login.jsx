import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NetworkConstellation from "../components/NetworkConstellation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink px-12 py-10 text-parchment md:flex">
        <div>
          <p className="font-display text-2xl tracking-tight">
            con<span className="text-brass">NEC</span>t
          </p>
          <p className="mt-1 text-sm text-parchment/60">NEC's professional network</p>
        </div>
        <div className="flex-1 py-8">
          <NetworkConstellation />
        </div>
        <blockquote className="max-w-sm font-display text-lg leading-snug text-parchment/90">
          "Every project, mentor and milestone — one connected campus."
        </blockquote>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <p className="font-display text-2xl tracking-tight text-ink">
              con<span className="text-brass">NEC</span>t
            </p>
          </div>

          <h1 className="font-display text-3xl font-medium text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-text">Sign in with your college email to continue.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@nec.edu"
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">Password</label>
              <input
                id="password" type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20"
              />
            </div>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button
              type="submit" disabled={submitting}
              className="w-full rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-parchment transition hover:bg-ink-light disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-text">
            New to conNECt?{" "}
            <Link to="/register" className="font-medium text-brass-dark hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
