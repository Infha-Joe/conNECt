/* =========================================================================
 * ❄️ AUTHENTICATION IS FROZEN ❄️
 * Do not modify authentication files or password/JWT/email-verification logic 
 * while implementing unrelated features.
 * Reuse the existing auth system.
 * ========================================================================= */

﻿import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { GoogleLogin } from '@react-oauth/google';
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";

const ROLES = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Faculty" },
  { value: "alumni", label: "Alumni" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleWidth, setGoogleWidth] = useState(0);
  const containerRef = useRef(null);

  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [googleData, setGoogleData] = useState(null);
  const [manualUserId, setManualUserId] = useState(null);
  
  const [collegeId, setCollegeId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [year, setYear] = useState("1");
  const [graduationYear, setGraduationYear] = useState(new Date().getFullYear().toString());
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [role, setRole] = useState("student");

  const navigate = useNavigate();
  const { login, googleLogin, completeRegistration } = useAuth();

  useEffect(() => {
    api
      .get("/departments")
      .then(({ data }) => setDepartments(data.departments || []))
      .catch((err) => {
        console.error("Failed to load departments:", err);
      });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setGoogleWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setGoogleWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await login(email, password);
      if (data?.isNewUser) {
        setNeedsRegistration(true);
        setGoogleData(data.googleData || { email, name: "" });
        setManualUserId(data.manualUserId);
        if (data.googleData?.role) setRole(data.googleData.role);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || (err.message === "Network Error" ? "Network error: Cannot reach server." : "Server error or invalid credentials."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setSubmitting(true);
    try {
      const data = await googleLogin(credentialResponse.credential);
      if (data?.isNewUser) {
        setNeedsRegistration(true);
        setGoogleData(data.googleData);
        setManualUserId(data.manualUserId || null);
        if (data.googleData?.role) setRole(data.googleData.role);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Login Failed");
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError("");
    
    const targetEmail = (googleData?.email || email || "").trim().toLowerCase();
    if (role === "student" && !targetEmail.endsWith("@nec.edu.in")) {
      setError("Students must use a valid NEC domain email (@nec.edu.in)");
      return;
    }
    if (role === "teacher" && !targetEmail.endsWith("@nec.edu.in")) {
      setError("Faculty must use a valid NEC domain email (@nec.edu.in)");
      return;
    }
    setSubmitting(true);
    try {
      const selectedDept = departments.find(d => d._id === department || d.code === department);
      const deptCode = selectedDept ? selectedDept.code : department;

      await completeRegistration({
        manualUserId,
        email: targetEmail,
        name: googleData?.name || "",
        googleId: googleData?.googleId || null,
        picture: googleData?.picture || "",
        accountType: role === "alumni" ? "alumni_new" : role,
        collegeId: role === "student" ? collegeId.trim() : undefined,
        facultyId: role === "teacher" ? facultyId.trim() : undefined,
        graduationYear: role === "alumni" ? Number(graduationYear) : undefined,
        department: deptCode || undefined,
        year: role === "student" ? Number(year) : undefined,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative font-sans p-4">
      {/* Subtle abstract background accent to match the landing page */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-light/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[420px]">
        <Card className="p-8 sm:p-10 shadow-[0_20px_50px_-12px_rgba(23,59,58,0.15)] border border-border bg-surface rounded-2xl">
          <div className="mb-8 text-center">
            <p className="font-display text-4xl font-bold tracking-tight text-primary-dark mb-1">
              con<span className="text-primary">NEC</span>t
            </p>
            <p className="text-[11px] font-bold text-ink-light uppercase tracking-[0.15em]">
              National Engineering College
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-lg bg-danger/10 p-3.5 text-sm font-medium text-danger border border-danger/20">
              <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}

          {!needsRegistration ? (
            <div className="space-y-6">
              <div className="flex space-x-1 rounded-lg bg-background p-1 border border-border">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => {
                      setRole(r.value);
                      setError("");
                    }}
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

              <form onSubmit={handleManualLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-bold text-primary-dark uppercase tracking-wider">
                    College ID / Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm text-primary-dark outline-none transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary placeholder:text-border/80 font-medium shadow-sm"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold text-primary-dark uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm text-primary-dark outline-none transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary placeholder:text-border/80 font-medium shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-light hover:text-primary transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full py-3.5 shadow-md text-[15px] tracking-wide uppercase"
                >
                  {submitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center mt-2">
                <Link to="/forgot-password" className="text-sm font-semibold text-ink-light hover:text-primary transition-colors">
                  Forgot Password?
                </Link>
              </div>
              
              <div className="flex items-center gap-3 py-2">
                <hr className="flex-1 border-border" />
                <span className="text-[11px] font-bold text-ink-light uppercase tracking-widest">OR</span>
                <hr className="flex-1 border-border" />
              </div>

              <div className="w-full" ref={containerRef}>
                <div className="flex justify-center w-full [&>div]:!w-full [&>div>div]:!w-full">
                  {googleWidth > 0 && (
                    <GoogleLogin 
                      onSuccess={handleGoogleSuccess} 
                      onError={handleGoogleError} 
                      theme="outline"
                      size="large"
                      text="continue_with"
                      width={googleWidth}
                    />
                  )}
                </div>
              </div>

              <div className="mt-8 text-center text-sm pt-4 border-t border-border">
                <span className="text-ink-light font-medium">New to conNECt? </span>
                <Link to="/register" className="font-bold text-primary hover:text-primary-dark transition-colors block mt-1 sm:inline sm:mt-0">
                  Create Account
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center pb-4 border-b border-border">
                <h2 className="text-xl font-bold text-primary-dark">Complete Setup</h2>
                <p className="text-sm text-ink-light mt-1">We just need a few more details.</p>
              </div>
              <form onSubmit={handleCompleteRegistration} className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-bold text-primary-dark uppercase tracking-wider">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm text-primary-dark outline-none transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary placeholder:text-border/80 font-medium shadow-sm"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Faculty</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>

                {departments.length > 0 && (
                  <div>
                    <label className="mb-2 block text-xs font-bold text-primary-dark uppercase tracking-wider">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm text-primary-dark outline-none transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary placeholder:text-border/80 font-medium shadow-sm"
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d.code}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {role === "student" && (
                  <>
                    <div>
                      <label className="mb-2 block text-xs font-bold text-primary-dark uppercase tracking-wider">
                        College ID (Roll Number)
                      </label>
                      <input
                        type="text"
                        required
                        value={collegeId}
                        onChange={(e) => setCollegeId(e.target.value)}
                        placeholder="e.g. 21BCE001"
                        className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm text-primary-dark outline-none transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary placeholder:text-border/80 font-medium shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-primary-dark uppercase tracking-wider">
                        Current Year
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm text-primary-dark outline-none transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary placeholder:text-border/80 font-medium shadow-sm"
                      >
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year (Final Year)</option>
                      </select>
                    </div>
                  </>
                )}

                {role === "teacher" && (
                  <div>
                    <label className="mb-2 block text-xs font-bold text-primary-dark uppercase tracking-wider">
                      Faculty ID
                    </label>
                    <input
                      type="text"
                      required
                      value={facultyId}
                      onChange={(e) => setFacultyId(e.target.value)}
                      placeholder="e.g. FAC001"
                      className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm text-primary-dark outline-none transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary placeholder:text-border/80 font-medium shadow-sm"
                    />
                  </div>
                )}

                {role === "alumni" && (
                  <div>
                    <label className="mb-2 block text-xs font-bold text-primary-dark uppercase tracking-wider">
                      Graduation Year
                    </label>
                    <input
                      type="number"
                      required
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm text-primary-dark outline-none transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary placeholder:text-border/80 font-medium shadow-sm"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full py-3.5 shadow-md text-[15px] tracking-wide uppercase"
                >
                  {submitting ? "Saving details..." : "Complete Registration"}
                </Button>
              </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Login;
