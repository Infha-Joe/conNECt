import { useState, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Card from "./ui/Card";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";
import { FiImage, FiVideo, FiX } from "react-icons/fi";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaType, setMediaType] = useState(""); // 'image' or 'video'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (50MB)
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

      const { data } = await api.post("/posts", { content, mediaUrl, mediaType });
      setContent("");
      removeMedia();
      setIsFocused(false);
      if (onPostCreated) onPostCreated(data.post);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <Avatar name={user?.name} size="md" className="shrink-0" />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="What's on your mind?"
              rows={isFocused || content || mediaPreview ? "3" : "1"}
              className="w-full resize-none rounded-lg border-0 bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-slate-500/70 transition-all focus:ring-0"
            />
          </div>
        </div>

        {mediaPreview && (
          <div className="relative mt-3 ml-14 rounded-xl overflow-hidden border border-border bg-black/5">
            <button
              type="button"
              onClick={removeMedia}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
            >
              <FiX size={16} />
            </button>
            {mediaType === 'image' ? (
              <img src={mediaPreview} alt="Preview" className="w-full max-h-96 object-contain" />
            ) : (
              <video src={mediaPreview} controls className="w-full max-h-96 bg-black" />
            )}
          </div>
        )}
        
        {error && <p className="mt-2 text-sm text-red-600 pl-14">{error}</p>}
        
        {(isFocused || content || mediaPreview) && (
          <div className="mt-3 flex items-center justify-between pl-14 border-t border-slate-200 pt-3">
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
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-ink transition-colors"
              >
                <FiImage size={16} className="text-brand" />
                <span>Add Photo</span>
              </button>
              <button 
                type="button" 
                onClick={() => { fileInputRef.current.accept="video/*"; fileInputRef.current.click(); }}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-ink transition-colors"
              >
                <FiVideo size={16} className="text-brand" />
                <span>Add Video</span>
              </button>
            </div>
            <Button
              type="submit"
              disabled={isLoading || (!content.trim() && !mediaFile)}
              className="px-6 rounded-full"
            >
              {isLoading ? "Publishing..." : "Post"}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};

export default CreatePost;