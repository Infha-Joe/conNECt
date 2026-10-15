/* =========================================================================
 * ACADEMICS MODULE — Class View & Materials Sharing
 * ========================================================================= */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiCalendar, FiBook, FiUsers, FiFileText, FiLink,
  FiBell, FiAward, FiPlus, FiCheck, FiX, FiCopy,
  FiChevronLeft, FiUserPlus, FiEdit, FiTrash2, FiImage, FiPaperclip,
  FiChevronRight, FiDownload, FiExternalLink
} from "react-icons/fi";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

/* ─────────────────────────────────────────────
   Helper functions
───────────────────────────────────────────── */
const resolveMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/api\/?$/, "") : "http://localhost:5005";
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
};

const Toast = ({ msg, ok }) => (
  <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-xl px-5 py-3 shadow-xl text-white text-sm font-semibold animate-fade-in ${ok ? "bg-emerald-600" : "bg-red-600"}`}>
    {ok ? <FiCheck size={16} /> : "⚠"} {msg}
  </div>
);

const Spinner = ({ size = 6 }) => (
  <div className={`h-${size} w-${size} animate-spin rounded-full border-2 border-brand border-t-transparent`} />
);

const Avatar = ({ user: u, size = 10 }) => (
  <div className={`h-${size} w-${size} shrink-0 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200`}>
    {u?.profilePhoto
      ? <img src={resolveMediaUrl(u.profilePhoto)} alt={u?.name || "User"} className="w-full h-full object-cover" />
      : <span className="text-xs font-bold text-slate-500">{u?.name?.[0]?.toUpperCase() || "?"}</span>}
  </div>
);

const CodeChip = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 min-w-0">
      <span className="font-mono font-bold text-sm text-slate-700 tracking-widest truncate">{code}</span>
      <button onClick={copy} title="Copy code" className="flex items-center gap-1 text-slate-400 hover:text-teal-600 transition-colors shrink-0">
        {copied ? <FiCheck size={13} className="text-emerald-500" /> : <FiCopy size={13} />}
        <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
};

const todayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const fmtDate = (str) => {
  if (!str) return "";
  try {
    return new Date(str + "T12:00:00").toLocaleDateString(undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  } catch {
    return str;
  }
};

const fmtShort = (str) => {
  if (!str) return "";
  try {
    return new Date(str.includes("T") ? str : str + "T12:00:00").toLocaleDateString(undefined, {
      month: "short", day: "numeric", year: "numeric"
    });
  } catch {
    return str;
  }
};

/* ─────────────────────────────────────────────
   Calendar Component (Clean Horizontal / Balanced)
───────────────────────────────────────────── */
const CalendarWidget = ({ selectedDate, setSelectedDate, uniqueDates }) => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date((selectedDate || todayLocal()) + "T12:00:00"));

  const changeMonth = (offset) => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + offset);
    setCurrentMonth(d);
  };

  const getDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // adjust so Monday is 0, Sunday is 6
    const startDay = firstDay === 0 ? 6 : firstDay - 1; 

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const dStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push(dStr);
    }
    return days;
  };

  const days = getDays();
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const todayStr = todayLocal();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <FiCalendar size={16} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Class Calendar</h3>
            <p className="text-[11px] text-slate-400">Select date to view notes & materials</p>
          </div>
        </div>

        {/* Month switcher + Today button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5">
            <button onClick={() => changeMonth(-1)} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-white transition-colors" title="Previous Month">
              <FiChevronLeft size={16} />
            </button>
            <span className="font-bold text-xs text-slate-700 px-3 min-w-[120px] text-center">
              {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => changeMonth(1)} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-white transition-colors" title="Next Month">
              <FiChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => { setSelectedDate(todayStr); setCurrentMonth(new Date()); }}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-xs"
          >
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-1">
        {weekDays.map(wd => (
          <div key={wd} className="text-[11px] font-bold text-slate-400 uppercase py-1">{wd}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} className="h-9 sm:h-10" />;
          const isSelected = d === selectedDate;
          const isToday = d === todayStr;
          const hasRecord = uniqueDates.includes(d);

          let btnClass = "relative h-9 sm:h-10 flex items-center justify-center rounded-xl text-xs sm:text-sm font-semibold transition-all ";
          if (isSelected) {
            btnClass += "bg-teal-600 text-white shadow-sm font-bold scale-102";
          } else if (isToday) {
            btnClass += "bg-teal-50 text-teal-700 font-bold border border-teal-300";
          } else {
            btnClass += "text-slate-600 hover:bg-slate-100";
          }

          return (
            <button key={d} onClick={() => setSelectedDate(d)} className={btnClass}>
              <span>{parseInt(d.split('-')[2])}</span>
              {hasRecord && !isSelected && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-500" />}
              {hasRecord && isSelected && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const ClassView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [records, setRecords] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [selectedDate, setSelectedDate] = useState(todayLocal());
  const [activeTab, setActiveTab] = useState("calendar");
  const [toast, setToast] = useState(null);
  
  const showToast = useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }, []);

  /* ── edit class form ── */
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [classSaving, setClassSaving] = useState(false);
  const [editClassForm, setEditClassForm] = useState({ name: "", subject: "", section: "", semester: "", description: "" });

  /* ── record / notes form (Strictly for current date) ── */
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [recSaving, setRecSaving] = useState(false);
  const [recForm, setRecForm] = useState({
    date: todayLocal(),
    topic: "",
    notes: "",
    announcement: "",
    assignmentTitle: "",
    assignmentDesc: "",
    assignmentDue: "",
    linkTitle: "",
    linkUrl: "",
  });
  
  /* file upload */
  const [pendingFile, setPendingFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  /* ── invite student ── */
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invSearch, setInvSearch] = useState("");
  const [invResults, setInvResults] = useState([]);
  const [invLoading, setInvLoading] = useState(false);
  const [invSending, setInvSending] = useState(null);

  const [reqBusy, setReqBusy] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      const [clsRes, membRes, recRes] = await Promise.all([
        api.get(`/classrooms/${id}`),
        api.get(`/classrooms/${id}/members`),
        api.get(`/classrooms/${id}/records`),
      ]);
      setClassData(clsRes.data.class);
      setIsTeacher(Boolean(clsRes.data.isTeacher));
      setIsMember(Boolean(clsRes.data.isMember));
      setMembers(membRes.data.members || []);
      setRequests(membRes.data.requests || []);
      setRecords(recRes.data.records || []);
    } catch (err) {
      setPageError(err.response?.data?.message || "Failed to load class. You may not have access.");
    } finally {
      setPageLoading(false);
    }
  }, [id]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Authorization check for posting: Teachers, enrolled students, or admins can post notes
  const canPost = isTeacher || isMember || user?.role === "teacher" || user?.role === "admin";

  // Date state checks
  const isToday = selectedDate === todayLocal();
  const isPast = selectedDate < todayLocal();
  const isFuture = selectedDate > todayLocal();

  // Check if current user can manage/delete/edit a record
  const canManageRecord = (rec) => {
    if (isTeacher) return true;
    const creatorId = (rec.creator?._id || rec.creator)?.toString();
    const currentUserId = user?._id?.toString();
    return Boolean(creatorId && currentUserId && creatorId === currentUserId);
  };

  /* ─────────────────────────
     Edit / Delete Class
  ───────────────────────── */
  const openEditClass = () => {
    setEditClassForm({
      name: classData.name || "",
      subject: classData.subject || "",
      section: classData.section || "",
      semester: classData.semester || "",
      description: classData.description || ""
    });
    setShowEditClassModal(true);
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    if (!editClassForm.name.trim()) return showToast("Class Name is required", false);
    setClassSaving(true);
    try {
      const res = await api.put(`/classrooms/${id}`, editClassForm);
      setClassData(res.data.class);
      setShowEditClassModal(false);
      showToast("Class updated successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update class", false);
    } finally {
      setClassSaving(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!window.confirm("Delete this class?\n\nThis will remove all records and members. This action cannot be undone.")) return;
    try {
      await api.delete(`/classrooms/${id}`);
      navigate("/academic");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete class", false);
    }
  };

  /* ─────────────────────────
     Academic Record / Notes
  ───────────────────────── */
  const openRecordModal = () => {
    // Only current date can be posted
    setEditingRecordId(null);
    setRecForm({
      date: todayLocal(),
      topic: "",
      notes: "",
      announcement: "",
      assignmentTitle: "",
      assignmentDesc: "",
      assignmentDue: "",
      linkTitle: "",
      linkUrl: "",
    });
    setPendingFile(null);
    setFilePreview(null);
    setShowRecordModal(true);
  };

  const openEditRecordModal = (rec) => {
    setEditingRecordId(rec._id);
    setRecForm({
      date: rec.date || todayLocal(),
      topic: rec.topic || "",
      notes: rec.notes || "",
      announcement: rec.announcement || "",
      assignmentTitle: rec.assignment?.title || "",
      assignmentDesc: rec.assignment?.description || "",
      assignmentDue: rec.assignment?.dueDate ? rec.assignment.dueDate.split("T")[0] : "",
      linkTitle: rec.links?.[0]?.title || "",
      linkUrl: rec.links?.[0]?.url || "",
    });
    setPendingFile(null);
    setFilePreview(null);
    setShowRecordModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingFile(file);
    if (file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(file.name);
    }
  };

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    if (!recForm.topic.trim() && !recForm.notes.trim() && !recForm.announcement.trim() && !pendingFile && !recForm.linkUrl.trim()) {
      showToast("Please add at least notes, a topic, a file, or a link", false);
      return;
    }
    setRecSaving(true);
    try {
      let uploadedUrl = null;
      let uploadedName = null;
      if (pendingFile) {
        const formData = new FormData();
        formData.append("media", pendingFile);
        const upRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (!upRes.data.url) throw new Error(upRes.data.message || "File upload failed");
        uploadedUrl = upRes.data.url;
        uploadedName = pendingFile.name;
      }

      // New posts are locked to todayLocal()
      const targetDate = editingRecordId ? recForm.date : todayLocal();
      const payload = { date: targetDate };
      if (recForm.topic.trim()) payload.topic = recForm.topic.trim();
      if (recForm.notes.trim()) payload.notes = recForm.notes.trim();
      if (isTeacher && recForm.announcement.trim()) payload.announcement = recForm.announcement.trim();
      if (isTeacher && recForm.assignmentTitle.trim()) {
        payload.assignment = {
          title: recForm.assignmentTitle.trim(),
          description: recForm.assignmentDesc.trim(),
          dueDate: recForm.assignmentDue || undefined,
        };
      }
      if (uploadedUrl) {
        payload.files = [{ title: uploadedName || "Attached File", url: uploadedUrl }];
      } else if (editingRecordId) {
        const existing = records.find(r => r._id === editingRecordId);
        if (existing?.files?.length) {
          payload.files = existing.files;
        }
      }
      if (recForm.linkUrl.trim()) {
        payload.links = [{ title: recForm.linkTitle.trim() || recForm.linkUrl.trim(), url: recForm.linkUrl.trim() }];
      }

      if (editingRecordId) {
        const res = await api.put(`/classrooms/${id}/records/${editingRecordId}`, payload);
        setRecords(prev => prev.map(r => r._id === editingRecordId ? res.data.record : r));
        setSelectedDate(targetDate);
        showToast("Notes updated successfully!");
      } else {
        const res = await api.post(`/classrooms/${id}/records`, payload);
        setRecords(prev => [...prev, res.data.record]);
        setSelectedDate(targetDate);
        showToast("Notes posted successfully!");
      }
      setShowRecordModal(false);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || "Failed to save notes", false);
    } finally {
      setRecSaving(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("Delete this record entry?")) return;
    try {
      await api.delete(`/classrooms/${id}/records/${recordId}`);
      setRecords(prev => prev.filter(r => r._id !== recordId));
      showToast("Notes removed successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete notes", false);
    }
  };

  const handleRequest = async (reqId, action) => {
    setReqBusy(reqId);
    try {
      await api.patch(`/classrooms/${id}/requests/${reqId}`, { action });
      showToast(action === "accept" ? "Student accepted into class!" : "Request rejected");
      const membRes = await api.get(`/classrooms/${id}/members`);
      setMembers(membRes.data.members || []);
      setRequests(membRes.data.requests || []);
    } catch (err) {
      showToast(err.response?.data?.message || "Action failed", false);
    } finally {
      setReqBusy(null);
    }
  };

  const searchStudents = async (q) => {
    setInvSearch(q);
    if (!q.trim()) { setInvResults([]); return; }
    setInvLoading(true);
    try {
      const { data } = await api.get(`/users/search?query=${encodeURIComponent(q)}&role=student`);
      const memberIds = new Set(members.map(m => m._id));
      setInvResults((data.users || []).filter(u => !memberIds.has(u._id)));
    } catch { setInvResults([]); }
    finally { setInvLoading(false); }
  };

  const handleInvite = async (userId) => {
    setInvSending(userId);
    try {
      await api.post(`/classrooms/${id}/invite`, { userId });
      showToast("Invitation sent!");
      setInvResults(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send invite", false);
    } finally {
      setInvSending(null);
    }
  };

  const uniqueDates = [...new Set(records.map(r => r.date))];
  const dateRecords = records
    .filter(r => r.date === selectedDate)
    .sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  if (pageLoading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center py-32"><Spinner size={10} /></div>
    </DashboardLayout>
  );

  if (pageError) return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto mt-20 bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-sm">
        <p className="text-red-600 font-bold text-lg mb-2">Access Denied</p>
        <p className="text-red-500 text-sm mb-5 leading-relaxed">{pageError}</p>
        <Link to="/academic" className="text-teal-700 font-semibold text-sm hover:underline flex items-center gap-1.5 justify-center">
          <FiChevronLeft size={16} /> Back to Academics
        </Link>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <Link to="/academic" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors group">
            <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:border-teal-400 group-hover:text-teal-600 shadow-xs transition-colors">
              <FiChevronLeft size={16} />
            </div>
            <span>Back to Academics</span>
          </Link>
        </div>

        {/* ══════════════════════════
            CLASS HEADER
        ══════════════════════════ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="h-1.5 w-full bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 shrink-0" />
          
          <div className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-6 min-w-0">
            {/* Left Info */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {classData.subject && (
                  <span className="bg-teal-50 text-teal-700 border border-teal-200/60 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {classData.subject}
                  </span>
                )}
                {classData.section && (
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                    Section {classData.section}
                  </span>
                )}
                {classData.semester && (
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                    Semester {classData.semester}
                  </span>
                )}
                <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <FiUsers size={12} className="text-slate-400" /> {members.length} student{members.length !== 1 ? 's' : ''}
                </span>
              </div>

              <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight break-words" title={classData.name}>
                {classData.name}
              </h1>

              {classData.description && (
                <p className="text-slate-500 text-sm leading-relaxed max-w-3xl break-words">
                  {classData.description}
                </p>
              )}

              {classData.teacher?.name && (
                <div className="flex items-center gap-2.5 pt-1">
                  <Avatar user={classData.teacher} size={8} />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-700 block truncate">{classData.teacher.name}</span>
                    <span className="text-[11px] text-teal-600 font-semibold uppercase tracking-wider block">Course Instructor</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex flex-wrap lg:flex-col lg:items-end justify-start gap-3 shrink-0">
              {classData.inviteCode && (
                <div className="space-y-1 text-left lg:text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Class Invite Code</p>
                  <CodeChip code={classData.inviteCode} />
                </div>
              )}

              {isTeacher ? (
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={openEditClass} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-xs">
                    <FiEdit size={13} /> Edit Class
                  </button>
                  <button onClick={handleDeleteClass} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 bg-red-50/80 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors shadow-xs">
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold">
                  <FiCheck size={14} /> Enrolled Member
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-slate-50/80 border-t border-slate-200/80 px-4 py-2 flex items-center gap-2 overflow-x-auto min-w-0">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === "calendar"
                  ? "bg-white text-teal-700 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FiCalendar size={14} /> Calendar & Notes
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full font-bold text-slate-600">{records.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("members")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === "members"
                  ? "bg-white text-teal-700 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FiUsers size={14} /> Class Members
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full font-bold text-slate-600">{members.length}</span>
            </button>

            {isTeacher && (
              <button
                onClick={() => setActiveTab("requests")}
                className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === "requests"
                    ? "bg-white text-teal-700 shadow-xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <FiUserPlus size={14} /> Join Requests
                {requests.length > 0 && (
                  <span className="h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {requests.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════
            CALENDAR & NOTES TAB (CLEAN UNIFIED FULL-WIDTH FLOW)
        ══════════════════════════ */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
            
            {/* Top Calendar Selector (No empty space below!) */}
            <CalendarWidget
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              uniqueDates={uniqueDates}
            />

            {/* Date Header Card with SINGLE Post Notes button (only on today) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Selected Date</span>
                  {isToday ? (
                    <span className="bg-teal-100 text-teal-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Today
                    </span>
                  ) : isPast ? (
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Past Date (Read-Only)
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Future Date (Read-Only)
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-ink truncate">{fmtDate(selectedDate)}</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {dateRecords.length} {dateRecords.length === 1 ? 'entry' : 'entries'} for this date
                </p>
              </div>

              {/* POST NOTES BUTTON: SHOWN ONCE, AND ONLY ON CURRENT DATE */}
              {isToday && canPost && (
                <button
                  onClick={openRecordModal}
                  className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-teal-700 active:scale-95 transition-all bg-teal-600 shrink-0 self-start sm:self-auto"
                >
                  <FiPlus size={16} /> Post Notes / Material
                </button>
              )}
            </div>

            {/* Notes List for Selected Date */}
            {dateRecords.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-12 px-6 text-center space-y-2">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                  <FiBook size={24} />
                </div>
                <h3 className="font-bold text-slate-700 text-base">
                  {isToday
                    ? "No notes or materials have been shared today yet."
                    : isPast
                    ? `No notes or materials were recorded for ${fmtDate(selectedDate)}.`
                    : `No notes or materials scheduled for ${fmtDate(selectedDate)}.`}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isToday
                    ? "Use the Post Notes button above to share lecture notes, question banks, or documents for today."
                    : "You can view existing notes or select Today from the calendar above to post new materials."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {dateRecords.map((rec) => {
                  const isCreator = canManageRecord(rec);
                  const creator = rec.creator || classData.teacher;
                  return (
                    <article key={rec._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                      {/* Header row */}
                      <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50/70 p-4 sm:px-5 sm:py-3.5 gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar user={creator} size={9} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-800 truncate">{creator?.name || "Instructor"}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                creator?.role === "teacher" || creator?.role === "faculty"
                                  ? "bg-teal-50 text-teal-700 border-teal-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}>
                                {creator?.role === "teacher" || creator?.role === "faculty" ? "Instructor" : "Student"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {rec.createdAt ? new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Shared"}
                            </p>
                          </div>
                        </div>

                        {isCreator && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => openEditRecordModal(rec)}
                              className="text-slate-400 hover:text-teal-600 p-2 transition-colors bg-white rounded-lg border border-slate-200 shadow-xs"
                              title="Edit Notes"
                            >
                              <FiEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(rec._id)}
                              className="text-slate-400 hover:text-red-500 p-2 transition-colors bg-white rounded-lg border border-slate-200 shadow-xs"
                              title="Delete Notes"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-4">
                        {/* Topic / Subject header */}
                        {rec.topic ? (
                          <div>
                            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-1">Topic</p>
                            <h3 className="text-base sm:text-lg font-bold text-ink leading-snug break-words">{rec.topic}</h3>
                          </div>
                        ) : null}

                        {/* Notes text */}
                        {rec.notes && (
                          <div>
                            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                              <FiFileText size={12} /> Notes & Explanation
                            </p>
                            <div className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50/80 px-4 py-3.5 rounded-xl border border-slate-100 leading-relaxed break-words font-sans">
                              {rec.notes}
                            </div>
                          </div>
                        )}

                        {/* Attachments / Files */}
                        {rec.files?.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                              <FiPaperclip size={12} /> Attachments & Documents ({rec.files.length})
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                              {rec.files.map((f, i) => {
                                const url = resolveMediaUrl(f.url);
                                const isImg = url?.match(/\.(jpeg|jpg|gif|png|webp|bmp|avif)$/i);
                                const isPdf = url?.match(/\.pdf$/i);
                                const isDoc = url?.match(/\.(doc|docx|ppt|pptx|xls|xlsx|txt)$/i);

                                if (isImg) {
                                  return (
                                    <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 shadow-xs hover:border-teal-300 transition-all flex flex-col group">
                                      <div className="h-44 w-full bg-slate-100 flex items-center justify-center overflow-hidden relative">
                                        <img
                                          src={url}
                                          alt={f.title || "Image"}
                                          className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-200"
                                        />
                                      </div>
                                      <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                                        <span className="text-xs font-semibold text-slate-700 truncate" title={f.title || "Image"}>
                                          {f.title || "Image Attachment"}
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0">
                                          <a
                                            href={url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                                          >
                                            <FiExternalLink size={12} /> Open
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                  <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl shadow-xs hover:border-teal-300 transition-colors group">
                                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                        isPdf
                                          ? "bg-red-50 text-red-600 border border-red-100"
                                          : isDoc
                                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                                          : "bg-teal-50 text-teal-600 border border-teal-100"
                                      }`}>
                                        <FiFileText size={20} />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="font-bold text-sm text-slate-800 truncate group-hover:text-teal-700 transition-colors" title={f.title}>
                                          {f.title || (isPdf ? "PDF Document" : "Download File")}
                                        </p>
                                        <p className="text-[11px] text-slate-400 font-medium">
                                          {isPdf ? "PDF Document" : isDoc ? "Office Document" : "Attached Document"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        title="Open file"
                                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-300 transition-colors shadow-xs"
                                      >
                                        <FiExternalLink size={14} />
                                      </a>
                                      <a
                                        href={url}
                                        download={f.title || "document"}
                                        title="Download file"
                                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-300 transition-colors shadow-xs"
                                      >
                                        <FiDownload size={14} />
                                      </a>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Web Links */}
                        {rec.links?.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                              <FiLink size={12} /> Reference Links
                            </p>
                            <div className="space-y-2 min-w-0">
                              {rec.links.map((l, i) => (
                                <a
                                  key={i}
                                  href={l.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl hover:border-teal-400 hover:text-teal-700 transition-colors break-all"
                                >
                                  <span className="flex items-center gap-2 truncate">
                                    <FiLink size={14} className="shrink-0 text-slate-400" /> {l.title || l.url}
                                  </span>
                                  <FiExternalLink size={13} className="shrink-0 text-slate-400" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Announcement */}
                        {rec.announcement && (
                          <div className="flex gap-3 bg-amber-50/90 border border-amber-200/90 p-4 rounded-xl min-w-0">
                            <FiBell className="text-amber-500 shrink-0 mt-0.5" size={18} />
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Official Announcement</p>
                              <p className="text-sm text-amber-950 font-medium leading-relaxed break-words">{rec.announcement}</p>
                            </div>
                          </div>
                        )}

                        {/* Assignment */}
                        {rec.assignment?.title && (
                          <div className="bg-indigo-50/90 border border-indigo-200/90 p-4.5 rounded-xl min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                                <FiAward size={12} /> Class Assignment
                              </p>
                              {rec.assignment.dueDate && (
                                <span className="text-[10px] font-bold bg-white text-indigo-600 border border-indigo-200 px-2.5 py-1 rounded-lg shadow-xs whitespace-nowrap">
                                  Due: {fmtShort(rec.assignment.dueDate)}
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-indigo-950 text-base mb-1.5 break-words">{rec.assignment.title}</h4>
                            {rec.assignment.description && (
                              <p className="text-sm text-indigo-800 leading-relaxed break-words">{rec.assignment.description}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════
            MEMBERS TAB
        ══════════════════════════ */}
        {activeTab === "members" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold text-ink">Class Members</h2>
                <p className="text-sm text-slate-500 mt-0.5">{members.length} active member{members.length !== 1 ? "s" : ""}</p>
              </div>
              {isTeacher && (
                <button
                  onClick={() => { setInvSearch(""); setInvResults([]); setShowInviteModal(true); }}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white shadow hover:opacity-90 active:scale-95 transition-all bg-teal-600"
                >
                  <FiUserPlus size={15} /> Invite Students
                </button>
              )}
            </div>
            {members.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl py-12 text-center text-slate-400 text-sm">
                No active students yet.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {members.map(m => (
                  <div key={m._id} className="flex items-center gap-3 p-3.5 border border-slate-100 rounded-xl hover:shadow-xs transition-shadow bg-slate-50/50 min-w-0">
                    <Avatar user={m} size={10} />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-ink truncate">{m.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{m.role || "Student"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════
            REQUESTS TAB
        ══════════════════════════ */}
        {activeTab === "requests" && isTeacher && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-w-0">
            <h2 className="text-xl font-bold text-ink mb-1">Join Requests</h2>
            <p className="text-sm text-slate-500 mb-6">{requests.length} pending request{requests.length !== 1 ? "s" : ""}</p>
            {requests.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl py-12 text-center text-slate-400 text-sm">
                No pending requests.
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map(req => (
                  <div key={req._id} className="flex flex-wrap items-center justify-between p-4 bg-slate-50 border border-slate-150 rounded-xl gap-4 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar user={req.user} size={10} />
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-ink truncate">{req.user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{req.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        disabled={reqBusy === req._id}
                        onClick={() => handleRequest(req._id, "accept")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 transition-colors"
                      >
                        {reqBusy === req._id ? <Spinner size={3} /> : <FiCheck size={13} />} Accept
                      </button>
                      <button
                        disabled={reqBusy === req._id}
                        onClick={() => handleRequest(req._id, "reject")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition-colors"
                      >
                        <FiX size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════
          EDIT CLASS MODAL
      ══════════════════════════ */}
      {showEditClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-ink text-xl">Edit Class</h3>
              <button onClick={() => setShowEditClassModal(false)} className="h-8 w-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 transition-colors">×</button>
            </div>
            <form onSubmit={handleUpdateClass} className="p-6 space-y-4 overflow-y-auto min-h-0">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Class Name *</label>
                <input required value={editClassForm.name} onChange={e => setEditClassForm({...editClassForm, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                <input value={editClassForm.subject} onChange={e => setEditClassForm({...editClassForm, subject: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-600" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Section</label>
                  <input value={editClassForm.section} onChange={e => setEditClassForm({...editClassForm, section: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Semester</label>
                  <input value={editClassForm.semester} onChange={e => setEditClassForm({...editClassForm, semester: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-600" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                <textarea rows={3} value={editClassForm.description} onChange={e => setEditClassForm({...editClassForm, description: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-600 resize-none" />
              </div>
              <div className="flex gap-3 pt-2 shrink-0">
                <button type="button" onClick={() => setShowEditClassModal(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={classSaving} className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white bg-teal-600 shadow-sm hover:opacity-90 disabled:opacity-60">{classSaving ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════
          POST / EDIT RECORD MODAL (LOCKED TO CURRENT DATE FOR NEW POSTS)
      ══════════════════════════ */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="min-w-0">
                <h3 className="font-bold text-ink text-lg truncate">
                  {editingRecordId ? "Edit Notes & Materials" : "Post Notes & Materials"}
                </h3>
                <p className="text-xs text-teal-700 font-semibold mt-0.5 truncate">
                  {fmtDate(recForm.date)}
                </p>
              </div>
              <button onClick={() => setShowRecordModal(false)} className="h-8 w-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 transition-colors shrink-0">×</button>
            </div>
            
            <form onSubmit={handleSaveRecord} className="p-6 space-y-5 overflow-y-auto min-h-0">
              <div className="grid sm:grid-cols-[170px_1fr] gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Date</label>
                  <div className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2 text-sm text-slate-700 font-semibold flex items-center justify-between">
                    <span>{fmtShort(recForm.date)}</span>
                    <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {recForm.date === todayLocal() ? "Today" : "Locked"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Topic / Title (Optional)</label>
                  <input
                    placeholder="e.g. Unit 2 Question Bank or Preparatory Notes"
                    value={recForm.topic}
                    onChange={e => setRecForm({ ...recForm, topic: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-teal-600"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Notes & Content</label>
                <textarea
                  rows={4}
                  placeholder="Type notes, lecture summary, key formulas, or explanations..."
                  value={recForm.notes}
                  onChange={e => setRecForm({ ...recForm, notes: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-600 resize-none leading-relaxed"
                />
              </div>

              {/* Attachments Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-w-0">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <FiPaperclip size={14} className="text-teal-600" /> Attachments & Web Links
                </label>
                <div className="grid md:grid-cols-2 gap-4 min-w-0">
                   <div className="space-y-2 min-w-0">
                     <p className="text-xs font-semibold text-slate-600">Upload File (PDF / Documents / Images)</p>
                     <input
                       type="file"
                       ref={fileInputRef}
                       onChange={handleFileChange}
                       className="hidden"
                       accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.xls,.xlsx"
                     />
                     {!pendingFile ? (
                       <button
                         type="button"
                         onClick={() => fileInputRef.current?.click()}
                         className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl py-4 text-sm font-semibold text-slate-500 hover:text-teal-600 hover:border-teal-400 hover:bg-teal-50/50 transition-colors"
                       >
                         <FiPaperclip size={18} /> Choose PDF or Document
                       </button>
                     ) : (
                       <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white flex items-center justify-between min-w-0 shadow-xs">
                          <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                            {pendingFile.type.startsWith('image/') ? (
                              <img src={filePreview} alt="preview" className="h-10 w-10 object-cover rounded-lg shadow-xs shrink-0" />
                            ) : (
                              <div className="h-10 w-10 bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center rounded-lg shrink-0">
                                <FiFileText size={20} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-800 truncate block">{pendingFile.name}</span>
                              <span className="text-[10px] text-slate-400">{(pendingFile.size / 1024).toFixed(0)} KB</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPendingFile(null);
                              setFilePreview(null);
                              if(fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0 transition-colors"
                          >
                            <FiX size={16} />
                          </button>
                       </div>
                     )}
                   </div>

                   <div className="space-y-2 min-w-0">
                     <p className="text-xs font-semibold text-slate-600">Add Web Resource</p>
                     <input
                       placeholder="Link Title (e.g. Reference Video)"
                       value={recForm.linkTitle}
                       onChange={e => setRecForm({ ...recForm, linkTitle: e.target.value })}
                       className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-600 bg-white"
                     />
                     <input
                       placeholder="https://example.com"
                       value={recForm.linkUrl}
                       onChange={e => setRecForm({ ...recForm, linkUrl: e.target.value })}
                       className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-600 bg-white"
                     />
                   </div>
                </div>
              </div>

              {/* Teacher-only Announcement & Assignment */}
              {isTeacher && (
                <>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 min-w-0">
                    <label className="block text-xs font-bold text-amber-700 uppercase mb-2 flex items-center gap-1.5">
                      <FiBell size={12} /> Class Announcement (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Important announcement for the whole class..."
                      value={recForm.announcement}
                      onChange={e => setRecForm({ ...recForm, announcement: e.target.value })}
                      className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 bg-white resize-none"
                    />
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3 min-w-0">
                    <label className="block text-xs font-bold text-indigo-700 uppercase flex items-center gap-1.5">
                      <FiAward size={12} /> Class Assignment (Optional)
                    </label>
                    <input
                      placeholder="Assignment Title"
                      value={recForm.assignmentTitle}
                      onChange={e => setRecForm({ ...recForm, assignmentTitle: e.target.value })}
                      className="w-full border border-indigo-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white"
                    />
                    <textarea
                      rows={2}
                      placeholder="Assignment instructions..."
                      value={recForm.assignmentDesc}
                      onChange={e => setRecForm({ ...recForm, assignmentDesc: e.target.value })}
                      className="w-full border border-indigo-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white resize-none"
                    />
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-semibold text-indigo-700">Due Date:</label>
                      <input
                        type="date"
                        value={recForm.assignmentDue}
                        onChange={e => setRecForm({ ...recForm, assignmentDue: e.target.value })}
                        className="border border-indigo-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-indigo-400 bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recSaving}
                  className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white bg-teal-600 shadow-md hover:bg-teal-700 disabled:opacity-60 flex justify-center items-center gap-2 transition-all active:scale-98"
                >
                  {recSaving ? <><Spinner size={4}/> Saving...</> : (editingRecordId ? "Update Notes" : "Post Notes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════
          INVITE MODAL
      ══════════════════════════ */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="font-bold text-ink text-lg">Invite Students</h3>
              <button onClick={() => setShowInviteModal(false)} className="h-8 w-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 transition-colors">×</button>
            </div>
            <div className="p-6 overflow-y-auto min-h-0">
              <input
                placeholder="Search students..."
                value={invSearch}
                onChange={e => searchStudents(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-600 mb-4"
                autoFocus
              />
              <div className="min-h-[80px] max-h-[50vh] overflow-y-auto space-y-2">
                {invLoading ? (
                  <div className="flex justify-center py-8"><Spinner size={6} /></div>
                ) : invResults.length > 0 ? (
                  invResults.map(u => (
                    <div key={u._id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 min-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar user={u} size={9} />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-ink truncate">{u.name}</p>
                          <p className="text-xs text-slate-500 truncate">{u.email}</p>
                        </div>
                      </div>
                      <button
                        disabled={invSending === u._id}
                        onClick={() => handleInvite(u._id)}
                        className="ml-3 shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 disabled:opacity-50 transition-colors"
                      >
                        <FiUserPlus size={12} /> Invite
                      </button>
                    </div>
                  ))
                ) : invSearch.trim() && !invLoading ? (
                  <div className="text-center py-6 text-slate-400 text-sm">No students found</div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-sm">Type name or email to search</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </DashboardLayout>
  );
};

export default ClassView;
