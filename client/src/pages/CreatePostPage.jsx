import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import { FiImage, FiVideo, FiX, FiArrowLeft } from "react-icons/fi";

const CreatePostPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaType, setMediaType] = useState(""); // 'image' or 'video'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50000000) {
      setError("File size must be less than 50MB");
      return;
    }

    setMediaFile(file);
    setMediaType(type);
    setMediaPreview(URL.createObjectURL(file));
    setError(null);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview("");
    setMediaType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile) return;

    setIsLoading(true);
    setError(null);
    try {
      let mediaUrl = "";
      
      if (mediaFile) {
        const formData = new FormData();
        formData.append("media", mediaFile);
        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        mediaUrl = uploadRes.data.url;
      }

      const payload = { content };
      if (mediaUrl) {
        payload.mediaUrl = mediaUrl;
        payload.mediaType = mediaType;
      }
      await api.post("/posts", payload);
      navigate("/network-feed");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col max-w-[900px]">
        
        <div className="flex items-center gap-4 mb-6">
          <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface hover:bg-background border border-border transition-colors">
            <FiArrowLeft size={20} className="text-ink-light" />
          </button>
          <h2 className="text-xl font-bold text-ink tracking-tight">Create Post</h2>
        </div>

        <div className="card-standard p-6 border-border/50 ring-1 ring-border shadow-sm bg-white rounded-xl">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <Avatar name={user?.name} src={user?.profilePhoto} className="w-12 h-12 shrink-0 border border-border" />
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share something with your campus..."
                  rows="6"
                  className="w-full resize-none rounded-lg border-2 border-border/50 bg-surface/50 p-4 text-base text-ink outline-none placeholder:text-slate-500/70 transition-all focus:border-primary/50 focus:bg-white"
                  autoFocus
                />
              </div>
            </div>

            {mediaPreview && (
              <div className="relative mt-4 ml-16 rounded-xl overflow-hidden border border-border bg-black/5">
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10 shadow-sm"
                >
                  <FiX size={18} />
                </button>
                {mediaType === 'image' ? (
                  <img src={mediaPreview} alt="Preview" className="w-full max-h-[400px] object-contain" />
                ) : (
                  <video src={mediaPreview} controls className="w-full max-h-[400px] bg-black" />
                )}
              </div>
            )}
            
            {error && <div className="mt-4 ml-16 p-3 rounded-lg bg-red-50 border border-red-100 text-sm font-medium text-red-600">{error}</div>}
            
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between ml-16 pt-4 border-t border-border/50 gap-4">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    if(e.target.files[0]?.type.startsWith('video/')) {
                      handleFileSelect(e, 'video');
                    } else {
                      handleFileSelect(e, 'image');
                    }
                  }}
                />
                <button 
                  type="button" 
                  onClick={() => { fileInputRef.current.accept="image/*"; fileInputRef.current.click(); }}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-ink-light hover:bg-surface border border-transparent hover:border-border transition-all"
                >
                  <FiImage size={18} className="text-primary" />
                  <span>Add Photo</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => { fileInputRef.current.accept="video/*"; fileInputRef.current.click(); }}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-ink-light hover:bg-surface border border-transparent hover:border-border transition-all"
                >
                  <FiVideo size={18} className="text-primary" />
                  <span>Add Video</span>
                </button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || (!content.trim() && !mediaFile)}
                className="px-8 rounded-full sm:w-auto w-full"
              >
                {isLoading ? "Publishing..." : "Post to Campus"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatePostPage;
