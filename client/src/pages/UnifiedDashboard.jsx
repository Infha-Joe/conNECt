import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { FiEdit3, FiPlus } from "react-icons/fi";
import Avatar from "../components/ui/Avatar";
import PostCard from "../components/PostCard";
import Skeleton from "../components/ui/Skeleton";
import api from "../services/api";

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/posts/user");
      setPosts(data.posts);
    } catch (err) {
      console.error("Failed to fetch my posts", err);
      setError("Unable to load your posts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10">
          <div className="flex items-center gap-5">
            <Avatar name={user?.name} src={user?.profilePhoto} className="w-20 h-20 text-2xl shrink-0 shadow-sm border border-border" />
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-ink tracking-tight mb-1">{user?.name}</h1>
              <p className="text-primary font-semibold tracking-wide text-sm mb-2">
                {user?.role === "student" ? "Student" : user?.role === "alumni" ? "Alumni" : user?.role === "teacher" ? "Faculty" : user?.role} 
                {user?.department?.name ? `   ${user?.department?.name}` : ""}
              </p>
              <p className="text-ink-light text-sm max-w-2xl">
                {user?.bio || "No bio added yet."}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 shrink-0 mt-4 sm:mt-0">
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-surface border border-border rounded-md text-sm font-bold text-ink hover:bg-background transition-colors shadow-sm">
              <FiEdit3 size={16} /> Edit Profile
            </button>
            <Link to="/create-post" className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-md text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
              <FiPlus size={16} /> Create a Post
            </Link>
          </div>
        </div>

        {/* Home Navigation Tabs */}
        <div className="flex w-full justify-between border-b border-border mb-10 overflow-x-auto scrollbar-hide">
          <button
            className="flex-1 pb-4 px-2 text-sm font-bold tracking-wide transition-all whitespace-nowrap border-b-[3px] border-primary text-primary text-center"
          >
            MY POSTS
          </button>
          <button
            onClick={() => navigate("/network")}
            className="flex-1 pb-4 px-2 text-sm font-bold tracking-wide transition-all whitespace-nowrap border-b-[3px] border-transparent text-ink-light hover:text-ink hover:border-border text-center"
          >
            FIND PEOPLE
          </button>
          <button
            onClick={() => navigate("/mentorship")}
            className="flex-1 pb-4 px-2 text-sm font-bold tracking-wide transition-all whitespace-nowrap border-b-[3px] border-transparent text-ink-light hover:text-ink hover:border-border text-center"
          >
            PROJECTS & MENTORSHIP
          </button>
        </div>

        {/* My Posts Feed */}
        <div className="w-full flex flex-col max-w-[900px]">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="w-32 h-4" />
                      <Skeleton className="w-24 h-3" />
                    </div>
                  </div>
                  <Skeleton className="w-full h-24 mb-4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center font-medium">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white border border-border rounded-xl shadow-sm">
              <p className="text-ink-light mb-4">You haven't shared anything yet.</p>
              <Link to="/create-post" className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md text-sm font-bold hover:bg-primary-dark transition-colors">
                <FiPlus size={16} /> Create a Post
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onLike={() => {
                    setPosts(posts.map(p => {
                      if (p._id === post._id) {
                        const isLiked = p.likes.includes(user._id);
                        return {
                          ...p,
                          likes: isLiked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                        };
                      }
                      return p;
                    }));
                  }}
                  onDelete={() => {
                    setPosts(posts.filter(p => p._id !== post._id));
                  }} 
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UnifiedDashboard;
