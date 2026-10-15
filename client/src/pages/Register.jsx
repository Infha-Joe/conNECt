/* =========================================================================
 * ❄️ AUTHENTICATION IS FROZEN ❄️
 * Do not modify authentication files or password/JWT/email-verification logic 
 * while implementing unrelated features.
 * Reuse the existing auth system.
 * ========================================================================= */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import api from "../services/api";

const ROLES = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Faculty" },
  { value: "alumni", label: "Alumni" },
];

const Register = () => {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    collegeId: "",
    department: "",
    year: "",
    designation: "",
    batch: "",
    currentCompany: "",
    currentRole: "",
    degree: ""
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/departments")
      .then(({ data }) => setDepartments(data.departments))
      .catch((err) => { console.error("Failed to load departments:", err); setDepartments([]); });
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { 
        accountType: role === "alumni" ? "alumni_new" : role,
        name: form.name, 
        email: form.email, 
        password: form.password, 
        role 
      };

      const selectedDept = departments.find(d => d._id === form.department);
      const mappedDepartment = selectedDept ? selectedDept.code : form.department;

      if (role === "student") {
        payload.collegeId = form.collegeId;
        payload.year = form.year;
        payload.department = mappedDepartment;
      } else if (role === "teacher") {
        payload.designation = form.designation;
        payload.facultyId = form.designation; // Map designation to facultyId to satisfy backend
        payload.department = mappedDepartment;
      } else if (role === "alumni") {
        payload.batch = form.batch;
        // Extract graduationYear from batch string (e.g. 2020-2024 -> 2024)
        const batchParts = form.batch.split("-");
        payload.graduationYear = batchParts.length > 1 ? parseInt(batchParts[1].trim()) : parseInt(form.batch.trim());
        payload.department = mappedDepartment;
        payload.degree = form.degree;
        payload.currentCompany = form.currentCompany;
        payload.currentRole = form.currentRole;
      }

      const res = await register(payload);
      setSuccessMessage(res?.data?.message || "Registration successful! Please check your email to verify your account.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles = "w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm text-primary-dark outline-none transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary placeholder:text-border/80 font-medium shadow-sm";
  const labelStyles = "mb-1.5 block text-xs font-bold text-primary-dark uppercase tracking-wider";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative font-sans p-4 py-12">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-light/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="w-full max-w-lg p-8 sm:p-10 shadow-[0_20px_50px_-12px_rgba(23,59,58,0.15)] border border-border bg-surface rounded-2xl relative z-10">
        <div className="mb-10 text-center">
          <p className="font-display text-3xl font-bold tracking-tight text-primary-dark">
            con<span className="text-primary">NEC</span>t
          </p>
          <h1 className="mt-4 font-body text-2xl font-bold text-primary-dark">Join the network</h1>
          <p className="mt-1 text-sm text-primary-dark-light">Create your professional profile</p>
        </div>

        
        {successMessage ? (
          <Card className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <Link to="/login" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
              Back to Login
            </Link>
          </Card>
        ) : (
          <Card className="p-8">

          <div className="mb-8 flex space-x-1 rounded-lg bg-background p-1 border border-border">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => handleRoleChange(r.value)}
                className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all ${
                  role === r.value
                    ? "bg-white text-primary-dark shadow-sm ring-1 ring-slate-200"
                    : "text-primary-dark-light hover:text-primary-dark hover:bg-background"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-5">
              <div>
                <label className={labelStyles}>Full Name</label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className={labelStyles}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@nec.edu.in"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className={labelStyles}>Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className={inputStyles}
                />
              </div>
            </div>

            <hr className="border-border my-6" />

            <div className="space-y-5">
              {role === "student" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyles}>College ID</label>
                      <input
                        name="collegeId"
                        required
                        value={form.collegeId}
                        onChange={handleChange}
                        placeholder="NEC2026CS041"
                        className={inputStyles}
                      />
                    </div>
                    <div>
                      <label className={labelStyles}>Year</label>
                      <select
                        name="year"
                        required
                        value={form.year}
                        onChange={handleChange}
                        className={inputStyles}
                      >
                        <option value="">Select Year</option>
                        <option value="1">First Year</option>
                        <option value="2">Second Year</option>
                        <option value="3">Third Year</option>
                        <option value="4">Fourth Year</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelStyles}>Department</label>
                    <select
                      name="department"
                      required
                      value={form.department}
                      onChange={handleChange}
                      className={inputStyles}
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {role === "teacher" && (
                <>
                  <div>
                    <label className={labelStyles}>Designation</label>
                    <input
                      name="designation"
                      required
                      value={form.designation}
                      onChange={handleChange}
                      placeholder="e.g. Associate Professor"
                      className={inputStyles}
                    />
                  </div>
                  <div>
                    <label className={labelStyles}>Department</label>
                    <select
                      name="department"
                      required
                      value={form.department}
                      onChange={handleChange}
                      className={inputStyles}
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {role === "alumni" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyles}>Batch</label>
                      <input
                        type="text"
                        name="batch"
                        required
                        value={form.batch}
                        onChange={handleChange}
                        placeholder="e.g. 2023-2027"
                        className={inputStyles}
                      />
                    </div>
                    <div>
                      <label className={labelStyles}>Degree / Course</label>
                      <input
                        name="degree"
                        required
                        value={form.degree}
                        onChange={handleChange}
                        placeholder="e.g. B.Tech"
                        className={inputStyles}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelStyles}>Completed Department</label>
                    <select
                      name="department"
                      required
                      value={form.department}
                      onChange={handleChange}
                      className={inputStyles}
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyles}>Current Company</label>
                      <input
                        name="currentCompany"
                        value={form.currentCompany}
                        onChange={handleChange}
                        placeholder="e.g. Google"
                        className={inputStyles}
                      />
                    </div>
                    <div>
                      <label className={labelStyles}>Current Role</label>
                      <input
                        name="currentRole"
                        value={form.currentRole}
                        onChange={handleChange}
                        placeholder="e.g. Software Engineer"
                        className={inputStyles}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full py-3"
            >
              {submitting ? "Creating account…" : "Join conNECt"}
            </Button>
                    </form>
        </Card>
        )}
        
        {!successMessage && (
          <p className="mt-8 text-center text-sm font-medium text-primary-dark-light">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
