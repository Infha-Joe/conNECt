import { useState, useEffect } from "react";
import { Plus, Building2 } from "lucide-react";
import api from "../services/api";

const AdminDepartmentsTab = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", themeColor: "#1E3A8A" });
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/departments");
    setDepartments(data.departments);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/departments", form);
      setForm({ name: "", code: "", themeColor: "#1E3A8A" });
      setShowCreate(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create department");
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowCreate((s) => !s)}
        className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-ink-light"
      >
        <Plus size={16} />
        New department
      </button>

      {showCreate && (
        <form onSubmit={handleCreate} className="mt-3 space-y-3 rounded-xl border border-ink/10 bg-white p-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Department name"
              className="rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass"
            />
            <input
              required
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
              placeholder="Code (e.g. CSE)"
              className="rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-text">Theme color</label>
            <input
              type="color"
              value={form.themeColor}
              onChange={(e) => setForm((p) => ({ ...p, themeColor: e.target.value }))}
              className="h-9 w-14 rounded-lg border border-ink/15"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-white hover:bg-ink-light">
            Create
          </button>
        </form>
      )}

      <div className="mt-4 space-y-2">
        {loading && (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
          </div>
        )}

        {!loading && departments.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-text">No departments yet — create one to enable registration.</p>
        )}

        {departments.map((d) => (
          <div key={d._id} className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: d.themeColor }}
            >
              <Building2 size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{d.name}</p>
              <p className="text-xs text-slate-text">{d.code}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDepartmentsTab;
