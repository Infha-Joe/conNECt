import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiBookOpen, FiUsers, FiCopy, FiCheck, FiLogIn, FiArrowRight, FiX, FiAlertTriangle } from "react-icons/fi";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

/* ── tiny toast ── */
const Toast = ({ msg, ok }) => (
  <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-xl px-5 py-3 shadow-xl text-white text-sm font-semibold transition-all ${ok ? "bg-emerald-600" : "bg-red-600"}`}>
    {ok ? <FiCheck size={16} /> : <FiAlertTriangle size={16} />} {msg}
  </div>
);

/* ── invite-code chip with copy ── */
const CodeChip = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5">
      <span className="font-mono font-bold text-sm text-slate-700 tracking-widest">{code}</span>
      <button onClick={copy} title="Copy code" className="text-slate-500 hover:text-brand transition-colors">
        {copied ? <FiCheck size={14} className="text-emerald-600" /> : <FiCopy size={14} />}
      </button>
      {copied && <span className="text-xs text-emerald-600 font-medium">Copied!</span>}
    </div>
  );
};

const AcademicDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* modal state */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  /* form state */
  const [formData, setFormData] = useState({ name: "", subject: "", section: "", semester: "", description: "" });
  const [joinCode, setJoinCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  /* toast */
  const [toast, setToast] = useState(null);
  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const isTeacherRole = ["teacher", "faculty", "admin"].includes(user?.role?.toLowerCase());

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/classrooms");
      setClasses(res.data.classes || []);
    } catch (err) {
      showToast("Failed to load classes", false);
    } finally {
      setLoading(false);
    }
  };

  /* â”€â”€ CREATE â”€â”€ */
  const openCreate = () => { setFormData({ name: "", subject: "", section: "", semester: "", description: "" }); setFormError(""); setShowCreateModal(true); };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setFormError("Class Name is required"); return; }
    setSubmitting(true); setFormError("");
    try {
      const res = await api.post("/classrooms", formData);
      setClasses(prev => [res.data.class, ...prev]);
      setShowCreateModal(false);
      showToast(`Class "${res.data.class.name}" created! Invite code: ${res.data.class.inviteCode}`);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create class");
    } finally {
      setSubmitting(false);
    }
  };

  /* â”€â”€ JOIN â”€â”€ */
  const openJoin = () => { setJoinCode(""); setFormError(""); setShowJoinModal(true); };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) { setFormError("Enter the class invite code"); return; }
    setSubmitting(true); setFormError("");
    try {
      const res = await api.post("/classrooms/join", { code: joinCode.trim().toUpperCase() });
      setShowJoinModal(false);
      showToast(res.data.message || "Join request sent! Wait for the teacher to accept.");
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to join class");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-8 pb-16">

        {/* â”€â”€ Header â”€â”€ */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Academics</h1>
            <p className="mt-1 text-sm text-slate-500">
              {isTeacherRole ? "Create and manage your class workspaces." : "Your enrolled classes and academic records."}
            </p>
          </div>
          <div className="flex gap-3">
            {isTeacherRole ? (
              <button
                id="btn-create-class"
                onClick={openCreate}
                className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 font-semibold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
                style={{ backgroundColor: "var(--color-brand, #0d9488)" }}
              >
                <FiPlus size={18} /> Create Class
              </button>
            ) : (
              <button
                id="btn-join-class"
                onClick={openJoin}
                className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 font-semibold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
                style={{ backgroundColor: "var(--color-brand, #0d9488)" }}
              >
                <FiLogIn size={18} /> Join Class
              </button>
            )}
          </div>
        </div>

        {/* ── My Classes ── */}
        <section>
          <h2 className="text-lg font-bold text-ink mb-4">My Classes</h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            </div>
          ) : classes.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
              <FiBookOpen className="mx-auto mb-4 text-slate-300" size={48} />
              <p className="font-bold text-ink text-lg">No classes yet</p>
              <p className="mt-1 text-sm text-slate-500">
                {isTeacherRole ? 'Click "Create Class" to get started.' : "Ask your teacher for the class invite code."}
              </p>
              {isTeacherRole && (
                <button onClick={openCreate} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 font-semibold text-white shadow hover:opacity-90 transition-all" style={{ backgroundColor: "var(--color-brand, #0d9488)" }}>
                  <FiPlus size={18} /> Create Your First Class
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map((c) => (
                <div key={c._id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col shadow-sm hover:shadow-md hover:border-brand/30 transition-all">
                  {/* Subject badge */}
                  <span className="inline-block mb-3 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 border border-teal-100 uppercase tracking-wide self-start">
                    {c.subject || "General"}
                  </span>

                  <h3 className="text-lg font-bold text-ink mb-1 leading-tight">{c.name}</h3>

                  {(c.section || c.semester) && (
                    <p className="text-xs text-slate-500 font-medium mb-2">
                      {c.section && `Section ${c.section}`}{c.section && c.semester && " · "}{c.semester && `Sem ${c.semester}`}
                    </p>
                  )}

                  {c.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{c.description}</p>
                  )}

                  {/* Invite code row */}
                  {isTeacherRole && c.inviteCode && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invite Code</p>
                      <CodeChip code={c.inviteCode} />
                    </div>
                  )}

                  <div className="mt-auto pt-3">
                    <Link
                      to={`/academic/classes/${c._id}`}
                      className="inline-flex items-center justify-center gap-1.5 w-full text-center rounded-xl py-2.5 font-bold text-sm text-white transition-all hover:opacity-90 shadow-sm"
                      style={{ backgroundColor: "var(--color-brand, #0d9488)" }}
                    >
                      Open Class <FiArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── CREATE CLASS MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-ink text-xl">Create Class</h3>
              <button onClick={() => setShowCreateModal(false)} className="h-8 w-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Class Name *</label>
                <input
                  id="create-class-name"
                  required
                  placeholder="e.g. Data Structures"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Subject Code</label>
                <input
                  id="create-class-subject"
                  placeholder="e.g. CS301"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Section</label>
                  <input
                    id="create-class-section"
                    placeholder="e.g. A"
                    value={formData.section}
                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Semester</label>
                  <input
                    id="create-class-semester"
                    placeholder="e.g. 6"
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Description</label>
                <textarea
                  id="create-class-desc"
                  rows={3}
                  placeholder="Brief description of this class..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                />
              </div>

              {formError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm font-medium">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                  style={{ backgroundColor: "var(--color-brand, #0d9488)" }}
                >
                  {submitting ? "Creating..." : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── JOIN CLASS MODAL ── */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-ink text-xl">Join a Class</h3>
              <button onClick={() => setShowJoinModal(false)} className="h-8 w-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleJoin} className="p-6 space-y-4">
              <p className="text-sm text-slate-500">Enter the 6-character invite code given by your teacher.</p>
              <input
                id="join-class-code"
                required
                placeholder="e.g. D63CF4"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center font-mono text-xl font-bold tracking-[0.3em] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all uppercase"
              />
              {formError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm font-medium text-center">
                  {formError}
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowJoinModal(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                  style={{ backgroundColor: "var(--color-brand, #0d9488)" }}
                >
                  {submitting ? "Sending..." : "Request to Join"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </DashboardLayout>
  );
};

export default AcademicDashboard;

