import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiX, 
  FiSearch, 
  FiFolder as FolderGit2, 
  FiPlus as Plus, 
  FiUser, 
  FiClock, 
  FiCalendar,
  FiCheck, 
  FiTag, 
  FiUsers, 
  FiArrowRight, 
  FiTrash2, 
  FiSend,
  FiBriefcase
} from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import Avatar from "../components/ui/Avatar";

const statusStyles = {
  pending: "bg-slate-100 text-slate-700 border-slate-200",
  in_progress: "bg-teal-50 text-teal-800 border-teal-200",
  completed: "bg-emerald-50 text-emerald-800 border-emerald-200"
};

/* ─────────────────────────────────────────────
   Request Mentor Modal
───────────────────────────────────────────── */
const RequestMentorModal = ({ mentor, userProjects, onClose, onSubmit }) => {
  const [projectId, setProjectId] = useState(userProjects.length > 0 ? userProjects[0]._id : "");
  const [goals, setGoals] = useState("");
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState("60");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const eligibleProjects = userProjects.filter(p => !p.mentor);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectId) {
      setErrorMsg("Please select an eligible project.");
      return;
    }
    setErrorMsg("");
    setSubmitting(true);
    try {
      await onSubmit({
        mentorId: mentor._id,
        projectId,
        goals: goals || "Guidance and technical mentorship",
        message: message || "",
        requestedDuration: Number(duration) || 30
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to send request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8 border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-ink text-lg">Request Mentorship</h3>
            <p className="text-xs text-slate-500 mt-0.5">from <span className="font-semibold text-teal-700">{mentor.name}</span> ({mentor.role})</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Select Project *</label>
            {eligibleProjects.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl">
                You do not have any eligible projects. Create a new project first to request this mentor.
              </div>
            ) : (
              <select 
                required 
                value={projectId} 
                onChange={e => setProjectId(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary bg-white"
              >
                <option value="">-- Choose a project --</option>
                {eligibleProjects.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            )}
          </div>

          {eligibleProjects.length > 0 && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Goals for this Mentorship *</label>
                <textarea 
                  required 
                  rows={2}
                  value={goals} 
                  onChange={e => setGoals(e.target.value)} 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary resize-none"
                  placeholder="e.g. Guidance on system architecture, database optimization, and deployment"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Message to Mentor (Optional)</label>
                <textarea 
                  rows={2}
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary resize-none"
                  placeholder="Introduce yourself and explain why you chose this mentor..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Requested Duration</label>
                <select 
                  value={duration} 
                  onChange={e => setDuration(e.target.value)} 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary bg-white"
                >
                  <option value="30">30 Days (1 Month)</option>
                  <option value="60">60 Days (2 Months)</option>
                  <option value="90">90 Days (3 Months)</option>
                  <option value="180">180 Days (6 Months)</option>
                </select>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-sm disabled:opacity-60">
                  <FiSend size={14} /> {submitting ? "Sending..." : "Send Request"}
                </button>
              </div>
            </>
          )}

          {eligibleProjects.length === 0 && (
            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors">
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Accept Mentor Request Modal
───────────────────────────────────────────── */
const AcceptMentorModal = ({ request, onClose, onSubmit }) => {
  const [duration, setDuration] = useState(request.requestedDuration || 30);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(request._id, Number(duration));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-ink text-lg">Accept Mentorship</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Project</p>
            <p className="text-sm font-bold text-ink mt-0.5">{request.project?.title || "Unknown Project"}</p>
            <p className="text-xs text-slate-500 mt-1">Requested by: <span className="font-semibold text-slate-700">{request.requester?.name}</span></p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Confirm Mentorship Duration (Days)</label>
            <input 
              type="number" 
              required
              min="1"
              value={duration} 
              onChange={e => setDuration(e.target.value)} 
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <p className="text-[11px] text-slate-400 mt-1">Student requested {request.requestedDuration} days. You can adjust this before accepting.</p>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm disabled:opacity-60">
              <FiCheck size={16} /> {submitting ? "Confirming..." : "Confirm & Open Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Component: MentorshipHub
───────────────────────────────────────────── */
const MentorshipHub = () => {
  const { user } = useAuth();
  
  // Projects State
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", technologies: "" });
  const [creatingProject, setCreatingProject] = useState(false);

  // Student Search (for project members)
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentSearchResults, setStudentSearchResults] = useState([]);

  // Mentorship State
  const [activeMentorships, setActiveMentorships] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loadingMentorships, setLoadingMentorships] = useState(true);

  // Modals state
  const [requestMentorTarget, setRequestMentorTarget] = useState(null);
  const [acceptRequestTarget, setAcceptRequestTarget] = useState(null);

  // Mentor Search State
  const [providerSearch, setProviderSearch] = useState("");
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // Fetch all initial data independently
  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await api.get("/projects", { params: { mine: true } });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadMentorshipData = async () => {
    setLoadingMentorships(true);
    try {
      const activePromise = api.get("/mentorship/active").then(r => setActiveMentorships(r.data || [])).catch(() => {});
      const incomingPromise = (user.role === "teacher" || user.role === "alumni") 
        ? api.get("/mentorship/requests/incoming").then(r => setIncomingRequests(r.data || [])).catch(() => {})
        : Promise.resolve();
      const outgoingPromise = (user.role === "student")
        ? api.get("/mentorship/requests/outgoing").then(r => setOutgoingRequests(r.data || [])).catch(() => {})
        : Promise.resolve();

      await Promise.all([activePromise, incomingPromise, outgoingPromise]);
    } finally {
      setLoadingMentorships(false);
    }
  };

  const loadProviders = async (q = "") => {
    setLoadingProviders(true);
    try {
      const res = await api.get(`/mentorship/providers?search=${encodeURIComponent(q)}`);
      setProviders(res.data || []);
    } catch (err) {
      console.error("Error loading mentors:", err);
    } finally {
      setLoadingProviders(false);
    }
  };

  useEffect(() => {
    loadProjects();
    loadMentorshipData();
    if (user.role === "student") {
      loadProviders("");
    }
  }, [user.role]);

  // Provider search debounce
  useEffect(() => {
    if (user.role === "student") {
      const timer = setTimeout(() => {
        loadProviders(providerSearch);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [providerSearch, user.role]);

  // Student tagging search debounce
  useEffect(() => {
    if (studentSearch.trim().length > 1) {
      const delaySearch = setTimeout(async () => {
        try {
          const res = await api.get(`/users/search?search=${encodeURIComponent(studentSearch)}`);
          const users = res.data.users || [];
          const students = users.filter(u => u.role === "student" && u._id !== user._id && !selectedStudents.some(s => s._id === u._id));
          setStudentSearchResults(students);
        } catch (err) {
          console.error(err);
        }
      }, 250);
      return () => clearTimeout(delaySearch);
    } else {
      setStudentSearchResults([]);
    }
  }, [studentSearch, selectedStudents, user._id]);

  const handleAddStudent = (student) => {
    setSelectedStudents(prev => [...prev, student]);
    setStudentSearch("");
    setStudentSearchResults([]);
  };

  const handleRemoveStudent = (studentId) => {
    setSelectedStudents(prev => prev.filter(s => s._id !== studentId));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setCreatingProject(true);
    try {
      const res = await api.post("/projects", { 
        title: form.title.trim(), 
        description: form.description.trim(), 
        technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
        members: selectedStudents.map(s => s._id)
      });
      // Append immediately to state
      if (res.data?.project) {
        setProjects(prev => [res.data.project, ...prev]);
      }
      setForm({ title: "", description: "", technologies: "" });
      setSelectedStudents([]);
      setShowCreate(false);
      // Reload projects to ensure full database sync
      loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating project");
    } finally {
      setCreatingProject(false);
    }
  };

  const handleDeleteProject = async (projectId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(prev => prev.filter(p => p._id !== projectId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete project");
    }
  };

  const handleRequestSubmit = async (requestData) => {
    const res = await api.post("/mentorship/request", requestData);
    if (res.data) {
      setOutgoingRequests(prev => [res.data, ...prev]);
    }
    setRequestMentorTarget(null);
    loadMentorshipData();
    loadProjects();
  };

  const handleAcceptSubmit = async (requestId, durationDays) => {
    try {
      await api.patch(`/mentorship/requests/${requestId}/accept`, { durationDays });
      setAcceptRequestTarget(null);
      loadMentorshipData();
      loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Error accepting request");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to decline this request?")) return;
    try {
      await api.patch(`/mentorship/requests/${id}/reject`);
      setIncomingRequests(prev => prev.filter(r => r._id !== id));
      loadMentorshipData();
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting request");
    }
  };

  const getProviderStatus = (providerId) => {
    const activeWorkspace = activeMentorships.find(m => (m.mentor?._id || m.mentor) === providerId && m.status === "active");
    if (activeWorkspace) return { status: "ACTIVE", workspaceId: activeWorkspace._id };

    const pendingReq = outgoingRequests.find(req => (req.mentor?._id || req.mentor) === providerId && req.status === "pending");
    if (pendingReq) return { status: "PENDING" };

    return null;
  };

  return (
    <DashboardLayout>
      {requestMentorTarget && (
        <RequestMentorModal 
          mentor={requestMentorTarget} 
          userProjects={projects}
          onClose={() => setRequestMentorTarget(null)} 
          onSubmit={handleRequestSubmit} 
        />
      )}

      {acceptRequestTarget && (
        <AcceptMentorModal 
          request={acceptRequestTarget} 
          onClose={() => setAcceptRequestTarget(null)} 
          onSubmit={handleAcceptSubmit} 
        />
      )}

      <div className="space-y-10 pb-16">
        
        {/* ══════════════════════════════════════════
            1. MY PROJECTS SECTION
        ══════════════════════════════════════════ */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">My Projects</h2>
              <p className="text-xs text-slate-500 mt-1">Build projects, collaborate with peers, and connect with mentors.</p>
            </div>
            {user?.role === "student" && (
              <button 
                onClick={() => setShowCreate(s => !s)} 
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all shrink-0"
              >
                <Plus size={16} /> {showCreate ? "Cancel" : "Create Project"}
              </button>
            )}
          </div>

          {/* Create Project Form */}
          {showCreate && (
            <form onSubmit={handleCreateProject} className="mb-8 space-y-4 rounded-2xl border border-teal-200 bg-teal-50/30 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-teal-100 pb-3">
                <h3 className="font-bold text-ink text-base">New Project</h3>
                <span className="text-xs text-slate-500">* Required fields</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Project Title *</label>
                <input 
                  required 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                  placeholder="e.g. Smart Campus Navigation App"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Description *</label>
                <textarea 
                  required 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  placeholder="Explain the problem statement, objectives, and what you are building..." 
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary resize-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Technologies / Tags (comma separated)</label>
                <input 
                  value={form.technologies} 
                  onChange={e => setForm({...form, technologies: e.target.value})} 
                  placeholder="React, Node.js, MongoDB, AI, IoT"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" 
                />
              </div>
              
              {/* Add Team Members */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Add Team Members (Optional)</label>
                <input 
                  value={studentSearch} 
                  onChange={e => setStudentSearch(e.target.value)} 
                  placeholder="Type student name to search..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" 
                />
                {studentSearchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-20">
                    {studentSearchResults.map(s => (
                      <div 
                        key={s._id} 
                        onClick={() => handleAddStudent(s)}
                        className="px-4 py-2.5 text-sm text-ink hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          {s.profilePhoto ? <img src={s.profilePhoto} alt={s.name} className="w-6 h-6 rounded-full object-cover" /> : <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">{s.name[0]}</div>}
                          <span className="font-semibold">{s.name}</span>
                        </div>
                        <span className="text-xs text-primary font-medium">Add</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedStudents.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedStudents.map(s => (
                    <div key={s._id} className="flex items-center gap-1.5 bg-white border border-teal-200 text-teal-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      <FiUser size={12} /> {s.name}
                      <button type="button" onClick={() => handleRemoveStudent(s._id)} className="ml-1 text-slate-400 hover:text-red-500">
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-teal-100">
                <button 
                  type="button" 
                  onClick={() => setShowCreate(false)} 
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={creatingProject} 
                  className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-white hover:bg-primary-hover transition-all shadow-sm disabled:opacity-60"
                >
                  {creatingProject ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          )}

          {/* Projects List */}
          {loadingProjects ? (
            <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              <span className="ml-3 text-sm text-slate-500 font-medium">Loading projects...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <FolderGit2 className="mx-auto mb-3 text-slate-300" size={40} />
              <p className="font-bold text-lg text-ink">No projects yet</p>
              <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                {user?.role === "student" ? "Create a project to start building and find a faculty or alumni mentor." : "Projects you mentor will show up here."}
              </p>
              {user?.role === "student" && (
                <button 
                  onClick={() => setShowCreate(true)} 
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover transition-colors"
                >
                  <Plus size={14} /> Create Your First Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => {
                const isOwner = (p.leader?._id || p.leader) === user._id;
                const workspace = activeMentorships.find(m => (m.project?._id || m.project) === p._id);

                return (
                  <div key={p._id} className="flex flex-col justify-between h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:border-brand/40 hover:shadow-md transition-all group">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                          <FolderGit2 size={20} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusStyles[p.status] || statusStyles.pending}`}>
                            {p.status?.replace("_", " ") || "PENDING"}
                          </span>
                          {isOwner && (
                            <button 
                              onClick={(e) => handleDeleteProject(p._id, e)} 
                              title="Delete Project" 
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      <Link to={`/projects/${p._id}`} className="group/link block">
                        <h3 className="font-bold text-ink text-base line-clamp-1 group-hover/link:text-primary transition-colors leading-snug">
                          {p.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed min-h-[36px]">
                          {p.description || "No description provided."}
                        </p>
                      </Link>

                      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 min-h-[26px]">
                        {p.technologies?.length > 0 ? (
                          <>
                            {p.technologies.slice(0, 3).map((tech) => (
                              <span key={tech} className="rounded-lg bg-slate-50 text-slate-600 px-2.5 py-0.5 text-[11px] font-medium border border-slate-200/60">
                                {tech}
                              </span>
                            ))}
                            {p.technologies.length > 3 && (
                              <span className="text-[10px] text-slate-400 font-semibold px-1 py-0.5">
                                +{p.technologies.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No tags specified</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mentor</p>
                        <p className="font-semibold text-ink truncate text-xs mt-0.5">
                          {p.mentor?.name ? p.mentor.name : "Not assigned"}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {workspace ? (
                          <Link 
                            to={`/mentorship/${workspace._id}`} 
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 text-xs font-bold hover:bg-teal-100 transition-colors shadow-2xs"
                          >
                            Workspace <FiArrowRight size={12} />
                          </Link>
                        ) : (
                          <Link 
                            to={`/projects/${p._id}`} 
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                          >
                            View <FiArrowRight size={12} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════
            2. FIND A MENTOR (STUDENTS ONLY)
        ══════════════════════════════════════════ */}
        {user.role === "student" && (
          <section className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">Find a Mentor</h2>
                <p className="text-slate-500 text-xs mt-1">Discover verified faculty and alumni to guide your project.</p>
              </div>
              
              <div className="relative w-full md:w-80 shrink-0">
                <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-2xs focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10 transition-all">
                  <FiSearch className="text-slate-400 shrink-0" size={16} />
                  <input 
                    type="text" 
                    value={providerSearch}
                    onChange={e => setProviderSearch(e.target.value)}
                    placeholder="Search mentors by name, skill..."
                    className="w-full pl-2.5 pr-1 text-xs outline-none bg-transparent text-ink placeholder:text-slate-400"
                  />
                  {providerSearch && (
                    <button onClick={() => setProviderSearch("")} className="text-slate-400 hover:text-slate-600 shrink-0 p-0.5">
                      <FiX size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {loadingProviders ? (
              <div className="py-12 text-center text-slate-400 text-xs">Searching mentors...</div>
            ) : providers.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm shadow-sm">
                No mentors found matching your search. Try another skill or keyword.
              </div>
            ) : (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {providers.map(p => {
                  const statusInfo = getProviderStatus(p._id);

                  return (
                    <div key={p._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full hover:shadow-md hover:border-brand/40 transition-all">
                      <div>
                        <div className="flex items-start gap-3.5 mb-3">
                          <Avatar 
                            src={p.profilePhoto} 
                            name={p.name} 
                            size="md" 
                            className="ring-2 ring-slate-100 shrink-0" 
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-ink text-sm leading-tight truncate">{p.name}</h3>
                            <span className="inline-block text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-100/80 px-2 py-0.5 rounded-full uppercase tracking-wider mt-1">
                              {p.role}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-slate-600 line-clamp-2 min-h-[34px] leading-relaxed font-medium mb-3">
                          {p.designation || p.currentRole || (p.department?.name ? `${p.department.name} Dept` : p.role === "teacher" ? "Faculty Member" : "Alumni Mentor")}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 min-h-[26px] mb-4">
                          {p.skills?.length > 0 ? (
                            p.skills.slice(0, 3).map((sk) => (
                              <span key={sk} className="text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-200/60 px-2 py-0.5 rounded-md">
                                {sk}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No skills listed</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-slate-100">
                        {statusInfo?.status === "ACTIVE" ? (
                          <Link 
                            to={`/mentorship/${statusInfo.workspaceId}`} 
                            className="w-full h-10 inline-flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs"
                          >
                            Active Workspace <FiArrowRight size={13} />
                          </Link>
                        ) : statusInfo?.status === "PENDING" ? (
                          <div className="w-full h-10 inline-flex items-center justify-center bg-amber-50 text-amber-800 text-xs font-bold rounded-xl border border-amber-200/80">
                            Request Pending
                          </div>
                        ) : (
                          <button 
                            onClick={() => setRequestMentorTarget(p)} 
                            className="w-full h-10 inline-flex items-center justify-center gap-1.5 bg-primary text-white hover:bg-primary-hover text-xs font-bold rounded-xl transition-all shadow-sm active:scale-[0.98]"
                          >
                            <FiSend size={13} /> Request Mentor
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════
            3. MY MENTOR REQUESTS (STUDENTS)
        ══════════════════════════════════════════ */}
        {user.role === "student" && (
          <section>
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">My Mentor Requests</h2>
              <p className="text-xs text-slate-500 mt-1">Track requests sent to faculty and alumni.</p>
            </div>

            {loadingMentorships ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">Loading requests...</div>
            ) : outgoingRequests.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-slate-500 text-sm shadow-sm text-center">
                You have no pending or past mentor requests.
              </div>
            ) : (
              <div className="space-y-3">
                {outgoingRequests.map(req => {
                  const activeM = activeMentorships.find(m => m.request === req._id || (m.project?._id || m.project) === (req.project?._id || req.project));

                  return (
                    <div key={req._id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-all">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200/70 px-2.5 py-0.5 rounded-full">
                            Project: {req.project?.title || "Project"}
                          </span>
                          <span className="text-slate-300 hidden sm:inline">&bull;</span>
                          <p className="font-bold text-ink text-sm">
                            Mentor: <span className="text-slate-700 font-semibold">{req.mentor?.name}</span>
                          </p>
                          <span className="text-xs text-slate-400">({req.requestedDuration} days)</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
                          <span className="font-semibold text-slate-700">Focus:</span> {req.goals}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                        <div className="w-24 text-center">
                          <span className={`inline-block w-full py-1 text-center text-xs font-bold rounded-full uppercase tracking-wider border ${
                            req.status === 'accepted' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            req.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="w-28 flex justify-end">
                          {req.status === "accepted" && activeM ? (
                            <Link 
                              to={`/mentorship/${activeM._id}`} 
                              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs"
                            >
                              Workspace <FiArrowRight size={12} />
                            </Link>
                          ) : (
                            <span className="w-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════
            INCOMING REQUESTS (MENTORS)
        ══════════════════════════════════════════ */}
        {(user.role === "teacher" || user.role === "alumni") && (
          <section>
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">Incoming Requests</h2>
              <p className="text-xs text-slate-500 mt-1">Mentorship requests from student project leaders.</p>
            </div>

            {loadingMentorships ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">Loading incoming requests...</div>
            ) : incomingRequests.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-slate-500 shadow-sm text-center">
                No pending mentor requests.
              </div>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map(req => (
                  <div key={req._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                    
                    <div className="mb-4 pl-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full">
                          Project Mentorship Request
                        </span>
                        <span className="text-xs text-slate-500 font-medium">Duration: {req.requestedDuration} days</span>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-lg font-bold text-ink">{req.project?.title || "Project"}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Requested by: <span className="font-semibold text-ink">{req.requester?.name}</span> {req.requester?.department?.name ? `(${req.requester.department.name})` : ""}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                        <p><span className="font-bold text-slate-600">Goals:</span> {req.goals}</p>
                        {req.message && <p><span className="font-bold text-slate-600">Message:</span> {req.message}</p>}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                      <button 
                        onClick={() => handleReject(req._id)} 
                        className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-xl hover:bg-slate-50 text-xs font-bold transition-colors"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => setAcceptRequestTarget(req)} 
                        className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover text-xs font-bold transition-colors shadow-sm"
                      >
                        <FiCheck size={14} /> Accept Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════
            4. ACTIVE MENTORSHIP WORKSPACES
        ══════════════════════════════════════════ */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">Active Mentorship Workspaces</h2>
            <p className="text-xs text-slate-500 mt-1">Collaborate in real-time with your mentor and team.</p>
          </div>

          {loadingMentorships ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">Loading workspaces...</div>
          ) : activeMentorships.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-slate-500 shadow-sm text-center">
              <FiBriefcase className="mx-auto mb-2 text-slate-300" size={36} />
              <p className="font-semibold text-ink text-sm">You have no active workspaces.</p>
              <p className="text-xs text-slate-400 mt-0.5">Once a mentor request is accepted, a shared workspace will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {activeMentorships.map(m => {
                const isActive = m.status === 'active';
                const isCompleted = m.status === 'completed';
                
                return (
                  <div key={m._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full relative overflow-hidden group hover:border-brand/40 hover:shadow-md transition-all">
                    <div className={`absolute top-0 left-0 w-full h-1 ${
                      isActive ? 'bg-teal-500' : 
                      isCompleted ? 'bg-slate-300' : 
                      'bg-red-400'
                    }`} />

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Workspace
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                          isActive ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 
                          isCompleted ? 'bg-slate-50 text-slate-600 border-slate-200' : 
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold text-ink mb-1 line-clamp-1 leading-snug">
                        {m.project?.title || "Project Workspace"}
                      </h3>
                      
                      <p className="text-xs font-semibold text-slate-600 mb-3.5 truncate">
                        {user.role === "student" ? `Mentor: ${m.mentor?.name || "Assigned Mentor"}` : `Mentee: ${m.mentee?.name || "Student Leader"}`}
                      </p>
                      
                      <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs text-slate-600 space-y-1.5 mb-5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <FiClock size={13} className="text-slate-400" /> Duration
                          </span>
                          <span className="font-bold text-slate-800">{m.durationDays} days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <FiCalendar size={13} className="text-slate-400" /> Ends
                          </span>
                          <span className="font-semibold text-slate-700">
                            {new Date(m.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100">
                      <Link 
                        to={`/mentorship/${m._id}`} 
                        className="w-full h-10 inline-flex justify-center items-center gap-1.5 px-4 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-all shadow-sm active:scale-[0.98]"
                      >
                        Open Workspace <FiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </DashboardLayout>
  );
};

export default MentorshipHub;
