import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import PostCard from "../components/PostCard";
import Skeleton from "../components/ui/Skeleton";

const SinglePostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data.post);
      } catch (err) {
        setError("Post not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col max-w-[760px] mx-auto">
        <div className="mb-6">
          <Link to="/network-feed" className="text-brand hover:underline font-semibold text-sm">
            &larr; Back to Feed
          </Link>
        </div>
        {loading ? (
          <Skeleton className="h-64 w-full rounded-2xl" />
        ) : error ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500">
            {error}
          </div>
        ) : post ? (
          <PostCard post={post} />
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default SinglePostView;
