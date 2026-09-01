import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderGit2 } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

const statusStyles = { pending: "bg-slate-text/10 text-slate-text", in_progress: "bg-brass/10 text-brass-dark", completed: "bg-sage/10 text-sage" };

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", technologies: "" });
  const { user } = useAuth();

  const loadProjects = async () => {
    setLoading(true);
    const { data } = await api.get("/projects", { params: { mine: true } });
    setProjects(data.projects);
    setLoading(false);
  };

  useEffect(() => { loadProjects(); }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/projects", { title: form.title, description: form.description, technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean) });
    setForm({ title: "", description: "", technologies: "" });
    setShowCreate(false);
    loadProjects();
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-ink">My Projects</h1>
          {user?.role === "student" && (
            <button onClick={() => setShowCreate((s) => !s)} className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-parchment transition hover:bg-ink-light">
              <Plus size={16} /> New project
            </button>
          )}
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="mt-4 space-y-3 rounded-xl border border-ink/10 bg-white p-4">
            <input required name="title" value={form.title} onChange={handleChange} placeholder="Project title"
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="What are you building?" rows={3}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
            <input name="technologies" value={form.technologies} onChange={handleChange} placeholder="Technologies (comma separated) — React, Node.js, MongoDB"
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
            <button type="submit" className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">Create project</button>
          </form>
        )}

        <div className="mt-6 space-y-3">
          {loading && (<div className="flex justify-center py-10"><div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" /></div>)}
          {!loading && projects.length === 0 && (
            <div className="rounded-xl border border-dashed border-ink/15 bg-white px-6 py-10 text-center">
              <p className="font-display text-lg text-ink">No projects yet</p>
              <p className="mt-1 text-sm text-slate-text">{user?.role === "student" ? "Create a project to start building and find a mentor." : "Projects you mentor will show up here once accepted."}</p>
            </div>
          )}
          {projects.map((p) => (
            <Link key={p._id} to={`/projects/${p._id}`} className="flex items-center justify-between rounded-xl border border-ink/10 bg-white p-4 transition hover:border-brass/40">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 text-ink"><FolderGit2 size={18} /></div>
                <div>
                  <p className="text-sm font-semibold text-ink">{p.title}</p>
                  <p className="text-xs text-slate-text">Led by {p.leader?.name} {p.mentor && `· Mentored by ${p.mentor.name}`}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[p.status]}`}>{p.status.replace("_", " ")}</span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Projects;
