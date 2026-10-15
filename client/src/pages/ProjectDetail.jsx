import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiGithub as Github, FiExternalLink as ExternalLink, FiUsers as Users, FiArrowRight as ArrowRight, FiEdit2 as Edit2, FiTrash2 as Trash2, FiTag as Tag, FiClock as Clock, FiX as CloseX, FiCheck as CheckIcon, FiSend as SendIcon } from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import RoadmapTracker from "../components/roadmap/RoadmapTracker";
import useRecentAccess from "../hooks/useRecentAccess";

const statusStyles = { pending: "bg-slate-text/10 text-slate-text", in_progress: "bg-brass/10 text-brass-dark", completed: "bg-sage/10 text-sage" };

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [workspaceId, setWorkspaceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useRecentAccess(
    project ? "project" : null,
    project?._id,
    project?.title,
    project ? `/projects/${project._id}` : null
  );

  // Edit Project State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", technologies: "", githubLink: "", projectLink: "" });
  const [savingEdit, setSavingEdit] = useState(false);

  // Mentor Request State
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [mentorResults, setMentorResults] = useState([]);
  const [mentorSearch, setMentorSearch] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState("60");
  const [requestError, setRequestError] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.project);
      setMembers(data.members || []);
      setWorkspaceId(data.workspaceId);
      if (data.hasPendingMentorRequest) {
        setRequestSent(true);
      }
      setEditForm({
        title: data.project.title || "",
        description: data.project.description || "",
        technologies: (data.project.technologies || []).join(", "),
        githubLink: data.project.githubLink || "",
        projectLink: data.project.projectLink || "",
      });
    } catch (err) {
      console.error(err);
      setLoadError(err.response?.data?.message || "Failed to load project details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const searchMentors = async (query) => {
    setMentorSearch(query);
    try {
      const { data } = await api.get(`/mentorship/providers?search=${encodeURIComponent(query)}`);
      setMentorResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendRequest = async (e) => {
    e.preventDefault();
    setRequestError("");
    setSendingRequest(true);
    try {
      await api.post("/mentorship/request", { 
        projectId: id, 
        mentorId: selectedMentor._id, 
        goals: message || "Mentorship and guidance for project",
        message: message || "",
        requestedDuration: Number(duration) || 30
      });
      setRequestSent(true);
      setShowMentorForm(false);
    } catch (err) {
      setRequestError(err.response?.data?.message || "Couldn't send mentor request");
    } finally {
      setSendingRequest(false);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const { data } = await api.put(`/projects/${id}`, {
        title: editForm.title,
        description: editForm.description,
        technologies: editForm.technologies.split(",").map(t => t.trim()).filter(Boolean),
        githubLink: editForm.githubLink,
        projectLink: editForm.projectLink,
      });
      setProject(data.project);
      setShowEditModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update project");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    try {
      await api.delete(`/projects/${id}`);
      navigate("/mentorship");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete project");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <span className="ml-3 text-sm text-slate-500 font-medium">Loading project details...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (loadError || !project) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-xl border border-red-200 text-center">
          <p className="text-red-600 font-bold mb-2">Error</p>
          <p className="text-sm text-slate-600 mb-4">{loadError || "Project not found"}</p>
          <Link to="/mentorship" className="inline-block px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90">
            Back to Projects & Mentorship
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isLeader = project.leader?._id === user?._id;

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] space-y-6 pb-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link to="/mentorship" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
            &larr; Back to Projects
          </Link>
          {isLeader && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowEditModal(true)} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Edit2 size={13} /> Edit Project
              </button>
              <button 
                onClick={handleDeleteProject} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
              >
                <Trash2 size={13} /> Delete Project
              </button>
            </div>
          )}
        </div>

        {/* Project Header Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={`inline-block mb-2 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statusStyles[project.status]}`}>
                {project.status.replace("_", " ")}
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">{project.title}</h1>
              <p className="mt-1 text-sm text-slate-500">
                Created by <Link to={`/profile/${project.leader?._id}`} className="font-semibold text-ink hover:underline">{project.leader?.name}</Link>
              </p>
            </div>
          </div>

          {project.description && (
            <p className="mt-4 text-sm text-slate-700 leading-relaxed max-w-3xl whitespace-pre-line">{project.description}</p>
          )}

          {project.technologies?.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Tag size={13} /> Technologies / Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="rounded-lg bg-teal-50 text-teal-800 border border-teal-100 px-3 py-1 text-xs font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-sm">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-600 hover:text-ink font-medium">
                <Github size={16} /> Source Code
              </a>
            )}
            {project.projectLink && (
              <a href={project.projectLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline font-medium">
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Mentor Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              Mentorship
            </h2>
          </div>

          {project.mentor ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold overflow-hidden border border-teal-200 shrink-0">
                  {project.mentor.profilePhoto ? <img src={project.mentor.profilePhoto} alt={project.mentor.name} className="w-full h-full object-cover" /> : project.mentor.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">{project.mentor.name}</p>
                  <p className="text-xs capitalize text-slate-500 font-medium">
                    {project.mentor.designation || project.mentor.currentRole || project.mentor.role}
                  </p>
                </div>
              </div>
              {workspaceId && (
                <Link to={`/mentorship/${workspaceId}`} className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover transition-colors shadow-sm">
                  Open Workspace <ArrowRight size={15} />
                </Link>
              )}
            </div>
          ) : isLeader ? (
            <div className="mt-2">
              {requestSent ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium flex items-center gap-2">
                  <Clock size={16} className="text-amber-600 shrink-0" />
                  Mentor request sent — waiting for mentor response.
                </div>
              ) : !showMentorForm ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-ink">Need expert guidance?</p>
                    <p className="text-xs text-slate-500 mt-0.5">Request a faculty member or verified alumni as a mentor for this project.</p>
                  </div>
                  <button onClick={() => {
                    setShowMentorForm(true);
                    if (mentorResults.length === 0) searchMentors("");
                  }} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-sm shrink-0">
                    Request a Mentor
                  </button>
                </div>
              ) : (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-ink">Select a Mentor</h3>
                    <button onClick={() => { setShowMentorForm(false); setSelectedMentor(null); }} className="text-xs font-semibold text-slate-500 hover:text-ink">
                      Cancel
                    </button>
                  </div>
                  
                  {!selectedMentor ? (
                    <>
                      <input 
                        value={mentorSearch} 
                        onChange={(e) => searchMentors(e.target.value)} 
                        placeholder="Search mentors by name, role, skill..." 
                        className="w-full mb-4 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary" 
                      />
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-80 overflow-y-auto pr-1">
                        {mentorResults.map(m => (
                          <div key={m._id} className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden text-slate-500 font-bold">
                                {m.profilePhoto ? <img src={m.profilePhoto} alt={m.name} className="w-full h-full object-cover" /> : m.name[0]}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-ink leading-tight">{m.name}</p>
                                <p className="text-[10px] text-primary font-bold uppercase">{m.role}</p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                              {m.designation || m.currentRole || (m.role === 'teacher' ? 'Faculty' : 'Alumni Mentor')}
                            </p>
                            <button 
                              onClick={() => setSelectedMentor(m)} 
                              className="w-full rounded-lg bg-primary text-white py-2 text-xs font-bold hover:bg-primary-hover transition-colors shadow-sm"
                            >
                              Choose {m.name}
                            </button>
                          </div>
                        ))}
                        {mentorResults.length === 0 && <p className="text-sm text-slate-500 col-span-full py-4 text-center">No available mentors found.</p>}
                      </div>
                    </>
                  ) : (
                    <form onSubmit={sendRequest} className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Selected Mentor</p>
                          <p className="text-base font-bold text-ink">{selectedMentor.name}</p>
                        </div>
                        <button type="button" onClick={() => setSelectedMentor(null)} className="text-xs font-semibold text-primary hover:underline">
                          Change
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Goals & Focus</label>
                        <textarea 
                          required 
                          value={message} 
                          onChange={(e) => setMessage(e.target.value)} 
                          placeholder="What specific guidance or goals do you need from this mentor?" 
                          rows={3} 
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary bg-white" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mentorship Duration</label>
                        <select 
                          value={duration} 
                          onChange={(e) => setDuration(e.target.value)} 
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                        >
                          <option value="30">30 Days (1 Month)</option>
                          <option value="60">60 Days (2 Months)</option>
                          <option value="90">90 Days (3 Months)</option>
                          <option value="180">180 Days (6 Months)</option>
                        </select>
                      </div>

                      {requestError && <p className="text-sm text-red-600 font-medium">{requestError}</p>}
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => { setShowMentorForm(false); setSelectedMentor(null); }} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors">
                          Cancel
                        </button>
                        <button type="submit" disabled={sendingRequest} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-sm disabled:opacity-60">
                          <SendIcon size={14} /> {sendingRequest ? "Sending..." : "Submit Mentor Request"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No mentor assigned yet.</p>
          )}
        </div>

        {/* Team Members */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 flex items-center gap-2 text-base font-bold text-ink">
            <Users size={18} className="text-teal-600" /> Team Members ({members.length})
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <div key={m._id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  {m.user?.profilePhoto ? <img src={m.user.profilePhoto} alt={m.user.name} className="w-full h-full object-cover rounded-full" /> : m.user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{m.user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{m.roleInProject || "Member"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap Tracker Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-ink mb-4">Project Roadmap</h2>
          <RoadmapTracker entityType="Project" entityId={id} />
        </div>
      </div>

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-ink text-lg">Edit Project</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <CloseX size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Project Title *</label>
                <input 
                  required 
                  value={editForm.title} 
                  onChange={e => setEditForm({...editForm, title: e.target.value})} 
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Description</label>
                <textarea 
                  rows={3} 
                  value={editForm.description} 
                  onChange={e => setEditForm({...editForm, description: e.target.value})} 
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Technologies / Tags (comma separated)</label>
                <input 
                  value={editForm.technologies} 
                  onChange={e => setEditForm({...editForm, technologies: e.target.value})} 
                  placeholder="React, Node.js, MongoDB" 
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">GitHub Repo</label>
                  <input 
                    value={editForm.githubLink} 
                    onChange={e => setEditForm({...editForm, githubLink: e.target.value})} 
                    placeholder="https://github.com/..." 
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Live Demo URL</label>
                  <input 
                    value={editForm.projectLink} 
                    onChange={e => setEditForm({...editForm, projectLink: e.target.value})} 
                    placeholder="https://..." 
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={savingEdit} className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl disabled:opacity-60 shadow-sm">
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProjectDetail;
