import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Award } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import PostCard from "../components/PostCard";
import FollowButton from "../components/FollowButton";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState({ followerCount: 0, followingCount: 0 });
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/users/${id}`),
      api.get(`/posts/user/${id}`),
      api.get(`/users/${id}/follow-stats`),
      api.get(`/badges/user/${id}`),
    ])
      .then(([userRes, postsRes, statsRes, badgesRes]) => {
        setProfile(userRes.data.user);
        setPosts(postsRes.data.posts);
        setStats(statsRes.data);
        setBadges(badgesRes.data.badges);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (<DashboardLayout><p className="text-sm text-slate-text">User not found.</p></DashboardLayout>);
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-xl space-y-6">
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/5 font-display text-2xl font-medium text-ink">
                {profile.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-xl font-medium text-ink">{profile.name}</h1>
                <p className="text-sm capitalize text-slate-text">{profile.role} · {profile.department?.name || "No department"}</p>
              </div>
            </div>
            {!isOwnProfile && <FollowButton userId={profile._id} />}
          </div>

          {profile.bio && <p className="mt-4 text-sm text-ink">{profile.bio}</p>}

          <div className="mt-4 flex gap-6 border-t border-ink/5 pt-4 text-sm">
            <p><span className="font-semibold text-ink">{posts.length}</span> <span className="text-slate-text">Posts</span></p>
            <p><span className="font-semibold text-ink">{stats.followerCount}</span> <span className="text-slate-text">Followers</span></p>
            <p><span className="font-semibold text-ink">{stats.followingCount}</span> <span className="text-slate-text">Following</span></p>
          </div>

          {profile.skills?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-brass/10 px-2.5 py-1 text-xs font-medium text-brass-dark">{skill}</span>
              ))}
            </div>
          )}

          {badges.length > 0 && (
            <div className="mt-4 border-t border-ink/5 pt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-text">Achievements</p>
              <div className="flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span key={b._id} title={b.description} className="flex items-center gap-1.5 rounded-full border border-brass/30 bg-brass/5 px-3 py-1 text-xs font-medium text-brass-dark">
                    <Award size={12} />
                    {b.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-sm text-slate-text">No posts yet.</p>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
