import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import NetworkConstellation from "../components/NetworkConstellation";

const ROLES = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "alumni", label: "Alumni" },
];

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", collegeId: "", department: "", year: "" });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/departments").then(({ data }) => setDepartments(data.departments)).catch(() => setDepartments([]));
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.year) delete payload.year;
      if (!payload.department) delete payload.department;
      await register(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
        <p className="max-w-sm text-sm text-parchment/70">
          Students, teachers and alumni — connected through posts, projects and mentorship.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <p className="font-display text-2xl tracking-tight text-ink">
              con<span className="text-brass">NEC</span>t
            </p>
          </div>

          <h1 className="font-display text-3xl font-medium text-ink">Create your account</h1>
          <p className="mt-2 text-sm text-slate-text">Join the NEC community network.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value} type="button"
                  onClick={() => setForm((prev) => ({ ...prev, role: r.value }))}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    form.role === r.value ? "border-brass bg-brass/10 text-ink" : "border-ink/15 text-slate-text hover:border-ink/30"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Full name</label>
              <input name="name" required value={form.name} onChange={handleChange} placeholder="Ada Lovelace"
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@nec.edu"
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
              <input type="password" name="password" required minLength={8} value={form.password} onChange={handleChange} placeholder="At least 8 characters"
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">College ID</label>
                <input name="collegeId" value={form.collegeId} onChange={handleChange} placeholder="NEC2026CS041"
                  className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" />
              </div>
              {form.role === "student" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Year</label>
                  <input type="number" name="year" min={1} max={5} value={form.year} onChange={handleChange} placeholder="2"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20" />
                </div>
              )}
            </div>

            {departments.length > 0 && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Department</label>
                <select name="department" value={form.department} onChange={handleChange}
                  className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20">
                  <option value="">Select department</option>
                  {departments.map((d) => (<option key={d._id} value={d._id}>{d.name}</option>))}
                </select>
              </div>
            )}

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button type="submit" disabled={submitting}
              className="w-full rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-parchment transition hover:bg-ink-light disabled:opacity-60">
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-text">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-brass-dark hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
