import { useState, useEffect } from "react";
import api from "../services/api";

const FollowButton = ({ userId }) => {
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${userId}/follow-stats`).then(({ data }) => setFollowed(data.followedByMe)).finally(() => setLoading(false));
  }, [userId]);

  const toggle = async () => {
    setFollowed((prev) => !prev);
    try {
      if (followed) await api.delete(`/users/${userId}/follow`);
      else await api.post(`/users/${userId}/follow`);
    } catch {
      setFollowed((prev) => !prev);
    }
  };

  if (loading) return null;

  return (
    <button onClick={toggle}
      className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
        followed ? "border border-ink/15 text-ink hover:bg-ink/5" : "bg-ink text-parchment hover:bg-ink-light"
      }`}>
      {followed ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
