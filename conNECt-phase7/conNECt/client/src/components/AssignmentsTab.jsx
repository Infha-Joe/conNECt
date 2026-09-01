import { useState, useEffect } from "react";
import { Plus, Clock, CheckCircle2, RotateCcw } from "lucide-react";
import api from "../services/api";

const AssignmentsTab = ({ workspaceId, isMentor }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", deadline: "" });
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get(`/workspaces/${workspaceId}/assignments`);
    setAssignments(data.assignments);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [workspaceId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post(`/workspaces/${workspaceId}/assignments`, form);
    setForm({ title: "", description: "", deadline: "" });
    setShowCreate(false);
    load();
  };

  return (
    <div>
      {isMentor && (
        <div className="mb-4">
          <button onClick={() => setShowCreate((s) => !s)} className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">
            <Plus size={16} /> New assignment
          </button>
          {showCreate && (
            <form onSubmit={handleCreate} className="mt-3 space-y-3 rounded-xl border border-ink/10 bg-white p-4">
              <input required value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Assignment title"
                className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description / instructions" rows={3}
                className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
              <input required type="datetime-local" value={form.deadline} onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
                className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
              <button type="submit" className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">Post assignment</button>
            </form>
          )}
        </div>
      )}

      {loading && (<div className="flex justify-center py-10"><div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" /></div>)}
      {!loading && assignments.length === 0 && <p className="py-10 text-center text-sm text-slate-text">No assignments posted yet.</p>}

      <div className="space-y-3">
        {assignments.map((a) => (
          <div key={a._id} className="rounded-xl border border-ink/10 bg-white p-4">
            <button onClick={() => setExpanded(expanded === a._id ? null : a._id)} className="flex w-full items-start justify-between text-left">
              <div>
                <p className="text-sm font-semibold text-ink">{a.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-text"><Clock size={12} />Due {new Date(a.deadline).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
              {!isMentor && a.mySubmission && (
                <span className={`shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${a.mySubmission.status === "reviewed" ? "bg-sage/10 text-sage" : a.mySubmission.status === "resubmission_requested" ? "bg-red-50 text-red-600" : "bg-brass/10 text-brass-dark"}`}>
                  {a.mySubmission.status === "reviewed" && <CheckCircle2 size={12} />}
                  {a.mySubmission.status === "resubmission_requested" && <RotateCcw size={12} />}
                  {a.mySubmission.status.replace("_", " ")}
                </span>
              )}
            </button>
            {expanded === a._id && (
              <div className="mt-3 border-t border-ink/5 pt-3">
                {a.description && <p className="text-sm text-ink">{a.description}</p>}
                {isMentor ? (<MentorSubmissionsView assignmentId={a._id} />) : (<StudentSubmissionForm assignment={a} onSubmitted={load} />)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const StudentSubmissionForm = ({ assignment, onSubmitted }) => {
  const [fileUrl, setFileUrl] = useState(assignment.mySubmission?.fileUrl || "");
  const [comment, setComment] = useState(assignment.mySubmission?.comment || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/assignments/${assignment._id}/submissions`, { fileUrl, comment });
      onSubmitted();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      {assignment.mySubmission?.feedback && (
        <div className="rounded-lg bg-brass/5 p-3">
          <p className="text-xs font-semibold text-brass-dark">Mentor feedback</p>
          <p className="mt-1 text-sm text-ink">{assignment.mySubmission.feedback}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="Link to your work (GitHub, doc, drive link, etc.)"
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a note (optional)" rows={2}
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
        <button type="submit" disabled={submitting || !fileUrl.trim()} className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light disabled:opacity-40">
          {assignment.mySubmission ? "Resubmit" : "Submit"}
        </button>
      </form>
    </div>
  );
};

const MentorSubmissionsView = ({ assignmentId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});

  const load = async () => {
    setLoading(true);
    const { data } = await api.get(`/assignments/${assignmentId}/submissions`);
    setSubmissions(data.submissions);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [assignmentId]);

  const sendFeedback = async (submissionId, requestResubmission) => {
    await api.put(`/submissions/${submissionId}/feedback`, { feedback: feedbackDrafts[submissionId] || "", requestResubmission });
    load();
  };

  if (loading) return <p className="mt-3 text-sm text-slate-text">Loading submissions…</p>;
  if (submissions.length === 0) return <p className="mt-3 text-sm text-slate-text">No submissions yet.</p>;

  return (
    <div className="mt-3 space-y-3">
      {submissions.map((s) => (
        <div key={s._id} className="rounded-lg border border-ink/10 p-3">
          <p className="text-sm font-medium text-ink">{s.student.name}</p>
          {s.fileUrl && (<a href={s.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-brass-dark hover:underline">View submission</a>)}
          {s.comment && <p className="mt-1 text-sm text-ink">{s.comment}</p>}
          <textarea value={feedbackDrafts[s._id] ?? s.feedback ?? ""} onChange={(e) => setFeedbackDrafts((p) => ({ ...p, [s._id]: e.target.value }))} placeholder="Write feedback…" rows={2}
            className="mt-2 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
          <div className="mt-2 flex gap-2">
            <button onClick={() => sendFeedback(s._id, false)} className="rounded-lg bg-ink px-3 py-1 text-xs font-semibold text-parchment hover:bg-ink-light">Mark reviewed</button>
            <button onClick={() => sendFeedback(s._id, true)} className="rounded-lg border border-ink/15 px-3 py-1 text-xs font-medium text-ink hover:bg-ink/5">Request resubmission</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentsTab;
