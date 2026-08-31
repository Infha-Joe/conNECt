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
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/departments")
      .then(({ data }) => setDepartments(data.departments))
      .catch(() => setDepartments([]));
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
        name: form.name, 
        email: form.email, 
        password: form.password, 
        role 
      };

      if (role === "student") {
        payload.collegeId = form.collegeId;
        payload.year = form.year;
        payload.department = form.department;
      } else if (role === "teacher") {
        payload.designation = form.designation;
        payload.department = form.department;
      } else if (role === "alumni") {
        payload.batch = form.batch;
        payload.department = form.department;
        payload.degree = form.degree;
        payload.currentCompany = form.currentCompany;
        payload.currentRole = form.currentRole;
      }

      await register(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles = "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition-all focus:border-brand focus:bg-white focus:ring-1 focus:ring-brand";
  const labelStyles = "mb-1.5 block text-sm font-semibold text-ink";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans py-12">
      <div className="w-full max-w-lg p-6">
        <div className="mb-10 text-center">
          <p className="font-display text-3xl font-bold tracking-tight text-ink">
            con<span className="text-brand">NEC</span>t
          </p>
          <h1 className="mt-4 font-body text-2xl font-bold text-ink">Join the network</h1>
          <p className="mt-1 text-sm text-slate-500">Create your professional profile</p>
        </div>

        <Card className="p-8">
          <div className="mb-8 flex space-x-1 rounded-lg bg-slate-50 p-1 border border-slate-200">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => handleRoleChange(r.value)}
                className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all ${
                  role === r.value
                    ? "bg-white text-ink shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-ink hover:bg-slate-100"
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

            <hr className="border-slate-200 my-6" />

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
              <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
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
        
        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-brand hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
