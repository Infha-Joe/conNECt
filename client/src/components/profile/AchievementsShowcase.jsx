import { useState, useEffect, useRef } from "react";
import {
  FiAward,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiCalendar,
  FiMapPin,
  FiX,
  FiUploadCloud,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../services/api";

const ACHIEVEMENTS_CATEGORIES = [
  "Hackathon",
  "Coding Competition",
  "Project Competition",
  "Paper Presentation",
  "Technical Competition",
  "Academic Achievement",
  "Award/Prize",
  "Certification",
  "Workshop Achievement",
  "Internship Achievement",
  "Sports/Cultural Achievement",
  "Other",
];

const resolveMediaUrl = (url) => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  const serverBase = (api.defaults?.baseURL || "http://localhost:5005/api").replace(
    /\/api\/?$/,
    ""
  );
  return `${serverBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isValidHttpUrl = (string) => {
  if (!string || typeof string !== "string") return false;
  const trimmed = string.trim();
  if (!trimmed) return false;
  // Must strictly begin with http:// or https://
  if (!/^https?:\/\//i.test(trimmed)) return false;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const host = url.hostname;
    if (!host) return false;
    // Reject incomplete hostnames (must have valid characters and a domain dot or be localhost)
    if (!/^[a-zA-Z0-9.-]+$/.test(host)) return false;
    if (host !== "localhost" && !host.includes(".")) return false;
    return true;
  } catch (_) {
    return false;
  }
};

const AchievementsShowcase = ({ userId, isOwnProfile }) => {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Hackathon",
    description: "",
    organization: "",
    date: "",
    position: "",
    link: "",
  });

  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchAchievements();
    }
  }, [userId]);

  const fetchAchievements = async () => {
    try {
      const { data } = await api.get(`/achievements/user/${userId}`);
      setAchievements(data);
    } catch (err) {
      console.error("Failed to fetch achievements", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Hackathon",
      description: "",
      organization: "",
      date: "",
      position: "",
      link: "",
    });
    setProofFile(null);
    setProofPreview(null);
    setFormError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleOpenModal = (achievement = null) => {
    setFormError("");
    if (achievement) {
      setFormData({
        title: achievement.title || "",
        category: achievement.category || "Hackathon",
        description: achievement.description || "",
        organization: achievement.organization || "",
        date: achievement.date
          ? new Date(achievement.date).toISOString().split("T")[0]
          : "",
        position: achievement.position || "",
        link: achievement.link || "",
      });
      setProofPreview(achievement.proofUrl || null);
      setProofFile(null);
      setIsEditing(true);
      setCurrentId(achievement._id);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    setFormError("");
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      const allowedExts = ["jpg", "jpeg", "png", "webp", "avif", "gif", "bmp", "svg"];
      const isImage = file.type.startsWith("image/") || allowedExts.includes(ext);

      if (!isImage || !allowedExts.includes(ext)) {
        setFormError(
          `Unsupported image format (.${ext || "unknown"}). Supported formats: JPG, JPEG, PNG, WebP, AVIF.`
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFormError("File size exceeds 5MB limit. Please choose a smaller image.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setProofFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setProofPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title?.trim() || !formData.organization?.trim() || !formData.date) {
      setFormError("Title, organization, and date are required.");
      return;
    }

    // Validate external link if provided
    if (formData.link && formData.link.trim() !== "") {
      if (!isValidHttpUrl(formData.link)) {
        setFormError(
          "Please enter a complete valid URL starting with http:// or https:// (e.g. https://example.com)"
        );
        return;
      }
    }

    setIsSaving(true);
    let uploadedProofUrl = proofPreview && !proofFile ? proofPreview : null;

    if (proofFile) {
      const uploadData = new FormData();
      uploadData.append("media", proofFile);
      try {
        const res = await api.post("/upload", uploadData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.data && res.data.url) {
          uploadedProofUrl = res.data.url;
        } else {
          throw new Error("Upload response did not include a valid URL.");
        }
      } catch (err) {
        console.error("Proof upload failed:", err);
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "File upload failed. Please ensure the file is a valid image under 5MB.";
        setFormError(errorMsg);
        setIsSaving(false);
        // CRITICAL: DO NOT create broken achievement record if upload fails
        return;
      }
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      organization: formData.organization.trim(),
      description: formData.description?.trim() || "",
      position: formData.position?.trim() || "",
      link: formData.link?.trim() || "",
      proofUrl: uploadedProofUrl,
    };

    try {
      if (isEditing) {
        await api.put(`/achievements/${currentId}`, payload);
      } else {
        await api.post("/achievements", payload);
      }
      setShowModal(false);
      resetForm();
      fetchAchievements();
    } catch (err) {
      console.error("Failed to save achievement:", err);
      setFormError(err.response?.data?.message || "Failed to save achievement. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      try {
        await api.delete(`/achievements/${id}`);
        fetchAchievements();
      } catch (err) {
        alert("Failed to delete achievement");
      }
    }
  };

  if (isLoading) {
    return <div className="text-sm text-slate-500 py-4">Loading achievements...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <FiAward className="text-brand" /> Achievements Showcase
        </h2>
        {isOwnProfile && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors"
          >
            <FiPlus /> Add Achievement
          </button>
        )}
      </div>

      {achievements.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center text-slate-500">
          <FiAward size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-medium">No achievements to showcase yet.</p>
          {isOwnProfile && (
            <p className="text-xs mt-1">Add your hackathons, competitions, and awards here.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {achievements.map((ach) => (
            <div
              key={ach._id}
              className="group relative bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-[0_2px_12px_rgba(0,186,136,0.04)] rounded-2xl p-5 hover:shadow-[0_4px_20px_rgba(0,186,136,0.08)] transition-all overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-brand rounded-l-2xl opacity-80" />
              <div className="flex flex-col sm:flex-row gap-5">
                {ach.proofUrl && (
                  <div className="shrink-0">
                    <a
                      href={resolveMediaUrl(ach.proofUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Click to view certificate"
                      className="block group/proof rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:ring-2 hover:ring-brand/40 transition-all"
                    >
                      <img
                        src={resolveMediaUrl(ach.proofUrl)}
                        alt={`${ach.title} Proof`}
                        className="w-full sm:w-24 h-24 object-cover group-hover/proof:scale-105 transition-transform"
                      />
                    </a>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-[15px] font-bold text-ink leading-tight">{ach.title}</h3>
                      <p className="text-[12px] font-semibold text-brand tracking-wide uppercase mt-1 mb-2">
                        {ach.category}{" "}
                        {ach.position && (
                          <span className="text-slate-400 font-normal lowercase mx-1">•</span>
                        )}
                        {ach.position && <span className="text-amber-500">{ach.position}</span>}
                      </p>
                    </div>
                    {isOwnProfile && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(ach)}
                          className="p-1.5 text-slate-400 hover:text-brand bg-slate-50 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(ach._id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[12px] text-slate-500 mb-2 font-medium">
                    <span className="flex items-center gap-1.5">
                      <FiMapPin className="text-slate-400" /> {ach.organization}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="text-slate-400" />{" "}
                      {new Date(ach.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  {ach.description && (
                    <p className="text-[13px] text-slate-600 leading-relaxed mt-2">
                      {ach.description}
                    </p>
                  )}
                  {ach.link && (
                    <a
                      href={ach.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-[12px] font-semibold text-brand hover:text-emerald-700 transition-colors"
                    >
                      <FiExternalLink /> View Reference
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <h3 className="text-lg font-bold text-ink">
                {isEditing ? "Edit Achievement" : "Add Achievement"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle className="shrink-0 text-red-500" size={16} />
                    <span>{formError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormError("")}
                    className="text-red-400 hover:text-red-700 p-0.5 shrink-0"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formError) setFormError("");
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
                    placeholder="e.g. Smart India Hackathon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      if (formError) setFormError("");
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all bg-white"
                  >
                    {ACHIEVEMENTS_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Organization / Event *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => {
                      setFormData({ ...formData, organization: e.target.value });
                      if (formError) setFormError("");
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
                    placeholder="e.g. AICTE / NEC"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value });
                      if (formError) setFormError("");
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Position / Result
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => {
                      setFormData({ ...formData, position: e.target.value });
                      if (formError) setFormError("");
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
                    placeholder="e.g. 1st Place, Finalist"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (formError) setFormError("");
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all resize-none"
                  placeholder="Describe your achievement..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Proof / Certificate (Image)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/gif"
                  />

                  {proofPreview ? (
                    <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50/70 flex items-center gap-3">
                      <img
                        src={resolveMediaUrl(proofPreview)}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-200 bg-white shrink-0 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold text-slate-800 truncate"
                          title={proofFile ? proofFile.name : "Attached Certificate"}
                        >
                          {proofFile ? proofFile.name : "Attached Certificate"}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {proofFile ? formatFileSize(proofFile.size) : "Current proof image"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[11px] font-semibold text-brand hover:underline"
                          >
                            Change
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() => {
                              setProofFile(null);
                              setProofPreview(null);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="text-[11px] font-semibold text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-[76px] flex flex-col justify-center items-center border-2 border-dashed border-slate-200 hover:border-brand hover:bg-emerald-50/30 text-slate-500 hover:text-brand rounded-xl px-3 transition-colors text-center"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <FiUploadCloud size={16} className="text-brand" />
                        <span>Upload Certificate / Proof</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG, WebP, AVIF up to 5MB
                      </span>
                    </button>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      External Link
                    </label>
                    <span className="text-[11px] text-slate-400 font-normal">Optional</span>
                  </div>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => {
                      setFormData({ ...formData, link: e.target.value });
                      if (formError) setFormError("");
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
                    placeholder="https://example.com"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Complete URL starting with http:// or https://
                  </p>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-brand text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-[0_4px_14px_rgba(0,186,136,0.3)] disabled:opacity-70"
                >
                  {isSaving ? "Saving..." : "Save Achievement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsShowcase;
