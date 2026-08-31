import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Card from "./ui/Card";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";
import { FiImage } from "react-icons/fi";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/posts", { content });
      setContent("");
      setIsFocused(false);
      if (onPostCreated) onPostCreated(data.post);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
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
              rows={isFocused || content ? "3" : "1"}
              className="w-full resize-none rounded-lg border-0 bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-slate-500/70 transition-all focus:ring-0"
            />
          </div>
        </div>
        
        {error && <p className="mt-2 text-sm text-red-600 pl-14">{error}</p>}
        
        {(isFocused || content) && (
          <div className="mt-3 flex items-center justify-between pl-14 border-t border-slate-200 pt-3">
            <div className="flex gap-2">
              <button 
                type="button" 
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-ink transition-colors"
              >
                <FiImage size={16} className="text-brand" />
                <span>Media</span>
              </button>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="px-6 rounded-full"
            >
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};

export default CreatePost;
