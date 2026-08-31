import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Github, ExternalLink, Users, ArrowRight } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

const statusStyles = { pending: "bg-slate-text/10 text-slate-text", in_progress: "bg-brass/10 text-brass-dark", completed: "bg-sage/10 text-sage" };

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [workspaceId, setWorkspaceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [mentorResults, setMentorResults] = useState([]);
  const [mentorSearch, setMentorSearch] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get(`/projects/${id}`);
    setProject(data.project);
    setMembers(data.members);
    setWorkspaceId(data.workspaceId);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const searchMentors = async (query) => {
    setMentorSearch(query);
    if (!query.trim()) { setMentorResults([]); return; }
    const { data } = await api.get("/users/search", { params: { query } });
    setMentorResults(data.users.filter((u) => ["teacher", "alumni"].includes(u.role)));
  };

  const sendRequest = async (e) => {
    e.preventDefault();
    setRequestError("");
    try {
      await api.post("/mentor-requests", { projectId: id, mentorId: selectedMentor._id, message, requestedDuration: duration });
      setRequestSent(true);
      setShowMentorForm(false);
    } catch (err) {
      setRequestError(err.response?.data?.message || "Couldn't send mentor request");
    }
  };

  if (loading) return (<DashboardLayout><div className="flex justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" /></div></DashboardLayout>);

  const isLeader = project.leader._id === user._id;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-xl space-y-6">
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-xl font-medium text-ink">{project.title}</h1>
              <p className="mt-1 text-sm text-slate-text">Led by <Link to={`/profile/${project.leader._id}`} className="hover:underline">{project.leader.name}</Link></p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[project.status]}`}>{project.status.replace("_", " ")}</span>
          </div>

          {project.description && <p className="mt-4 text-sm text-ink">{project.description}</p>}
          {project.technologies?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.map((t) => (<span key={t} className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink">{t}</span>))}
            </div>
          )}

          <div className="mt-4 flex gap-4 border-t border-ink/5 pt-4 text-sm">
            {project.githubLink && (<a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-text hover:text-ink"><Github size={15} /> Code</a>)}
            {project.projectLink && (<a href={project.projectLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-text hover:text-ink"><ExternalLink size={15} /> Live</a>)}
          </div>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <p className="text-sm font-semibold text-ink">Mentor</p>
          {project.mentor ? (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brass/10 text-brass-dark">{project.mentor.name?.[0]?.toUpperCase()}</div>
              <div><p className="text-sm font-medium text-ink">{project.mentor.name}</p><p className="text-xs capitalize text-slate-text">{project.mentor.role}</p></div>
              {workspaceId && (<Link to={`/workspaces/${workspaceId}`} className="ml-auto flex items-center gap-1 rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">Open workspace <ArrowRight size={14} /></Link>)}
            </div>
          ) : isLeader ? (
            <div className="mt-2">
              {requestSent ? (
                <p className="text-sm text-sage">Mentor request sent — waiting for a response.</p>
              ) : !showMentorForm ? (
                <button onClick={() => setShowMentorForm(true)} className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">Request a mentor</button>
              ) : (
                <form onSubmit={sendRequest} className="space-y-3">
                  <div className="relative">
                    <input value={selectedMentor ? selectedMentor.name : mentorSearch}
                      onChange={(e) => { setSelectedMentor(null); searchMentors(e.target.value); }}
                      placeholder="Search teacher or alumni by name"
                      className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
                    {mentorResults.length > 0 && !selectedMentor && (
                      <div className="absolute z-10 mt-1 w-full rounded-lg border border-ink/10 bg-white shadow-lg">
                        {mentorResults.map((m) => (
                          <button type="button" key={m._id} onClick={() => { setSelectedMentor(m); setMentorResults([]); }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-ink/5">
                            <span className="font-medium text-ink">{m.name}</span><span className="text-xs capitalize text-slate-text">{m.role}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <textarea required value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="Why do you want this mentor? What's the project about, and what guidance do you need?" rows={4}
                    className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
                  <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Expected duration (e.g. 8 weeks)"
                    className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
                  {requestError && <p className="text-sm text-red-600">{requestError}</p>}
                  <button type="submit" disabled={!selectedMentor} className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light disabled:opacity-40">Send request</button>
                </form>
              )}
            </div>
          ) : (<p className="mt-2 text-sm text-slate-text">No mentor assigned yet.</p>)}
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink"><Users size={15} /> Team ({members.length})</p>
          <div className="space-y-2">
            {members.map((m) => (
              <Link key={m._id} to={`/profile/${m._id}`} className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white p-3 transition hover:border-brass/40">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-xs font-medium text-ink">{m.name?.[0]?.toUpperCase()}</div>
                <div><p className="text-sm font-medium text-ink">{m.name}</p><p className="text-xs text-slate-text">{m.roleInProject}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
